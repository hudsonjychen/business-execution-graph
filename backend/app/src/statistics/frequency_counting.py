from collections import defaultdict
from ..algo.ocel_entity_extraction import get_processes

def _build_filtered_ocels_by_process(ocel):

    process_event_ids = defaultdict(set)
    for _, row in ocel.relations.iterrows():
        oid = row[ocel.object_id_column]
        eid = row[ocel.event_id_column]
        process_event_ids[oid].add(eid)

    filtered_ocels = dict()
    for pro in get_processes(ocel):
        eids = process_event_ids.get(pro, set())
        filtered_ocels[pro] = ocel.relations.loc[
            ocel.relations[ocel.event_id_column].isin(eids)
        ]
    return filtered_ocels


def object_type_frequency_counting(ocel):
    object_type_frequency = dict()
    filtered_ocels = _build_filtered_ocels_by_process(ocel)

    for pro, filtered_ocel in filtered_ocels.items():
        object_type_frequency[pro] = dict()

        grouped = filtered_ocel.groupby(ocel.event_id_column)

        for _, group in grouped:
            for ot in group[ocel.object_type_column]:
                if ot != 'process':
                    if ot not in object_type_frequency[pro]:
                        object_type_frequency[pro][ot] = 0
                    object_type_frequency[pro][ot] += 1

    return object_type_frequency


def activity_frequency_counting(ocel):
    activity_frequency = dict()
    filtered_ocels = _build_filtered_ocels_by_process(ocel)

    for pro, filtered_ocel in filtered_ocels.items():
        activity_frequency[pro] = dict()

        grouped = filtered_ocel.groupby(ocel.event_id_column)

        for _, group in grouped:
            for act in group[ocel.event_activity]:
                if act not in activity_frequency[pro]:
                    activity_frequency[pro][act] = 0
                activity_frequency[pro][act] += 1
                break
    return activity_frequency
