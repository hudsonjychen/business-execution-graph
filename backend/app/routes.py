import os
import tempfile
import traceback
from flask import Blueprint, jsonify, request
import pm4py
from .cache import cachedElements, cachedKnowledge, cachedObjectTypes, cachedNodeCard, cachedObjects, cachedProcesses, cachedActivityCounts, cachedObjectTypeCounts
from .interpm_v2.algo.inter_process_discovery import discover_interactions
from .interpm_v2.algo.ocel_entity_extraction import get_processes, get_object_types, get_objects, get_activities
from .interpm_v2.visualization.vis_converter import get_vis_data
from .interpm_v2.algo.ocel_mapping import map_object_id_to_type
from .interpm_v2.statistics.frequency_counting import object_type_frequency_counting, activity_frequency_counting

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
        interactions = discover_interactions(log)
        process_interactions = interactions['process_interactions']
        process_data = interactions['process_data']
        object_types = get_object_types(log)
        processes = get_processes(log)
        activities = get_activities(log)
        object_type_counts = object_type_frequency_counting(log)
        activity_counts = activity_frequency_counting(log)
        elements, nodes, knowledge = get_vis_data(object_types, processes, activities, process_interactions, process_data)
        
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

        cachedProcesses.clear()
        cachedProcesses.extend(list(processes))

        cachedObjectTypeCounts.clear()
        cachedObjectTypeCounts.update(object_type_counts)

        cachedActivityCounts.clear()
        cachedActivityCounts.update(activity_counts)

        os.remove(temp_path)

        return jsonify({"status": "success"})

    except Exception as e:
        print("Fail", e)
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

@main.route('/get_data', methods=['GET'])
def get_data():
    return jsonify({
        'elements': cachedElements,
        'nodes': cachedNodeCard,
        'knowledge': cachedKnowledge,
        'objectTypes': cachedObjectTypes,
        'objects': cachedObjects,
        'processes': cachedProcesses,
        'otcounts': cachedObjectTypeCounts,
        'actcounts': cachedActivityCounts
    })