from pandas.core.interchange.dataframe_protocol import DataFrame
from pm4py.objects.ocel.obj import OCEL

def filter_ocel_by_object_id(ocel: OCEL, filter_oid: str) -> DataFrame:
    """
    Filters an OCEL (Object-Centric Event Log) by a specific object ID.

    Args:
        ocel (OCEL): The object-centric event log.
        filter_oid (str): The object ID to filter by.

    Returns:
        pd.DataFrame: A filtered DataFrame containing only the events related to the specified object ID.
    """
    filter_eid = set()
    for key, group in ocel.relations.groupby(ocel.event_id_column):
        for oid_in_group in group[ocel.object_id_column]:
            if oid_in_group == filter_oid:
                filter_eid.add(key)

    filtered_ocel = ocel.relations.loc[ocel.relations[ocel.event_id_column].isin(filter_eid)]
    return filtered_ocel

def filter_ocel_by_object_type(ocel: OCEL, filter_ot: str) -> DataFrame:
    filter_eid = set()
    for key, group in ocel.relations.groupby(ocel.event_id_column):
        for ot_in_group in group[ocel.object_type_column]:
            if ot_in_group == filter_ot:
                filter_eid.add(key)

    filtered_ocel = ocel.relations.loc[ocel.relations[ocel.event_id_column].isin(filter_eid)]
    return filtered_ocel