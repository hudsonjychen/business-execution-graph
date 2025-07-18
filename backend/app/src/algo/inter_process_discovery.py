from datetime import timedelta
from collections import defaultdict
from typing import Dict, Any, Set, List
import pm4py
from pm4py.objects.ocel.obj import OCEL
from .ocel_filtering import filter_ocel_by_object_id
from .ocel_mapping import map_object_id_to_type, map_process_to_activity
from .ocel_entity_extraction import get_activities, get_events, get_object_types, get_processes, get_objects
from ..statistics.pdg_statistics import get_obj_flow_time, update_pdg_count, update_pdg_flow_time

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
    objects = get_objects(ocel)

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

    update_pdg_count(process_interactions, oid_to_type_map)
    update_pdg_flow_time(process_interactions, oid_to_type_map, flow_time)

    return process_interactions


def _get_process_data(ocel: OCEL) -> Dict[str, Any]:

    process_data = dict()

    object_types = get_object_types(ocel)
    processes = get_processes(ocel)
    objects = get_objects(ocel)

    object_id_type_mapping = map_object_id_to_type(ocel)
    process_event_activity_mapping = map_process_to_activity(ocel)

    for process in processes:
        process_data[process] = {
            'activity': process_event_activity_mapping[process],
            'object_type': {ot: {'count': 0} for ot in object_types},
            'object': set(),
            'total_count': 0
        }

    event_to_processes = defaultdict(set)
    for _, row in ocel.relations.iterrows():
        oid = row[ocel.object_id_column]
        eid = row[ocel.event_id_column]
        if oid in processes:
            event_to_processes[eid].add(oid)

    for eid, group in ocel.relations.groupby(ocel.event_id_column, sort=False):
        related_processes = event_to_processes.get(eid)
        if not related_processes:
            continue

        object_ids = group[ocel.object_id_column].tolist()

        for pro in related_processes:
            oid_list = process_data[pro]['object']
            for obj_id in object_ids:
                if obj_id == pro or obj_id in oid_list:
                    continue

                if obj_id in object_id_type_mapping:
                    ot = object_id_type_mapping[obj_id]
                    process_data[pro]['object_type'][ot]['count'] += 1
                    oid_list.add(obj_id)
                    process_data[pro]['total_count'] += 1

    for pro in processes:
        process_data[pro]['object_type'] = {
            ot: v for ot, v in process_data[pro]['object_type'].items() if v['count'] > 0
        }

    return process_data


def _get_process_data_original(ocel: OCEL) -> Dict[str, Any]:
    """
    Get process data from an object-centric event log (OCEL).
    """
    process_data = dict()

    object_types = get_object_types(ocel)
    processes = get_processes(ocel)
    objects = get_objects(ocel)

    object_id_type_mapping = map_object_id_to_type(ocel)
    process_event_activity_mapping = map_process_to_activity(ocel)

    filtered_ocels = dict()
    for pro in processes:
        filtered_ocel = filter_ocel_by_object_id(
            ocel,
            pro
        )
        filtered_ocels[pro] = filtered_ocel

    for process in processes:
        process_data[process] = dict()
        process_data[process]['activity'] = process_event_activity_mapping[process]

    for pro in filtered_ocels:

        count = dict()
        total_count = 0
        for ot in object_types:
            count[ot] = dict()
            count[ot]['count'] = 0

        oid_list = set()

        ocel_re = filtered_ocels[pro]

        for key, group in ocel_re.groupby(ocel.event_id_column, sort=False):
            group_oid_column = group[ocel.object_id_column]
            for obj_id in group_oid_column:
                for oid in objects:
                    if oid == obj_id and oid not in oid_list:
                        ot = object_id_type_mapping[oid]
                        count[ot]['count'] += 1
                        oid_list.add(oid)

        updated_count = {k: v  for k, v in count.items()  if count[k]['count'] > 0}
        process_data[pro]['object_type'] = updated_count

        for ot in count:
            total_count += count[ot]['count']
        process_data[pro]['total_count'] = total_count

        process_data[pro]['object'] = oid_list

    return process_data


def _get_overview_data(ocel: OCEL) -> Dict[str, Any]:
    """
    Get overview data from an object-centric event log (OCEL).
    """
    overview_data = dict()

    object_types = get_object_types(ocel)
    objects = get_objects(ocel)
    processes = get_processes(ocel)
    activities = get_activities(ocel)
    events = get_events(ocel)

    overview_data = {
        "processes": {
            "list": processes,
            "count": len(processes)
        },
        "object_types": {
            "list": object_types,
            "count": len(object_types)
        },
        "objects": {
            "list": objects,
            "count": len(objects)
        },
        "activities": {
            "list": activities,
            "count": len(activities)
        },
        "event": {
            "list": events,
            "count": len(events)
        }
    }

    return overview_data


def discover_interactions(ocel: OCEL) -> Dict[str, Any]:
    ocel_interactions = dict()
    
    ocel_interactions["overview_data"] = _get_overview_data(ocel)
    ocel_interactions["process_interactions"] = _discover_process_interactions(ocel)
    ocel_interactions["process_data"] = _get_process_data(ocel)

    return ocel_interactions


if __name__ == "__main__":
    path = "/Users/I767410/Downloads/procel.json"
    log = pm4py.read_ocel2_json(path)
    print(discover_interactions(log))