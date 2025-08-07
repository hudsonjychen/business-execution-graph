from datetime import timedelta
from collections import defaultdict
from typing import Dict, Any, Set, List
from pm4py.objects.ocel.obj import OCEL
from .map import map_object_id_to_type, map_process_to_event, map_process_to_object
from .get_entities import get_processes
from .update_stats import update_process_interactions_count, update_process_interactions_flow_time


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
    process_interactions = dict()
    flow_time = dict()

    processes = get_processes(ocel)

    oid_to_type_map = map_object_id_to_type(ocel)

    object_event_streams = _build_object_event_streams(ocel, processes)

    for obj in object_event_streams:
        obj_type = oid_to_type_map[obj]
        stream = object_event_streams[obj]

        for i in range(len(stream)-1):
            pids1 = stream[i]['pids']
            pids2 = stream[i + 1]['pids']
            ts1 = stream[i]['timestamp']
            ts2 = stream[i + 1]['timestamp']
            delta = ts2 - ts1
            for p1 in pids1:
                for p2 in pids2:
                    if p1 != p2:
                        if p1 not in process_interactions:
                            process_interactions[p1] = dict()
                        if p2 not in process_interactions[p1]:
                            process_interactions[p1][p2] = dict()
                            process_interactions[p1][p2]['total_count'] = 0
                            process_interactions[p1][p2]['object_type'] = dict()
                            process_interactions[p1][p2]['object'] = set()
                        if obj_type not in process_interactions[p1][p2]['object_type']:
                            process_interactions[p1][p2]['object_type'][obj_type] = dict()
                            process_interactions[p1][p2]['object_type'][obj_type]['count'] = 0
                            process_interactions[p1][p2]['object_type'][obj_type]['average_flow_time'] = timedelta()

                        process_interactions[p1][p2]['object'].add(obj)

                        if p1 not in flow_time:
                            flow_time[p1] = dict()
                        if p2 not in flow_time[p1]:
                            flow_time[p1][p2] = dict()
                        if obj not in flow_time[p1][p2]:
                            flow_time[p1][p2][obj] = set()
                        flow_time[p1][p2][obj].add(delta)

    update_process_interactions_count(process_interactions, oid_to_type_map)
    update_process_interactions_flow_time(process_interactions, oid_to_type_map, flow_time)

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