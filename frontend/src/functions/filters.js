function sparseTimeStr(timeStr) {
    const dayMatch = timeStr.match(/(\d+)\s*days?/);
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);

    const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
    const hours = timeMatch ? parseInt(timeMatch[1], 10) : 0;
    const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
    const seconds = timeMatch ? parseInt(timeMatch[3], 10) : 0;

    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}


function formatTimeStr(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const padded = (num) => num.toString().padStart(2, '0');
    const timePart = `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`;

    return `${days} days ${timePart}`;
}


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

    return filteredProcessData
}

export {filterInteractionData, filterProcessData};