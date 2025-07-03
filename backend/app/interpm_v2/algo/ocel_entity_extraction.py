import pm4py
from pm4py.objects.ocel.obj import OCEL
from typing import Set


def _filter_column_values(
    ocel,
    target_column: str,
    qualifier_column: str = 'ocel:qualifier',
    qualifier_value: str = None,
    exclude: bool = False
) -> Set[str]:
    """
    Helper function to extract values from a column based on qualifier filter.
    """
    if qualifier_value is not None:
        mask = ocel[qualifier_column] != qualifier_value if exclude else ocel[qualifier_column] == qualifier_value
        return set(ocel.loc[mask, target_column])
    else:
        return set(ocel[target_column])


def get_object_types(ocel: OCEL) -> Set[str]:
    """
    Returns the set of object types.
    """
    return _filter_column_values(
        ocel.relations,
        target_column=ocel.object_type_column,
        qualifier_value="process",
        exclude=True
    )


def get_objects(ocel: OCEL) -> Set[str]:
    """
    Returns the set of object IDs.
    """
    return _filter_column_values(
        ocel.relations,
        target_column=ocel.object_id_column,
        qualifier_value="process",
        exclude=True
    )


def get_process_types(ocel: OCEL) -> Set[str]:
    """
    Returns the set of process types.
    """
    return _filter_column_values(
        ocel.relations,
        target_column=ocel.object_type_column,
        qualifier_value="process"
    )


def get_process_instances(ocel: OCEL, process_type: str = None) -> Set[str]:
    """
    Returns the set of process instances.
    """
    if process_type is not None:
        return _filter_column_values(
            ocel.relations,
            target_column=ocel.object_id_column,
            qualifier_column=ocel.object_type_column,
            qualifier_value=process_type,
        )
    else:
        return _filter_column_values(
            ocel.relations,
            target_column=ocel.object_id_column,
            qualifier_value="process"
        )


def get_activities(ocel: OCEL) -> Set[str]:
    """
    Returns the set of all unique activity names from the event log.
    """
    return set(ocel.events[ocel.event_activity].unique())


def get_events(ocel: OCEL) -> Set[str]:
    """
    Returns the set of all unique event IDs from the event log.
    """
    return set(ocel.events[ocel.event_id_column].unique())


if __name__ == '__main__':
    log = pm4py.read_ocel2_json(r'C:\Users\Hudson Chen\Desktop\Thesis\example_data.json')
    print(get_process_instances(log, 'order-management-process'))