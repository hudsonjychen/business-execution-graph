import pm4py
from typing import Dict
from pm4py.objects.ocel.obj import OCEL
from .ocel_entity_extraction import get_object_types, get_process_types, get_objects


def map_object_id_to_type(ocel: OCEL) -> Dict[str, str]:
    """
    Creates a mapping from object ID to object type in an OCEL.

    Args:
        ocel (OCEL): The object-centric event log.

    Returns:
        Dict[str, str]: A dictionary mapping each object ID to its corresponding object type.
    """
    return ocel.objects.set_index(ocel.object_id_column)[ocel.object_type_column].to_dict()


def map_process_type_to_object_type(ocel: OCEL) -> Dict[str, set[str]]:
    """
    Creates a mapping from process type to object type in an OCEL.

    Args:
        ocel (OCEL): The object-centric event log.

    Returns:
        Dict[str, str]: A dictionary mapping each process type to its related object type.
    """
    object_types = get_object_types(ocel)
    process_types = get_process_types(ocel)
    process_type_object_type_mapping = dict()

    for key, group in ocel.relations.groupby(ocel.event_id_column):
        for pro in process_types:
            if pro in group[ocel.object_type_column].values:
                if pro not in process_type_object_type_mapping:
                    process_type_object_type_mapping[pro] = set()
                for i in range(len(group)):
                    if group[ocel.object_type_column].iloc[i] in object_types:
                        process_type_object_type_mapping[pro].add(group[ocel.object_type_column].iloc[i])

    return process_type_object_type_mapping


def map_process_type_to_activity(ocel: OCEL) -> Dict[str, set[str]]:
    """
    Creates a mapping from process type to activity in an OCEL.

    Args:
        ocel (OCEL): The object-centric event log.

    Returns:
        Dict[str, str]: A dictionary mapping each process type to its related activity.
    """
    process_types = get_process_types(ocel)
    process_type_activity_mapping = dict()

    for key, group in ocel.relations.groupby(ocel.event_activity):
        for pro in process_types:
            if pro in group[ocel.object_type_column].values:
                if pro not in process_type_activity_mapping:
                    process_type_activity_mapping[pro] = set()
                process_type_activity_mapping[pro].add(key)

    return process_type_activity_mapping


if __name__ == '__main__':
    log = pm4py.read_ocel2_json(r'C:\Users\Hudson Chen\Desktop\Thesis\example_data.json')
    print(map_process_type_to_object_type(log))
    print(map_object_id_to_type(log))
    print(map_process_type_to_activity(log))
