function getVisData(objectTypeList, activityList, processList, interactionData, processData) {
    const labelToId = {};
    let nodeIdCounter = 0;

    const { interactionElements, updatedLabelToId, updatedNodeIdCounter } = buildInteractionsElements(
        processList, 
        interactionData, 
        processData, 
        labelToId, 
        nodeIdCounter
    );

    const knowledgeElements = buildKnowledgeElements(
        objectTypeList,
        activityList,
        processList,
        interactionData,
        updatedLabelToId,
        updatedNodeIdCounter
    );

    return { interactionElements, knowledgeElements };
}


function buildInteractionsElements(
    processList, 
    interactionData, 
    processData, 
    labelToId, 
    nodeIdCounter
) {
    const interactionElements = [];

    for (const process of processList) {
        const nodeId = String(nodeIdCounter++);
        labelToId[process] = nodeId;

        interactionElements.push({
            data: {
                id: nodeId,
                label: process,
                objectType: Object.keys(processData[process].object_type),
                objectTypeCount: Object.keys(processData[process].object_type).length,
                objectCount: processData[process].total_count,
            }
        });
    }

    for (const source in interactionData) {
        for (const target in interactionData[source]) {
            const sourceId = labelToId[source];
            const targetId = labelToId[target];

            if (sourceId && targetId) {
                interactionElements.push({
                    data: {
                        id: `${sourceId}-${targetId}`,
                        source: sourceId,
                        target: targetId,
                        totalObjectCount: interactionData[source][target].total_count,
                        averageFlowTime: String(interactionData[source][target].average_flow_time),
                        objectType: Object.keys(interactionData[source][target].object_type),
                    }
                });
            }
        }
    }

    return {
        interactionElements: interactionElements,
        updatedLabelToId: labelToId,
        updatedNodeIdCounter: nodeIdCounter,
    };
}


function buildKnowledgeElements(
    objectTypeList, 
    activityList, 
    processList, 
    processData, 
    labelToId, 
    nodeIdCounter
) {
    const knowledgeElements = [];

    for (const process of processList) {
        let nodeId = labelToId[process];
        knowledgeElements.push({
            data: {
                id: nodeId,
                label: process,
                category: "process",
            }
        });
    }

    for (const ot of objectTypeList) {
        const nodeId = String(nodeIdCounter++);
        labelToId[ot] = nodeId;
        knowledgeElements.push({
            data: {
                id: nodeId,
                label: ot,
                category: "object_type",
            }
        });
    }

    for (const at of activityList) {
        const nodeId = String(nodeIdCounter++);
        labelToId[at] = nodeId;
        knowledgeElements.push({
            data: {
                id: nodeId,
                label: at,
                category: "activity",
            }
        });
    }

    for (const process in processData) {
        const processId = labelToId[process];

        for (const ot of objectTypeList) {
            if (processData[process].object_type.hasOwnProperty(ot)) {
                knowledgeElements.push({
                    data: {
                        id: `${processId}-${labelToId[ot]}`,
                        source: processId,
                        target: labelToId[ot],
                    }
                });
            }
        }

        for (const at of activityList) {
            if (processData[process].activity.includes(at)) {
                knowledgeElements.push({
                    data: {
                        id: `${processId}-${labelToId[at]}`,
                        source: processId,
                        target: labelToId[at],
                    }
                });
            }
        }
    }

    return knowledgeElements;
}

export default getVisData;