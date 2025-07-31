def get_object_type_list(process_data):
    ots = set()
    for process in process_data:
        keys_list = list(process_data[process]['object_type'].keys())
        ots.add(tuple(keys_list))
    return [list(ot) for ot in ots]

def get_object_list(process_data):
    os = set()
    for process in process_data:
        obj_list = process_data[process]['object']
        os.add(tuple(obj_list))
    return [list(o) for o in os]

def get_activity_list(process_data):
    acts = set()
    for process in process_data:
        act_list = process_data[process]['activity']
        acts.add(tuple(act_list))
    return [list(act) for act in acts]
