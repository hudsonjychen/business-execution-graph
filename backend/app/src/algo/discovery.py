from datetime import timedelta
from collections import defaultdict
from typing import Dict, Any, Set, List
from pm4py.objects.ocel.obj import OCEL
from .map import map_object_id_to_type, map_process_to_event, map_process_to_object
from .get_entities import get_processes


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
                    inter['total_count'] += 1
                    obj_type_stat = inter['object_type'][obj_type]
                    obj_type_stat['count'] += 1

                    prev_avg = obj_type_stat['average_flow_time'].total_seconds()
                    new_avg = (prev_avg*(obj_type_stat['count']-1) + delta.total_seconds()) / obj_type_stat['count']
                    obj_type_stat['average_flow_time'] = timedelta(seconds=new_avg)

    for p1 in process_interactions:
        for p2 in process_interactions[p1]:
            inter = process_interactions[p1][p2]
            avg_seconds = 0.0
            total_count = 0

            for obj_type_stat in inter['object_type'].values():
                avg_time = obj_type_stat['average_flow_time'].total_seconds()
                count = obj_type_stat['count']

                if count == 0:
                    continue

                new_total = total_count + count
                avg_seconds = (avg_seconds * total_count + avg_time * count) / new_total
                total_count = new_total

            inter['average_flow_time'] = timedelta(seconds=avg_seconds)

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


def discover(ocel: OCEL) -> Dict[str, Any]:
    discover_results = dict()
    
    discover_results["interaction_data"] = _discover_process_interactions(ocel)
    discover_results["process_data"] = _get_process_data(ocel)

    return discover_results