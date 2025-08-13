import { sparseTimeStr, formatTimeStr } from "./utils";


function filterInteractionData(selectedObjectTypes, selectedProcesses, interactionData, objectToType) {
    const filteredInteractionData = {};

    for (const p1 in interactionData) {
        if (!selectedProcesses.includes(p1)) continue;

        for (const p2 in interactionData[p1]) {
            if (!selectedProcesses.includes(p2)) continue;

            const originalEdge = interactionData[p1][p2];

            const filteredObjectType = {};
            for (const type in originalEdge.object_type) {
                if (selectedObjectTypes.includes(type)) {
                    filteredObjectType[type] = originalEdge.object_type[type];
                }
            }
            if (Object.keys(filteredObjectType).length < 1) continue;

            const total_count = Object.values(filteredObjectType).reduce((acc, cur) => acc + cur.count, 0);
            const total_time = Object.values(filteredObjectType).reduce((acc, cur) => acc + sparseTimeStr(cur.average_flow_time) * cur.count, 0);
            const average_flow_time_seconds = total_count > 0 ? total_time / total_count : 0;
            const average_flow_time = formatTimeStr(average_flow_time_seconds);

            const filteredObjects = originalEdge.object.filter(obj =>
                selectedObjectTypes.includes(objectToType[obj])
            );

            const filteredEdge = {
                ...originalEdge,
                object_type: filteredObjectType,
                total_count,
                average_flow_time,
                object: filteredObjects,
            };

            if (!filteredInteractionData[p1]) {
                filteredInteractionData[p1] = {};
            }
            filteredInteractionData[p1][p2] = filteredEdge;
        }
    }

    console.log(filteredInteractionData);

    return filteredInteractionData;
}


function filterProcessData(selectedObjectTypes, selectedProcesses, processData) {
    const filteredProcessData = {};

    for (const p in processData) {
        if (!selectedProcesses.includes(p)) continue;

        const originalNode = processData[p];

        const filteredObjectType = {};
        for (const type in originalNode.object_type) {
            if (selectedObjectTypes.includes(type)) {
                filteredObjectType[type] = originalNode.object_type[type];
            }
        }

        if (Object.keys(filteredObjectType).length < 1) continue;

        const objectTypeList = Object.keys(filteredObjectType)
        const totalObjectCount = Object.values(filteredObjectType).reduce((acc, cur) => acc + cur.length, 0);

        const filteredNode = {
            ...originalNode,
            object_type: filteredObjectType,
            object_type_list: objectTypeList,
            total_object_count: totalObjectCount,
        };

        if (!filteredProcessData[p]) {
            filteredProcessData[p] = {};
        }
        filteredProcessData[p] = filteredNode;

    }

    console.log(filteredProcessData);

    return filteredProcessData
}

export { sparseTimeStr, formatTimeStr, filterInteractionData, filterProcessData };