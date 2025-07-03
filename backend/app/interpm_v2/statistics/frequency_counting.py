from ..algo.ocel_entity_extraction import get_process_types
from ..algo.ocel_filtering import filter_ocel_by_object_id


def object_type_frequency_counting(ocel):
    object_type_frequency = dict()

    processes = get_process_types(ocel)

    for pro in processes:
        object_type_frequency[pro] = dict()

        filtered_ocel = filter_ocel_by_object_id(
            ocel,
            pro
        )
        
        grouped = filtered_ocel.groupby(ocel.event_id_column)

        for group_key, group in grouped:
            for ot in group[ocel.object_type_column]:
                if ot != '@process':
                    if ot not in object_type_frequency[pro]:
                        object_type_frequency[pro][ot] = 0
                    object_type_frequency[pro][ot] += 1
    
    return object_type_frequency


def activity_frequency_counting(ocel):
    activity_frequency = dict()

    processes = get_process_types(ocel)

    for pro in processes:
        activity_frequency[pro] = dict()

        filtered_ocel = filter_ocel_by_object_id(
            ocel,
            pro
        )
        
        grouped = filtered_ocel.groupby(ocel.event_id_column)

        for group_key, group in grouped:
            for act in group[ocel.event_activity]:
                if act not in activity_frequency[pro]:
                    activity_frequency[pro][act] = 0
                activity_frequency[pro][act] += 1
                break
    
    return activity_frequency