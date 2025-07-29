function filterInteractionData(objectTypeChecked, processChecked, interactionData, objectToType) {
    const filteredInteractionData = {};

    for (const p1 in interactionData) {
        if (processChecked.includes(p1)) {
            for (const p2 in interactionData[p1]) {
                if (processChecked.includes[p2]) {
                    filteredInteractionData[p1] = {};
                    filteredInteractionData[p1][p2] = interactionData[p1][p2];
                }
            }
        }
    }

    for (const p1 in filteredInteractionData) {
        for (const p2 in filteredInteractionData[p1]) {
            const edge = filteredInteractionData[p1][p2]
            for (const ot of edge.object_type) {
                if (!objectTypeChecked.includes(ot)) {
                    delete edge.object_type[ot];
                }
            };
            edge.total_count = Object.values(edge.object_type).reduce((acc, cur) => acc + cur.count, 0);
            edge.object = edge.object.filter(obj => (objectTypeChecked.includes(objectToType[obj])));
            const total_time = Object.values(edge.object_type).reduce((acc, cur) => acc + sparseTimeStr(cur.average_flow_time) , 0);
            edge.average_flow_time = total_time / edge.total_count;

            filteredInteractionData[p1][p2] = edge;
        }
    } 
}