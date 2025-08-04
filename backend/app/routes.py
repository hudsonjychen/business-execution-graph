import os
import tempfile
import traceback
from flask import Blueprint, jsonify, request
import pm4py
import threading
import uuid
from datetime import datetime
from werkzeug.exceptions import RequestEntityTooLarge

from .src.util.json_adapter import convert_for_json
from .cache import cachedFileInfo, cachedPreloadData, cachedInteractionData, cachedProcessData, cachedObjectToType, cachedElements, cachedKnowledge, cachedObjectTypes, cachedNodeCard, cachedProcesses
from .src.algo.discovery import discover
from .src.algo.get_entities import get_processes, get_object_types, get_activities, get_objects
from .src.visualization.vis_converter import get_vis_data
from .src.algo.map import map_object_id_to_type

main = Blueprint('main', __name__)

task_status = {}

@main.route('/upload', methods=['POST'])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No File"}), 400
    file = request.files["file"]

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as temp:
            file.save(temp.name)
            temp_path = temp.name

        filename = file.filename
        size = round(os.path.getsize(temp_path) / 1024 / 1024, 2)
        uploadtime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        cachedFileInfo['filename'] = filename
        cachedFileInfo['size'] = size
        cachedFileInfo['uploadtime'] = uploadtime

        log = pm4py.read_ocel2_json(temp_path)

        cachedPreloadData.clear()
        cachedPreloadData.update(data_preload(log))

        task_id = str(uuid.uuid4())
        threading.Thread(target=data_process, args=(log, task_id)).start()

        os.remove(temp_path)

        # preload data
        return jsonify({
            'fileInfo': cachedFileInfo,
            'preloadData': cachedPreloadData,
            'taskId': task_id
        })

    except Exception as e:
        print("Fail", e)
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


def data_preload(log):

    preload_data = {
        'objectTypeListAll': list(get_object_types(log)),
        'processList': list(get_processes(log)),
        'objectListAll': list(get_objects(log))
    }

    return preload_data


def data_process(log, task_id):

    discover_results = discover(log)
    interaction_data = discover_results["interaction_data"]
    process_data = discover_results["process_data"]

    # interaction data
    cachedInteractionData.clear()
    cachedInteractionData.update(convert_for_json(interaction_data))
    # process data
    cachedProcessData.clear()
    cachedProcessData.update(convert_for_json(process_data))

    # object to object type map data
    object_to_type = map_object_id_to_type(log)
    cachedObjectToType.clear()
    cachedObjectToType.update(object_to_type)

    object_types = get_object_types(log)
    processes = get_processes(log)
    activities = get_activities(log)
    elements, nodes, knowledge = get_vis_data(object_types, processes, activities, interaction_data, process_data)
    
    # Update cache
    cachedElements.clear()
    cachedElements.extend(elements)

    cachedNodeCard.clear()
    cachedNodeCard.update(convert_for_json(nodes))

    cachedKnowledge.clear()
    cachedKnowledge.extend(knowledge)

    cachedObjectTypes.clear()
    cachedObjectTypes.extend(list(object_types))

    cachedProcesses.clear()
    cachedProcesses.extend(list(processes))

    task_status[task_id] = True


@main.errorhandler(RequestEntityTooLarge)
def handle_large_file(e):
    return 'file too large', 413


@main.route('/get_data/<task_id>', methods=['GET'])
def get_data(task_id):
    if task_id in task_status:
        return jsonify({
            'ready': True,
            'interactionData': cachedInteractionData,
            'processData': cachedProcessData,
            'objectToType': cachedObjectToType,
            'elements': cachedElements,
            'nodes': cachedNodeCard,
            'knowledge': cachedKnowledge,
            'objectTypes': cachedObjectTypes,
            'processes': cachedProcesses,
        })
    else:
        return jsonify({'ready': False})