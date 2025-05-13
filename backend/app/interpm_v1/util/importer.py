import pandas as pd
import json

def custom_serializer(obj):
    if isinstance(obj, pd.Timedelta):
        return str(obj)
    if isinstance(obj, set):
        return list(obj)

def import_to_json(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4, default=custom_serializer)