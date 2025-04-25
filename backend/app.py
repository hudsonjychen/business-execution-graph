import os
import tempfile
from flask import Flask, jsonify, request
from flask_cors import CORS
import pm4py
from interpm.algo.discovery import discover_process_dependency_graph, discover_process_node_graph
from interpm.algo.data_extractor import get_processes, get_object_types, get_objects, get_activities
from interpm.visualization.vis_converter import get_vis_data
from interpm.algo.mapping import map_object_id_to_type

app = Flask(__name__)
CORS(app)

cachedElements = []
cachedKnowledge = []
cachedObjectTypes = []
cachedNodeCard = dict()
cachedObjects = dict()

@app.route('/upload', methods=['POST'])
def upload():
    global cachedElements
    global cachedNodeCard
    global cachedKnowledge
    global cachedObjectTypes
    global cachedObjects
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
        cachedElements = elements
        cachedNodeCard = nodes
        cachedKnowledge = knowledge

        cachedObjectTypes = list(object_types)

        cachedObjects = map_object_id_to_type(log)

        os.remove(temp_path)

        return jsonify({"status": "success"})

    except Exception as e:
        print("Fail", e)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_data', methods=['GET'])
def get_data():
    return jsonify({'elements': cachedElements,
                    'nodes': cachedNodeCard,
                    'knowledge': cachedKnowledge,
                    'objectTypes': cachedObjectTypes,
                    'objects': cachedObjects,
                    })

if __name__ == '__main__':
    app.run(debug=True)