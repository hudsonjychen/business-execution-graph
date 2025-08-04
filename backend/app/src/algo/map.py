from typing import Dict
from collections import defaultdict
from pm4py.objects.ocel.obj import OCEL
from .get_entities import get_object_types, get_processes


def map_object_id_to_type(ocel: OCEL) -> Dict[str, str]:
    """
    Creates a mapping from object ID to object type in an OCEL.

    Args:
        ocel (OCEL): The object-centric event log.

    Returns:
        Dict[str, str]: A dictionary mapping each object ID to its corresponding object type.
    """
    return ocel.objects.set_index(ocel.object_id_column)[ocel.object_type_column].to_dict()


def map_process_to_object_type(ocel: OCEL) -> Dict[str, set[str]]:
    """
    Creates a mapping from process type to object type in an OCEL.

    Args:
        ocel (OCEL): The object-centric event log.

    Returns:
        Dict[str, str]: A dictionary mapping each process type to its related object type.
    """
    object_types = get_object_types(ocel)
    processes = get_processes(ocel)
    process_object_type_mapping = dict()

    for key, group in ocel.relations.groupby(ocel.event_id_column):
        for pro in processes:
            if pro in group[ocel.object_id_column].values:
                if pro not in process_object_type_mapping:
                    process_object_type_mapping[pro] = set()
                for i in range(len(group)):
                    if group[ocel.object_id_column].iloc[i] in object_types:
                        process_object_type_mapping[pro].add(group[ocel.object_id_column].iloc[i])

    return process_object_type_mapping


def map_process_to_activity(ocel: OCEL) -> Dict[str, set[str]]:
    """
    Creates a mapping from process type to activity in an OCEL.

    Args:
        ocel (OCEL): The object-centric event log.

    Returns:
        Dict[str, str]: A dictionary mapping each process type to its related activity.
    """
    processes = get_processes(ocel)
    process_activity_mapping = dict()

    for key, group in ocel.relations.groupby(ocel.event_activity):
        for pro in processes:
            if pro in group[ocel.object_id_column].values:
                if pro not in process_activity_mapping:
                    process_activity_mapping[pro] = set()
                process_activity_mapping[pro].add(key)

    return process_activity_mapping


def map_eid_to_activity(ocel: OCEL):
    eid_activity_mapping = dict()

    for _, row in ocel.events.iterrows():
        eid = row[ocel.event_id_column]
        activity = row[ocel.event_activity]
        eid_activity_mapping[eid] = activity
    
    return eid_activity_mapping


def map_process_to_event(ocel: OCEL) -> Dict[str, dict]:
    """
    Creates a mapping from process type to event list in an OCEL.

    Args:
        ocel (OCEL): The object-centric event log.

    Returns:
        Dict[str, dict]: A dictionary mapping each process type to its related event list.
    """
    processes = get_processes(ocel)
    process_event_mapping = dict()

    eid_activity_mapping = map_eid_to_activity(ocel)

    for activity, group in ocel.relations.groupby(ocel.event_activity):
        for pro in processes:
            if pro in group[ocel.object_id_column].values:
                if pro not in process_event_mapping:
                    process_event_mapping[pro] = dict()
                process_event_mapping[pro][activity] = set()

    for eid, group in ocel.relations.groupby(ocel.event_id_column):
        for pro in processes:
            if pro in group[ocel.object_id_column].values:
                activity = eid_activity_mapping[eid]
                process_event_mapping[pro][activity].add(eid)

    return process_event_mapping


def map_process_to_object(ocel: OCEL) -> Dict[str, dict]:
    processes = get_processes(ocel)
    process_object_mapping = dict()

    oid_type_mapping = map_object_id_to_type(ocel)

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
            for oid in object_ids:
                if oid in processes:
                    continue
                ot = oid_type_mapping[oid]
                if pro not in process_object_mapping:
                    process_object_mapping[pro] = dict()
                if ot not in process_object_mapping[pro]:
                    process_object_mapping[pro][ot] = set()
                process_object_mapping[pro][ot].add(oid)
        
    return process_object_mapping