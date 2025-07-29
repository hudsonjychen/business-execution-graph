def get_vis_data(object_types, processes, activities, pdg, png):
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
                "objectType": list(png[process]['object_type'].keys()),
                "objectTypeCount": len(list(png[process]['object_type'].keys())),
                "objectCount": png[process]['total_count'],
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
            "totalObjectCount": png[process]['total_count'],
            "objectType": png[process]['object_type'],
            "activity": list(png[process]['activity']),
        }
        label_to_id[process] = str(node_id_counter)
        elements.append(element)
        knowledge.append(pro_element)
        nodes[node_id_counter] = node
        node_id_counter += 1

    for source in pdg:
        for target in pdg[source]:
            source_id = label_to_id.get(source)
            target_id = label_to_id.get(target)

            object_type = f"{list(pdg[source][target]['object_type'].keys())}"

            if source_id is not None and target_id is not None:
                edge = {
                    "data": {
                        "id": f"{source_id}-{target_id}",
                        "source": source_id,
                        "target": target_id,
                        "totalObjectCount": pdg[source][target]['total_count'],
                        "averageFlowTime": str(pdg[source][target]['average_flow_time']),
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

    for process in png:
        for ot in object_types:
            source_id = label_to_id.get(process)
            target_id = label_to_id.get(ot)
            if ot in list(png[process]['object_type'].keys()):
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
            if at in png[process]['activity']:
                edge_element = {
                    "data": {
                        "id": f"{source_id}-{target_id}",
                        "source": source_id,
                        "target": target_id,
                    }
                }
                knowledge.append(edge_element)
    
    print(elements)
    print(nodes)
    print(knowledge)

    return elements, nodes, knowledge