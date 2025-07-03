import json
import random
import uuid
from datetime import datetime, timedelta

def _generate_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:6]}"

def _time_shift(base, minutes):
    return (base + timedelta(minutes=minutes)).isoformat() + "Z"

def generate_data(NUM_ORDERS, ITEMS_PER_ORDER, BASE_TIME):
    event_types = [
        {"name": "create-order", "attributes": [{"name": "total-items", "type": "integer"}]},
        {"name": "order-confirmation", "attributes": [{"name": "confirmation-code", "type": "string"}]},
        {"name": "invoice-generated", "attributes": [{"name": "invoice-issuer", "type": "string"}]},
        {"name": "payment-confirmation", "attributes": [{"name": "payment-method", "type": "string"}]},
        {"name": "order-cancelled", "attributes": [{"name": "cancel-reason", "type": "string"}]},
        {"name": "package-prepared", "attributes": [{"name": "warehouse-id", "type": "string"}]},
        {"name": "shipment-started", "attributes": [{"name": "logistics-provider", "type": "string"}]},
        {"name": "shipment-delivered", "attributes": [{"name": "recipient", "type": "string"}]},
        {"name": "support-requested", "attributes": [{"name": "problem-type", "type": "string"}]},
        {"name": "support-connected", "attributes": [{"name": "customer-service-staff", "type": "string"}]},
        {"name": "problem-solved", "attributes": [{"name": "service-feedback", "type": "string"}]},
        {"name": "order-refund-requested", "attributes": [{"name": "refund-reason", "type": "string"}]},
        {"name": "order-refund-confirmation", "attributes": [{"name": "refund-code", "type": "string"}]},
        {"name": "order-refund-denied", "attributes": [{"name": "deny-reason", "type": "string"}]}
    ]

    object_types = [
        {"name": "order", "attributes": [{"name": "order-id", "type": "string"}]},
        {"name": "item", "attributes": [{"name": "product-name", "type": "string"}]},
        {"name": "invoice", "attributes": [{"name": "invoice-id", "type": "string"}]},
        {"name": "shipment", "attributes": [{"name": "tracking-number", "type": "string"}]},
        {"name": "support", "attributes": [{"name": "support-ticket-id", "type": "string"}]},
        {"name": "refund", "attributes": [{"name": "refund-id", "type": "string"}]},
        {"name": "order-management-process", "attributes": []},
        {"name": "delivery-management-process", "attributes": []},
        {"name": "customer-service-process", "attributes": []},
        {"name": "return-management-process", "attributes": []}
    ]

    products = ["Laptop", "Smartphone", "Tablet", "Headphones", "Camera", "Watch", "VR HMD", "Speaker"]

    events, objects = [], []
    event_id_counter = 1

    # Define common attributes for events based on their type
    def get_event_attributes(event_type_name, num_items=None):
        attr = {}
        if event_type_name == "create-order":
            attr = {"name": "total-items", "value": num_items}
        elif event_type_name == "order-confirmation":
            attr = {"name": "confirmation-code", "value": f"CONF{random.randint(1000, 9999)}"}
        elif event_type_name == "invoice-generated":
            attr = {"name": "invoice-issuer", "value": random.choice(["BillingSystem", "MarketplaceOperator"])}
        elif event_type_name == "payment-confirmation":
            attr = {"name": "payment-method", "value": random.choice(["Card", "PayPal", "ApplePay", "GooglePay", "Swish", "OnlineBank"])}
        elif event_type_name == "order-cancelled":
            attr = {"name": "cancel-reason", "value": "Customer requested"}
        elif event_type_name == "package-prepared":
            attr = {"name": "warehouse-id", "value": f"WH-{random.randint(1, 99)}"}
        elif event_type_name == "shipment-started":
            attr = {"name": "logistics-provider", "value": random.choice(["FastShip", "FlyLogi", "EZTransport"])}
        elif event_type_name == "shipment-delivered":
            attr = {"name": "recipient", "value": random.choice(["Alice", "Bob", "Charlie", "Dora"])}
        elif event_type_name == "support-requested":
            attr = {"name": "problem-type", "value": random.choice(["Account", "Billing", "Order", "Logistic", "Other"])}
        elif event_type_name == "support-connected":
            attr = {"name": "customer-service-staff", "value": random.choice(["Erik", "Peter", "Nick"])}
        elif event_type_name == "problem-solved":
            attr = {"name": "service-feedback", "value": random.choice(["Good", "NotBad", "Bad", "NoFeedback"])}
        elif event_type_name == "order-refund-requested":
            attr = {"name": "refund-reason", "value": random.choice(["CustomerInitiated", "ProductIssues", "Shipping"])}
        elif event_type_name == "order-refund-confirmation":
            attr = {"name": "refund-code", "value": f"RFD-{random.randint(1, 999)}"}
        elif event_type_name == "order-refund-denied":
            attr = {"name": "deny-reason", "value": random.choice(["OrderStatus", "PolicyViolations", "Other"])}
        return [attr] if attr else []

    # Helper to create an event
    def create_event(event_type_name, current_time, related_objects_map, num_items=None):
        nonlocal event_id_counter
        evt = {
            "id": f"e{event_id_counter}",
            "type": event_type_name,
            "time": _time_shift(current_time, 0),
            "attributes": get_event_attributes(event_type_name, num_items)
        }
        event_id_counter += 1

        relationships = []
        # Dynamically add relationships based on event type and available objects
        if event_type_name in ["create-order", "order-confirmation", "invoice-generated", "payment-confirmation", "order-cancelled", "package-prepared"]:
            relationships.append({"objectId": related_objects_map["order_id"], "qualifier": "order"})
            relationships.append({"objectId": related_objects_map["omp_id"], "qualifier": "process"})
            if event_type_name in ["create-order", "package-prepared"]:
                relationships.extend([{"objectId": i, "qualifier": "item"} for i in related_objects_map["item_ids"]])
            if event_type_name in ["invoice-generated", "payment-confirmation"]:
                relationships.append({"objectId": related_objects_map["invoice_id"], "qualifier": "invoice"})
        elif event_type_name in ["shipment-started", "shipment-delivered"]:
            relationships.append({"objectId": related_objects_map["order_id"], "qualifier": "order"})
            relationships.append({"objectId": related_objects_map["shipment_id"], "qualifier": "shipment"})
            relationships.append({"objectId": related_objects_map["dmp_id"], "qualifier": "process"})
        elif event_type_name in ["support-requested", "support-connected", "problem-solved"]:
            relationships.append({"objectId": related_objects_map["order_id"], "qualifier": "order"})
            relationships.append({"objectId": related_objects_map["support_id"], "qualifier": "support"})
            relationships.append({"objectId": related_objects_map["csp_id"], "qualifier": "process"})
        elif event_type_name in ["order-refund-requested", "order-refund-confirmation", "order-refund-denied"]:
            relationships.append({"objectId": related_objects_map["order_id"], "qualifier": "order"})
            relationships.append({"objectId": related_objects_map["refund_id"], "qualifier": "refund"})
            relationships.extend([{"objectId": i, "qualifier": "item"} for i in related_objects_map["item_ids"]])
            relationships.append({"objectId": related_objects_map["rmp_id"], "qualifier": "process"})

        evt["relationships"] = relationships
        return evt

    for order_index in range(1, NUM_ORDERS + 1):
        # Initialize current time for this order
        current_time = BASE_TIME + timedelta(minutes=order_index * 120) # Spread orders over time

        # Generate IDs for all related objects at the start of an order process
        order_id = _generate_id("order")
        omp_id = _generate_id("omp")
        dmp_id = _generate_id("dmp")
        csp_id = _generate_id("csp")
        rmp_id = _generate_id("rmp")
        invoice_id = _generate_id("inv")
        shipment_id = _generate_id("ship")
        support_id = _generate_id("support")
        refund_id = _generate_id("refund")

        related_objects_map = {
            "order_id": order_id, "omp_id": omp_id, "dmp_id": dmp_id,
            "csp_id": csp_id, "rmp_id": rmp_id, "invoice_id": invoice_id,
            "shipment_id": shipment_id, "support_id": support_id, "refund_id": refund_id
        }

        # Create base objects
        objects.append({
            "id": order_id, "type": "order",
            "attributes": [{"name": "order-id", "time": _time_shift(current_time, 0), "value": order_id.upper()}]
        })
        for pid, ptype in [(omp_id, "order-management-process"), (dmp_id, "delivery-management-process"),
                           (csp_id, "customer-service-process"), (rmp_id, "return-management-process")]:
            objects.append({"id": pid, "type": ptype, "attributes": []})

        num_items = random.randint(*ITEMS_PER_ORDER)
        item_ids = []
        for _ in range(num_items):
            item_id = _generate_id("item")
            item_ids.append(item_id)
            objects.append({
                "id": item_id, "type": "item",
                "attributes": [{"name": "product-name", "time": _time_shift(current_time, 0), "value": random.choice(products)}]
            })
        related_objects_map["item_ids"] = item_ids # Add to map for later use

        objects.append({
            "id": invoice_id, "type": "invoice",
            "attributes": [{"name": "invoice-id", "time": _time_shift(current_time, 10), "value": invoice_id.upper()}]
        })
        objects.append({
            "id": shipment_id, "type": "shipment",
            "attributes": [{"name": "tracking-number", "time": _time_shift(current_time, 50), "value": f"TRK{random.randint(1000,9999)}"}]
        })
        objects.append({
            "id": support_id, "type": "support",
            "attributes": [{"name": "support-ticket-id", "time": _time_shift(current_time, 100), "value": support_id.upper()}]
        })
        objects.append({
            "id": refund_id, "type": "refund",
            "attributes": [{"name": "refund-id", "time": _time_shift(current_time, 120), "value": refund_id.upper()}]
        })

        # --- Define Logical Process Flows ---
        # 1. Standard Order Flow
        events.append(create_event("create-order", current_time, related_objects_map, num_items))
        current_time += timedelta(minutes=random.randint(5, 15))
        events.append(create_event("order-confirmation", current_time, related_objects_map))
        current_time += timedelta(minutes=random.randint(5, 15))
        events.append(create_event("invoice-generated", current_time, related_objects_map))
        current_time += timedelta(minutes=random.randint(5, 15))
        events.append(create_event("payment-confirmation", current_time, related_objects_map))
        current_time += timedelta(minutes=random.randint(15, 30))

        # 2. Shipping Flow (always follows payment confirmation in this logic)
        events.append(create_event("package-prepared", current_time, related_objects_map))
        current_time += timedelta(minutes=random.randint(30, 60))
        events.append(create_event("shipment-started", current_time, related_objects_map))
        current_time += timedelta(minutes=random.randint(120, 240)) # Longer for shipment
        events.append(create_event("shipment-delivered", current_time, related_objects_map))
        current_time += timedelta(minutes=random.randint(30, 60))

        # 3. Conditional Flows (Support, Refund, Cancellation)
        # Introduce probabilities for different scenarios
        scenario_choice = random.choices(
            ["no_issue", "support_needed", "refund_requested", "order_cancelled_early"],
            weights=[0.56, 0.24, 0.09, 0.11], # Adjust probabilities as needed
            k=1
        )[0]

        if scenario_choice == "order_cancelled_early":
            # If cancelled, bypass support/refund flow
            # This event would ideally occur earlier, e.g., after order-confirmation
            # For this example, let's place it here for demonstration of branching
            current_time -= timedelta(minutes=random.randint(60, 120)) # Revert time to simulate earlier cancellation
            events.append(create_event("order-cancelled", current_time, related_objects_map))
            # No further events for this order
            continue # Move to the next order

        elif scenario_choice == "support_needed":
            current_time += timedelta(minutes=random.randint(10, 60))
            events.append(create_event("support-requested", current_time, related_objects_map))
            current_time += timedelta(minutes=random.randint(5, 30))
            events.append(create_event("support-connected", current_time, related_objects_map))
            current_time += timedelta(minutes=random.randint(10, 45))
            # Support can resolve or not
            if random.random() < 0.8: # 80% chance of problem being solved
                events.append(create_event("problem-solved", current_time, related_objects_map))
            else:
                # Optionally add a follow-up support request or escalate
                pass # For now, just end here

        elif scenario_choice == "refund_requested":
            current_time += timedelta(minutes=random.randint(30, 90)) # Refund usually after delivery
            events.append(create_event("order-refund-requested", current_time, related_objects_map))
            current_time += timedelta(minutes=random.randint(10, 30))
            if random.random() < 0.7: # 70% chance of confirmation
                events.append(create_event("order-refund-confirmation", current_time, related_objects_map))
            else:
                events.append(create_event("order-refund-denied", current_time, related_objects_map))

        # No specific events for "no_issue" scenario, as the standard flow already covered it

    return {"eventTypes": event_types, "objectTypes": object_types, "objects": objects, "events": events}

def simulate(NUM_ORDERS, ITEMS_PER_ORDER, BASE_TIME, filepath):
    data = generate_data(NUM_ORDERS, ITEMS_PER_ORDER, BASE_TIME)
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    NUM_ORDERS = 129
    ITEMS_PER_ORDER = (1, 18)
    BASE_TIME = datetime(2025, 2, 1, 8, 0, 0)
    filepath = r"C:\Users\Hudson Chen\Desktop\Thesis\simulated_data_1.json"
    simulate(NUM_ORDERS=NUM_ORDERS, ITEMS_PER_ORDER=ITEMS_PER_ORDER, BASE_TIME=BASE_TIME, filepath=filepath)