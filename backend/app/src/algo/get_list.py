def get_object_type_list(process_data):
    object_type_list = set()
    for process in process_data:
        object_type_list.add(process_data[process]['object_type'].keys())
    return list(object_type_list)

def get_object_list(process_data):
    object_list = set()
    for process in process_data:
        object_list.add(process_data[process]['object'])
    return list(object_list)