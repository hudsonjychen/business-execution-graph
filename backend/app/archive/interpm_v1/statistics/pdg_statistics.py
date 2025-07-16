from datetime import timedelta

def get_obj_flow_time(ocel, group1, group2, t1, t2):
    timestamp1 = group1[group1[ocel.object_type_column]==t1]['ocel:timestamp'].iloc[0]
    timestamp2 = group2[group2[ocel.object_type_column]==t2]['ocel:timestamp'].iloc[0]

    return timestamp2 - timestamp1

def update_pdg_count(pdg, oid_to_type_map):
    for p1 in pdg:
        for p2 in pdg[p1]:
            pdg[p1][p2]['total_count'] = len(pdg[p1][p2]['object'])
            for obj_type in pdg[p1][p2]['object_type']:
                for obj in pdg[p1][p2]['object']:
                    if oid_to_type_map[obj] == obj_type:
                        pdg[p1][p2]['object_type'][obj_type]['count'] += 1

def update_pdg_flow_time(pdg, oid_to_type_map, flow_time):
    for p1 in pdg:
        for p2 in pdg[p1]:
            total_flow_time_count = 0
            total_sum_flow_time = timedelta()
            for obj_type in pdg[p1][p2]['object_type']:
                sum_ot_flow_time = timedelta()
                flow_time_count = 0
                for obj in pdg[p1][p2]['object']:
                    if oid_to_type_map[obj] == obj_type:
                        sum_ot_flow_time += sum(flow_time[p1][p2][obj], timedelta())
                        flow_time_count += 1
                total_flow_time_count += flow_time_count
                total_sum_flow_time += sum_ot_flow_time
                pdg[p1][p2]['object_type'][obj_type]['average_flow_time'] = sum_ot_flow_time / flow_time_count
            pdg[p1][p2]['average_flow_time'] = total_sum_flow_time / total_flow_time_count