export default function getFlowData(graphData, processList) {
    const objectTypeNodes = [];
    const activityNodes = [];
    const processNodes = [];
    const actActEdges = [];
    const actPEdges = [];
    const edgeIdList = [];
    
    function getNodes(data) {
        const { nodes } = data;
        
        if (nodes.object_types) {
            nodes.object_types.forEach(objectType => {
                objectTypeNodes.push({
                    id: objectType,
                    data: {
                        label: objectType,
                    },
                    type: 'object_type',
                    position: { x: 0, y: 0 },
                });
            });
        }
        
        if (nodes.processes) {
            nodes.processes.forEach(process => {
                processNodes.push({
                    id: process,
                    data: {
                        label: process,
                        bottomHandles: [{ id: `${process}-b-s`, id: `${process}-b-t` }]
                    },
                    type: 'process',
                    position: { x: 0, y: 0 },
                });
            });
        }
        
        if (nodes.activities) {
            nodes.activities.forEach(activity => {
                activityNodes.push({
                    id: activity,
                    data: {
                        label: activity,
                        sourceHandles: [{ id: `${activity}-s` }],
                        targetHandles: [{ id: `${activity}-t` }],
                        topHandles: [{ id: `${activity}-tp-s`, id: `${activity}-tp-t` }]
                    },
                    type: 'activity',
                    position: { x: 0, y: 0 },
                });
            });
        }
    }
    
    function getEdges(data) {
        const { edges } = data;

        if (edges.act_act) {
            Object.entries(edges.act_act).forEach(([source, data]) => {
                Object.entries(data).forEach(([target, objectTypes]) => {
                    Object.entries(objectTypes).forEach(([objectType, objects]) => {
                        if (source === target) return;
                        const id = `${source}_${target}`;
                        const reversedId = `${target}_${source}`
                        if (edgeIdList.includes(id)) {
                            const index = actActEdges.findIndex(item => item.id === id);
                            if (index !== -1) {
                                actActEdges[index].data.objectType.push(objectType);
                                actActEdges[index].data.objects.push(...objects);
                                actActEdges[index].data.objectCount += objects.length;
                            }
                            return;
                        };
                        if (edgeIdList.includes(reversedId)) {
                            const index = actActEdges.findIndex(item => item.id === reversedId);
                            if (index !== -1) {
                                actActEdges[index].edgeType = 'bidirectional';
                                actActEdges[index].markerStart = { type: 'arrowclosed', width: 20, height: 20 };
                                actActEdges[index].data.objectType.push(objectType);
                                actActEdges[index].data.objects.push(...objects);
                                actActEdges[index].data.objectCount += objects.length;
                            }
                            return;
                        };
                        actActEdges.push({
                            id: id,
                            source: source,
                            target: target,
                            sourceHandle: `${source}-s`,
                            targetHandle: `${target}-t`,
                            markerEnd: { type: 'arrowclosed', width: 20, height: 20 },
                            type: 'act_act',
                            edgeType: 'directional',
                            data: {
                                objectType: [objectType],
                                objects: objects,
                                objectCount: objects.length
                            }
                        });
                        edgeIdList.push(`${source}_${target}`)
                    });
                });
            });
        }

        if (edges.act_p) {
            Object.entries(edges.act_p).forEach(([source, data]) => {
                Object.entries(data).forEach(([target, objectTypes]) => {
                    Object.entries(objectTypes).forEach(([objectType, objects]) => {
                        if (source === target) return;
                        const id = `${source}_${target}`;
                        const reversedId = `${target}_${source}`
                        if (edgeIdList.includes(id)) {
                            const index = actPEdges.findIndex(item => item.id === id);
                            if (index !== -1) {
                                actPEdges[index].data.objectType.push(objectType);
                                actPEdges[index].data.objects.push(...objects);
                                actPEdges[index].data.objectCount += objects.length;
                            }
                            return;
                        };
                        if (edgeIdList.includes(reversedId)) {
                            const index = actPEdges.findIndex(item => item.id === reversedId);
                            if (index !== -1) {
                                actPEdges[index].edgeType = 'bidirectional';
                                actPEdges[index].markerStart = { type: 'arrowclosed', width: 20, height: 20 };
                                actPEdges[index].data.objectType.push(objectType);
                                actPEdges[index].data.objects.push(...objects);
                                actPEdges[index].data.objectCount += objects.length;
                            }
                            return;
                        };
                        if (processList.includes(source)) {
                            actPEdges.push({
                                id: id,
                                source: source,
                                target: target,
                                sourceHandle: `${source}-b-s`,
                                targetHandle: `${target}-tp-t`,
                                markerEnd: { type: 'arrowclosed', width: 20, height: 20 },
                                type: 'act_p',
                                edgeType: 'directional',
                                data: {
                                    objectType: [objectType],
                                    objects: objects,
                                    objectCount: objects.length,
                                }
                            });
                            edgeIdList.push(`${source}_${target}`)
                        } else {
                            actPEdges.push({
                                id: id,
                                source: source,
                                target: target,
                                sourceHandle: `${source}-tp-s`,
                                targetHandle: `${target}-b-t`,
                                markerEnd: { type: 'arrowclosed', width: 20, height: 20 },
                                type: 'act_p',
                                edgeType: 'directional',
                                data: {
                                    objectType: [objectType],
                                    objects: objects,
                                    objectCount: objects.length,
                                }
                            });
                            edgeIdList.push(`${source}_${target}`)
                        }
                    });
                });
            });
        }
    }
    
    if (graphData.nodes && graphData.edges) {
        getNodes(graphData);
        getEdges(graphData);
    } 

    const nodes = {
        objectTypeNodes,
        activityNodes,
        processNodes
    }

    const initNodes = {
        activityNodes, 
        processNodes
    };
    const initEdges = {
        actActEdges,
        actPEdges
    };
    
    return { initNodes, initEdges };
}