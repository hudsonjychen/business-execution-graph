from datetime import timedelta
from collections import defaultdict
from typing import Dict, Any, Set, List
from pm4py.objects.ocel.obj import OCEL
from .map import map_object_id_to_type, map_process_to_event, map_process_to_object
from .get_entities import get_processes
import pandas as pd


def _build_object_event_streams(ocel: OCEL, processes: Set[str]) -> Dict[str, List[Dict]]:
    streams = defaultdict(list)
    sorted_relations = ocel.relations.sort_values(by='ocel:timestamp')

    event_to_processes = defaultdict(set)
    for _, row in sorted_relations.iterrows():
        oid = row[ocel.object_id_column]
        if oid in processes:
            eid = row[ocel.event_id_column]
            event_to_processes[eid].add(oid)

    for _, row in sorted_relations.iterrows():
        oid = row[ocel.object_id_column]
        if oid in processes: 
            continue

        eid = row[ocel.event_id_column]
        timestamp = row['ocel:timestamp']

        related_processes = list(event_to_processes[eid])

        if not related_processes:
            continue

        streams[oid].append({
            "eid": eid,
            "timestamp": timestamp,
            "pids": related_processes
        })

    return streams


def _discover_process_interactions(ocel: OCEL) -> Dict[str, Any]:
    """
    Discovers the process interactions from an object-centric event log (OCEL).
    """
    process_interactions = defaultdict(lambda: defaultdict(lambda: {
        'total_count': 0,
        'object_type': defaultdict(lambda: {'count': 0, 'average_flow_time': timedelta()}),
        'object': set(),
        'average_flow_time': timedelta()
    }))

    flow_time = defaultdict(
        lambda: defaultdict(
            lambda: defaultdict(list)
        )
    )

    processes = get_processes(ocel)
    oid_to_type_map = map_object_id_to_type(ocel)
    object_event_streams = _build_object_event_streams(ocel, processes)

    for obj, stream in object_event_streams.items():
        obj_type = oid_to_type_map[obj]

        for i in range(len(stream)-1):
            pids1, pids2 = stream[i]['pids'], stream[i + 1]['pids']
            ts1, ts2 = stream[i]['timestamp'], stream[i + 1]['timestamp']
            delta = ts2 - ts1
            for p1 in pids1:
                for p2 in pids2:
                    if p1 == p2:
                        continue
                    inter = process_interactions[p1][p2]
                    inter['object'].add(obj)
                    obj_type_stat = inter['object_type'][obj_type]
                    flow_time[p1][p2][obj].append(delta.total_seconds())

    for p1 in process_interactions:
        for p2 in process_interactions[p1]:
            inter = process_interactions[p1][p2]
            inter['total_count'] = len(inter['object'])
                
            for obj_type in inter['object_type']:
                for obj in inter['object']:
                    if oid_to_type_map[obj] == obj_type:
                        inter['object_type'][obj_type]['count'] += 1

    for p1 in process_interactions:
        for p2 in process_interactions[p1]:
            inter = process_interactions[p1][p2]
            flow_data = flow_time[p1][p2]
            
            all_deltas = []
            object_type_deltas = defaultdict(list)
            
            for obj in inter['object']:
                obj_type = oid_to_type_map.get(obj)
                if obj_type and obj in flow_data:
                    deltas = flow_data[obj]
                    all_deltas.extend(deltas)
                    object_type_deltas[obj_type].extend(deltas)
            
            for obj_type in inter['object_type']:
                if obj_type in object_type_deltas and object_type_deltas[obj_type]:
                    avg_seconds = sum(object_type_deltas[obj_type]) / len(object_type_deltas[obj_type])
                    inter['object_type'][obj_type]['average_flow_time'] = timedelta(seconds=avg_seconds)
                else:
                    inter['object_type'][obj_type]['average_flow_time'] = timedelta()
            
            if all_deltas:
                overall_avg = sum(all_deltas) / len(all_deltas)
                inter['average_flow_time'] = timedelta(seconds=overall_avg)
            else:
                inter['average_flow_time'] = timedelta()

    return process_interactions


def _get_process_data(ocel: OCEL) -> Dict[str, Any]:

    process_data = dict()

    processes = get_processes(ocel)

    process_event_mapping = map_process_to_event(ocel)
    process_object_mapping = map_process_to_object(ocel)

    for process in processes:
        event = process_event_mapping[process]
        object = process_object_mapping[process]
        process_data[process] = {
            'activity': event,
            'activity_list': list(event.keys()),
            'total_event_count': sum(len(act) for act in event.values()),
            'object_type': object,
            'object_type_list': list(object.keys()),
            'total_object_count': sum(len(ot) for ot in object.values())
        }

    return process_data


def _ocel_adapter(ocel: OCEL, process: str) -> OCEL:
    relations = ocel.relations

    processes = get_processes(ocel)
    object_event_streams = _build_object_event_streams(ocel, processes)

    process_info = {}
    valid_eid_obj_pairs = set() # keep the rows with the keys and drop others
    other_eid_obj_pairs = set() # add process:activity for the rows with the keys
    
    for obj, stream in object_event_streams.items():
        for item in stream:
            eid, pids = item['eid'], item['pids']
            key = (eid, obj)
            process_info[key] = pids
            if process in pids:
                valid_eid_obj_pairs.add(key)
            if set(pids) != {process}:
                other_eid_obj_pairs.add(key)
    
    mask_not_process = relations['ocel:qualifier'] != 'process'
    relations_filtered = relations[mask_not_process].copy()
    
    relations_filtered['_temp_key'] = list(zip(
        relations_filtered['ocel:eid'], 
        relations_filtered['ocel:oid']
    ))
    
    new_rows_data = []
    
    def counter_factory():
        return {'_max': 0}
    eid_counter = defaultdict(counter_factory) # {p1: {e1: 1, e2: 2, _max: 2}}
    
    for _, row in relations_filtered.iterrows():
        key = row['_temp_key']
        eid = key[0]
        if key in other_eid_obj_pairs:
            pids = process_info[key]
            for p in pids:
                if p != process:
                    if p not in eid_counter:
                        eid_counter[p]['_max'] = 1
                        eid_counter[p][eid] = eid_counter[p]['_max']
                    if eid not in eid_counter[p]:
                        eid_counter[p]['_max'] += 1
                        eid_counter[p][eid] = eid_counter[p]['_max']
                    new_eid = eid_counter[p][eid]
                    new_row = {
                        'ocel:eid': f'{p}-{new_eid}',
                        'ocel:activity': p,
                        'ocel:timestamp': row['ocel:timestamp'],
                        'ocel:oid': row['ocel:oid'],
                        'ocel:type': row['ocel:type'],
                        'ocel:qualifier': 'process',
                        '_temp_key': (p, p)
                    }
                    new_rows_data.append(new_row)
                    
    if new_rows_data:
        new_rows_df = pd.DataFrame(new_rows_data)
        relations_result = pd.concat([relations_filtered, new_rows_df], ignore_index=True)
    else:
        relations_result = relations_filtered.reset_index(drop=True)

    def should_keep_row(key):
        if isinstance(key, tuple) and key[0] == key[1] and key[0] in processes:
            return True
        return key in valid_eid_obj_pairs

    mask_keep = relations_result['_temp_key'].apply(should_keep_row)
    relations_final = relations_result[mask_keep].copy()

    relations_final = relations_final.drop('_temp_key', axis=1, errors='ignore')
    relations_final = relations_final.sort_values('ocel:timestamp').reset_index(drop=True)

    print(relations_final)

    events_final = (
        relations_final[['ocel:eid', 'ocel:timestamp', 'ocel:activity']]
        .drop_duplicates(subset='ocel:eid', keep='first')
        .reset_index(drop=True)
    )
    events_final = events_final.sort_values('ocel:timestamp').reset_index(drop=True)
    
    return OCEL(relations=relations_final, events=events_final, objects=ocel.objects, globals=ocel.globals, parameters=ocel.parameters, o2o=ocel.o2o, e2e=ocel.e2e, object_changes=ocel.object_changes)



def discover(ocel: OCEL) -> Dict[str, Any]:
    discover_results = dict()
    
    discover_results["interaction_data"] = _discover_process_interactions(ocel)
    discover_results["process_data"] = _get_process_data(ocel)

    return discover_results