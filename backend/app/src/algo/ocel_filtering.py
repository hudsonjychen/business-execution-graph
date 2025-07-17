import pandas as pd
from pm4py.objects.ocel.obj import OCEL
from typing import Set


def _filter_event_ids_by_column_value(ocel: OCEL, column_name: str, filter_value: str) -> Set[str]:
    """
    Get event IDs that are related to a given value in a specified column.
    """
    event_ids = {
        eid for eid, group in ocel.relations.groupby(ocel.event_id_column)
        if filter_value in group[column_name].values
    }
    return event_ids


def filter_ocel_by_object_id(ocel: OCEL, filter_oid: str) -> pd.DataFrame:
    """
    Filter OCEL to include only events related to the given object ID.

    Args:
        ocel (OCEL): The OCEL log.
        filter_oid (str): Object ID to filter.

    Returns:
        pd.DataFrame: Filtered relation entries.
    """
    eids = _filter_event_ids_by_column_value(ocel, ocel.object_id_column, filter_oid)
    return ocel.relations.loc[ocel.relations[ocel.event_id_column].isin(eids)]


def filter_ocel_by_object_type(ocel: OCEL, filter_ot: str) -> pd.DataFrame:
    """
    Filter OCEL to include only events related to the given object type.

    Args:
        ocel (OCEL): The OCEL log.
        filter_ot (str): Object type to filter.

    Returns:
        pd.DataFrame: Filtered relation entries.
    """
    eids = _filter_event_ids_by_column_value(ocel, ocel.object_type_column, filter_ot)
    return ocel.relations.loc[ocel.relations[ocel.event_id_column].isin(eids)]