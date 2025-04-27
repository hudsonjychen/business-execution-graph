import os
import tempfile
from flask import Blueprint, jsonify, request
import pm4py
from .cache import cachedElements, cachedKnowledge, cachedObjectTypes, cachedNodeCard, cachedObjects
from .interpm.algo.discovery import discover_process_dependency_graph, discover_process_node_graph
from .interpm.algo.data_extractor import get_processes, get_object_types, get_objects, get_activities
from .interpm.visualization.vis_converter import get_vis_data
from .interpm.algo.mapping import map_object_id_to_type

main = Blueprint('main', __name__)

@main.route('/upload', methods=['POST'])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No File"}), 400
    file = request.files["file"]

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as temp:
            file.save(temp.name)
            temp_path = temp.name
        log = pm4py.read_ocel2_json(temp_path)
        pdg = discover_process_dependency_graph(log)
        png = discover_process_node_graph(log)
        objects = get_objects(log)
        object_types = get_object_types(log)
        processes = get_processes(log)
        activities = get_activities(log)
        elements, nodes, knowledge = get_vis_data(object_types, processes, activities, pdg, png)
        
        # Update cache
        cachedElements.clear()
        cachedElements.extend(elements)

        cachedNodeCard.clear()
        cachedNodeCard.update(nodes)

        cachedKnowledge.clear()
        cachedKnowledge.extend(knowledge)

        cachedObjectTypes.clear()
        cachedObjectTypes.extend(list(object_types))

        cachedObjects.clear()
        cachedObjects.update(map_object_id_to_type(log))

        os.remove(temp_path)

        return jsonify({"status": "success"})

    except Exception as e:
        print("Fail", e)
        return jsonify({"status": "error", "message": str(e)}), 500

@main.route('/get_data', methods=['GET'])
def get_data():
    return jsonify({
        'elements': cachedElements,
        'nodes': cachedNodeCard,
        'knowledge': cachedKnowledge,
        'objectTypes': cachedObjectTypes,
        'objects': cachedObjects,
    })