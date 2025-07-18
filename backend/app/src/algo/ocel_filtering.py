import pandas as pd
from pm4py.objects.ocel.obj import OCEL
from typing import Set, Dict
from collections import defaultdict

def build_object_to_event_index(ocel: OCEL) -> Dict[str, Set[str]]:
    """
    Build an index mapping object ID -> set of related event IDs.
    """
    index = defaultdict(set)
    
    for _, row in ocel.relations.iterrows():
        event_id = row[ocel.event_id_column]
        obj_id = row[ocel.object_id_column]
        index[obj_id].add(event_id)

    return index


def _filter_event_ids_by_column_value_indexed(index: Dict[str, Set[str]], filter_value: str) -> Set[str]:
    """
    Get event IDs related to a given object ID from a precomputed index.
    """
    return index.get(filter_value, set())


def filter_ocel_by_object_id(ocel: OCEL, filter_oid: str) -> pd.DataFrame:
    """
    Filter OCEL to include only events related to the given object ID, using a precomputed index.

    Args:
        ocel (OCEL): The OCEL log.
        filter_oid (str): Object ID to filter.
        index (Dict[str, Set[str]]): Object ID → Event ID index.

    Returns:
        pd.DataFrame: Filtered relation entries.
    """
    index = build_object_to_event_index(ocel)
    eids = _filter_event_ids_by_column_value_indexed(index, filter_oid)
    return ocel.relations.loc[ocel.relations[ocel.event_id_column].isin(eids)]