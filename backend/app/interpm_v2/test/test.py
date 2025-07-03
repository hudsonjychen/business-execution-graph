import pm4py
from ..algo.discovery import discover_process_dependency_graph, discover_process_node_graph

if __name__ == '__main__':
    log = pm4py.read_ocel2_json(r'C:\Users\Hudson Chen\Desktop\generated_data.json')
    print(discover_process_dependency_graph(log))