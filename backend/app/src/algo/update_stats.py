from datetime import timedelta

def update_process_interactions_count(process_interactions, oid_to_type_map):
    for p1 in process_interactions:
        for p2 in process_interactions[p1]:
            process_interactions[p1][p2]['total_count'] = len(process_interactions[p1][p2]['object'])
            for obj_type in process_interactions[p1][p2]['object_type']:
                for obj in process_interactions[p1][p2]['object']:
                    if oid_to_type_map[obj] == obj_type:
                        process_interactions[p1][p2]['object_type'][obj_type]['count'] += 1


def _is_valid_timedelta(td):
    try:
        return isinstance(td, timedelta) and abs(td.total_seconds()) < 3.2e9  # 小于100年
    except:
        return False


def update_process_interactions_flow_time(process_interactions, oid_to_type_map, flow_time):
    for p1 in process_interactions:
        for p2 in process_interactions[p1]:
            total_flow_time_count = 0
            avg_total_flow_time = timedelta()
            total_count = 0

            for obj_type in process_interactions[p1][p2]['object_type']:
                flow_time_count = 0
                avg_ot_flow_time = timedelta()

                for obj in process_interactions[p1][p2]['object']:
                    if oid_to_type_map.get(obj) == obj_type:
                        deltas = flow_time[p1][p2].get(obj, [])
                        for delta in deltas:
                            if _is_valid_timedelta(delta):
                                flow_time_count += 1
                                avg_ot_flow_time += (delta - avg_ot_flow_time) / flow_time_count

                process_interactions[p1][p2]['object_type'][obj_type]['average_flow_time'] = (
                    avg_ot_flow_time if flow_time_count else timedelta()
                )
                total_flow_time_count += flow_time_count

                if flow_time_count > 0:
                    total_count += 1
                    avg_total_flow_time += (
                        (avg_ot_flow_time - avg_total_flow_time) / total_count
                    )

            process_interactions[p1][p2]['average_flow_time'] = (
                avg_total_flow_time if total_flow_time_count else timedelta()
            )
