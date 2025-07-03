from datetime import datetime
from backend.app.interpm_v2.data.simulator import simulate


if __name__ == "__main__":
    NUM_ORDERS = 52
    ITEMS_PER_ORDER = (1, 10)
    BASE_TIME = datetime(2025, 2, 1, 8, 0, 0)
    filepath = r"C:\Users\Hudson Chen\Desktop\Thesis\simulated_data_2.json"
    simulate(NUM_ORDERS=NUM_ORDERS, ITEMS_PER_ORDER=ITEMS_PER_ORDER, BASE_TIME=BASE_TIME, filepath=filepath)