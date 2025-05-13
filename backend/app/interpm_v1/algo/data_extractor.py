from pm4py.objects.ocel.obj import OCEL

def get_object_types(ocel):
    object_types = set()
    for row in ocel.objects[ocel.object_type_column]:
        if row.startswith('@process:'):
            continue
        else:
            object_types.add(row)
    return object_types

def get_objects(ocel):
    objects = set()
    for row in ocel.objects[ocel.object_id_column]:
        if not row.startswith('@process:'):
            objects.add(row)
    return objects

def get_processes(ocel):
    processes = set()
    for row in ocel.objects[ocel.object_type_column]:
        if row.startswith('@process:'):
            processes.add(row)
    return processes

def get_activities(ocel: OCEL):
    activities = set()
    for row in ocel.events[ocel.event_activity]:
        activities.add(row)
    return activities