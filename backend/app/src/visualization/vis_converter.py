def get_vis_data(object_types, processes, activities, interaction_data, process_data):
    elements = []
    knowledge = []
    nodes = {}
    label_to_id = {}
    node_id_counter = 0

    for process in processes:
        element = {
            "data": {
                "id": str(node_id_counter),
                "label": process,
                "objectType": process_data[process]['object_type_list'],
                "objectTypeCount": len(process_data[process]['object_type_list']),
                "objectCount": process_data[process]['total_object_count'],
            }
        }
        pro_element = {
            "data": {
                "id": str(node_id_counter),
                "label": process,
                "category": 'process'
            }
        }
        node = {
            "label": process,
            "objectType": process_data[process]['object_type'],
            "activity": process_data[process]['activity'],
            "totalObjectCount": process_data[process]['total_object_count'],
            "totalEventCount": process_data[process]['total_event_count'],
        }
        label_to_id[process] = str(node_id_counter)
        elements.append(element)
        knowledge.append(pro_element)
        nodes[node_id_counter] = node
        node_id_counter += 1

    for source in interaction_data:
        for target in interaction_data[source]:
            source_id = label_to_id.get(source)
            target_id = label_to_id.get(target)

            object_type = f"{list(interaction_data[source][target]['object_type'].keys())}"

            if source_id is not None and target_id is not None:
                edge = {
                    "data": {
                        "id": f"{source_id}-{target_id}",
                        "source": source_id,
                        "target": target_id,
                        "totalObjectCount": interaction_data[source][target]['total_count'],
                        "averageFlowTime": str(interaction_data[source][target]['average_flow_time']),
                        "objectType": object_type,
                    }
                }
                elements.append(edge)

    for ot in object_types:
        ot_element = {
            "data": {
                "id": str(node_id_counter),
                "label": ot,
                "category": 'object_type'
            }
        }
        knowledge.append(ot_element)
        label_to_id[ot] = str(node_id_counter)
        node_id_counter += 1

    for at in activities:
        at_element = {
            "data": {
                "id": str(node_id_counter),
                "label": at,
                "category": 'activity'
            }
        }
        knowledge.append(at_element)
        label_to_id[at] = str(node_id_counter)
        node_id_counter += 1

    for process in process_data:
        for ot in object_types:
            source_id = label_to_id.get(process)
            target_id = label_to_id.get(ot)
            if ot in process_data[process]['object_type_list']:
                edge_element = {
                    "data": {
                        "id": f"{source_id}-{target_id}",
                        "source": source_id,
                        "target": target_id,
                    }
                }
                knowledge.append(edge_element)

        for at in activities:
            source_id = label_to_id.get(process)
            target_id = label_to_id.get(at)
            if at in process_data[process]['activity_list']:
                edge_element = {
                    "data": {
                        "id": f"{source_id}-{target_id}",
                        "source": source_id,
                        "target": target_id,
                    }
                }
                knowledge.append(edge_element)

    return elements, nodes, knowledge