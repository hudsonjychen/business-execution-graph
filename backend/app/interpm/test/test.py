import pm4py
from ..statistics.frequency_counting import activity_frequency_counting

if __name__ == '__main__':
    log = pm4py.read_ocel2_json(r'C:\Users\Hudson Chen\Desktop\output.json')
    print(activity_frequency_counting(log))