from collections import defaultdict
import copy
from typing import Dict, Any, Set, List
from pm4py.objects.ocel.obj import OCEL
from .get_entities import get_processes
from .discovery import _build_object_event_streams
import pandas as pd
import pm4py

def _unfold_ocel(ocel: OCEL, process: str) -> OCEL:
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

    events_final = (
        relations_final[['ocel:eid', 'ocel:timestamp', 'ocel:activity']]
        .drop_duplicates(subset='ocel:eid', keep='first')
        .reset_index(drop=True)
    )
    events_final = events_final.sort_values('ocel:timestamp').reset_index(drop=True)
    
    return OCEL(relations=relations_final, events=events_final, objects=ocel.objects, globals=ocel.globals, parameters=ocel.parameters, o2o=ocel.o2o, e2e=ocel.e2e, object_changes=ocel.object_changes)


def _get_graph_data(ocel: OCEL, processes: set) -> dict:
    graph_data = {
        'nodes': {
            'object_types': set(),
            'processes': set(),
            'activities': set()
        },
        'edges': {
            'act_act': defaultdict(lambda: defaultdict(lambda: defaultdict(set))),
            'act_p': defaultdict(lambda: defaultdict(lambda: defaultdict(set))),
            'act_ot': {
                'start': defaultdict(lambda: defaultdict(set)),
                'end': defaultdict(lambda: defaultdict(set))
            }
        }
    }

    ocdfg = pm4py.discover_ocdfg(ocel)

    graph_data['nodes'] = {
        'object_types': ocdfg['object_types'] - {'process'},
        'processes': {p for p in processes if p in ocdfg['activities']},
        'activities': {a for a in ocdfg['activities'] if a not in processes}
    }

    nodes = graph_data['nodes']
    edges = graph_data['edges']

    for ot, pairs in ocdfg['edges']['unique_objects'].items():
        for pair, objects in pairs.items():
            source, target = pair[0], pair[1]
            if source in nodes['processes'] or target in nodes['processes']:
                if (source in nodes['processes']) != (target in nodes['processes']):
                    edges['act_p'][source][target][ot].update(objects)
                continue
            edges['act_act'][source][target][ot].update(objects)
    
    for ot, data in ocdfg['start_activities']['unique_objects'].items():
        for act, objects in data.items():
            if act in nodes['processes']:
                continue
            edges['act_ot']['start'][ot][act].update(objects)
    
    for ot, data in ocdfg['end_activities']['unique_objects'].items():
        for act, objects in data.items():
            if act in nodes['processes']:
                continue
            edges['act_ot']['end'][ot][act].update(objects)

    print(graph_data)
    return graph_data


def get_ocdfg_data(ocel: OCEL, processes: set) -> dict:
    ocdfg_data = dict()

    for process in processes:
        unfolded_ocel = _unfold_ocel(ocel, process)
        graph_data = _get_graph_data(unfolded_ocel, processes)
        ocdfg_data[process] = graph_data
    
    return ocdfg_data