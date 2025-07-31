import datetime

def convert_for_json(obj):
    if isinstance(obj, dict):
        return {k: convert_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_for_json(item) for item in obj]
    elif isinstance(obj, set):
        return list(obj)
    elif isinstance(obj, (datetime.timedelta)):
        return str(obj)
    else:
        return obj