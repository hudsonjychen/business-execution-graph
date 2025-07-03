from datetime import timedelta
from typing import Dict, Any
from pm4py.objects.ocel.obj import OCEL
from .ocel_filtering import filter_ocel_by_object_id, filter_ocel_by_object_type
from .ocel_mapping import map_object_id_to_type, map_process_type_to_activity
from .ocel_entity_extraction import get_object_types, get_process_types, get_objects
from ..statistics.pdg_statistics import get_obj_flow_time, update_pdg_count, update_pdg_flow_time

def discover_process_dependency_graph(ocel: OCEL) -> Dict[str, Any]:
    """
    Discovers the process dependency graph from an object-centric event log (OCEL).

    Args:
        ocel (OCEL): The object-centric event log containing events, objects, and relations.

    Returns:
        Dict[str, Any]: A nested dictionary representing the process dependency graph.
    """
    pdg = dict()
    flow_time = dict()

    process_types = get_process_types(ocel)
    objects = get_objects(ocel)

    oid_to_type_map = map_object_id_to_type(ocel)

    filtered_ocels = dict()
    for obj in objects:
        filtered_ocel = filter_ocel_by_object_id(
            ocel,
            obj
        )
        filtered_ocels[obj] = filtered_ocel

    for obj in filtered_ocels:
        obj_type = oid_to_type_map[obj]

        ocel_re = filtered_ocels[obj]
        filtered_ocel_re = ocel_re.loc[ocel_re[ocel.object_type_column].isin(process_types)]
        filtered_ocel_re = filtered_ocel_re.sort_values(by='ocel:timestamp')

        grouped = list(filtered_ocel_re.groupby(ocel.event_id_column, sort=False))

        for i in range(len(grouped) - 1):
            (group1_key, group1), (group2_key, group2) = grouped[i], grouped[i + 1]
            process1 = set(group1[ocel.object_type_column])
            process2 = set(group2[ocel.object_type_column])
            for p1 in process1:
                for p2 in process2:
                    if p1 != p2:
                        if p1 not in pdg:
                            pdg[p1] = dict()
                        if p2 not in pdg[p1]:
                            pdg[p1][p2] = dict()
                            pdg[p1][p2]['total_count'] = 0
                            pdg[p1][p2]['object_type'] = dict()
                            pdg[p1][p2]['object'] = set()
                        if obj_type not in pdg[p1][p2]['object_type']:
                            pdg[p1][p2]['object_type'][obj_type] = dict()
                            pdg[p1][p2]['object_type'][obj_type]['count'] = 0
                            pdg[p1][p2]['object_type'][obj_type]['average_flow_time'] = timedelta()

                        pdg[p1][p2]['object'].add(obj)

                        if p1 not in flow_time:
                            flow_time[p1] = dict()
                        if p2 not in flow_time[p1]:
                            flow_time[p1][p2] = dict()
                        if obj not in flow_time[p1][p2]:
                            flow_time[p1][p2][obj] = set()
                        flow_time[p1][p2][obj].add(get_obj_flow_time(ocel, group1, group2, p1, p2))

    update_pdg_count(pdg, oid_to_type_map)
    update_pdg_flow_time(pdg, oid_to_type_map, flow_time)

    return pdg

def discover_process_node_graph(ocel: OCEL) -> Dict[str, Any]:
    png = dict()

    # get object_types, objects, processes
    object_types = get_object_types(ocel)
    processes = get_process_types(ocel)
    objects = get_objects(ocel)

    object_id_type_mapping = map_object_id_to_type(ocel)
    process_event_activity_mapping = map_process_type_to_activity(ocel)

    filtered_ocels = dict()
    for pro in processes:
        filtered_ocel = filter_ocel_by_object_type(
            ocel,
            pro
        )
        filtered_ocels[pro] = filtered_ocel

    for process in processes:
        png[process] = dict()
        png[process]['activity'] = process_event_activity_mapping[process]

    for pro in filtered_ocels:

        count = dict()
        total_count = 0
        for ot in object_types:
            count[ot] = dict()
            count[ot]['count'] = 0

        oid_list = set()

        ocel_re = filtered_ocels[pro]

        #print(ocel_re)

        for key, group in ocel_re.groupby(ocel.event_id_column, sort=False):
            group_oid_column = group[ocel.object_id_column]
            for obj_id in group_oid_column:
                for oid in objects:
                    if oid == obj_id and oid not in oid_list:
                        ot = object_id_type_mapping[oid]
                        count[ot]['count'] += 1
                        oid_list.add(oid)

        updated_count = {k: v  for k, v in count.items()  if count[k]['count'] > 0}
        png[pro]['object_type'] = updated_count

        for ot in count:
            total_count += count[ot]['count']
        png[pro]['total_count'] = total_count

        png[pro]['object'] = oid_list

    return png