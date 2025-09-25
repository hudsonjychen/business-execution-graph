function _getOcdfgElements(graphData) {
    const ocdfgElements = [];
    
    function addNodes(data) {
        const { nodes } = data;
        
        if (nodes.object_types) {
            nodes.object_types.forEach(objectType => {
                ocdfgElements.push({
                    data: {
                        id: objectType,
                        label: objectType,
                        type: 'object_type',
                        data: {label: objectType}
                    }
                });
            });
        }
        
        if (nodes.processes) {
            nodes.processes.forEach(process => {
                ocdfgElements.push({
                    data: {
                        id: process,
                        label: process,
                        type: 'process',
                        data: {label: process}
                    }
                });
            });
        }
        
        if (nodes.activities) {
            nodes.activities.forEach(activity => {
                ocdfgElements.push({
                    data: {
                        id: activity,
                        label: activity,
                        type: 'activity',
                        data: {label: activity}
                    }
                });
            });
        }
    }
    
    function addEdges(data) {
        const { edges } = data;
        
        if (edges.act_act) {
            Object.entries(edges.act_act).forEach(([sourceActivity, targets]) => {
                Object.entries(targets).forEach(([targetActivity, objectTypes]) => {
                    Object.entries(objectTypes).forEach(([objectType, objects]) => {
                        ocdfgElements.push({
                            data: {
                                id: `${sourceActivity}_${targetActivity}_${objectType}`,
                                source: sourceActivity,
                                target: targetActivity,
                                label: `${objectType}: ${objects.length}`,
                                type: 'act_act',
                                edgeType: 'directional',
                                objectType: objectType,
                                objects: objects,
                                objectCount: objects.length
                            }
                        });
                    });
                });
            });
        }
        
        if (edges.act_p) {
            Object.entries(edges.act_p).forEach(([sourceActivity, targets]) => {
                Object.entries(targets).forEach(([targetProcess, objectTypes]) => {
                    Object.entries(objectTypes).forEach(([objectType, objects]) => {
                        ocdfgElements.push({
                            data: {
                                id: `${sourceActivity}_${targetProcess}_${objectType}`,
                                source: sourceActivity,
                                target: targetProcess,
                                label: `${objectType}`,
                                type: 'act_p',
                                edgeType: 'directional',
                                objectType: objectType,
                                objects: objects
                            }
                        });
                    });
                });
            });
        }
        
        if (edges.act_ot) {
            if (edges.act_ot.start) {
                Object.entries(edges.act_ot.start).forEach(([objectType, activities]) => {
                    Object.entries(activities).forEach(([activity, objects]) => {
                        ocdfgElements.push({
                            data: {
                                id: `start_${objectType}_${activity}`,
                                source: objectType,
                                target: activity,
                                label: `${objectType}`,
                                type: 'act_ot_start',
                                edgeType: 'directional',
                                objectType: objectType,
                                objects: objects
                            }
                        });
                    });
                });
            }
            
            if (edges.act_ot.end) {
                Object.entries(edges.act_ot.end).forEach(([objectType, activities]) => {
                    Object.entries(activities).forEach(([activity, objects]) => {
                        ocdfgElements.push({
                            data: {
                                id: `end_${objectType}_${activity}`,
                                source: activity,
                                target: objectType,
                                label: `${objectType}`,
                                type: 'act_ot_end',
                                edgeType: 'directional',
                                objectType: objectType,
                                objects: objects
                            }
                        });
                    });
                });
            }
        }
    }
    
    if (graphData.nodes && graphData.edges) {
        addNodes(graphData);
        addEdges(graphData);
    } 
    
    return ocdfgElements;
}


function _optimizeOcdfgElements(elements) {
    const allNodes = elements.filter(ele => ['object_type', 'process', 'activity'].includes(ele.data.type));
    const edges = elements.filter(ele => !['object_type', 'process', 'activity'].includes(ele.data.type));
    
    const edgeGroups = new Map();
    
    edges.forEach(edge => {
        const source = edge.data.source;
        const target = edge.data.target;
        
        const nodesPair = [source, target].sort().join('_');
        
        if (!edgeGroups.has(nodesPair)) {
            edgeGroups.set(nodesPair, []);
        }
        
        edgeGroups.get(nodesPair).push(edge);
    });
    
    const mergedEdges = [];
    
    edgeGroups.forEach((edgeGroup, nodesPair) => {
        if (edgeGroup.length === 0) return;
        
        const firstEdge = edgeGroup[0];
        const source = firstEdge.data.source;
        const target = firstEdge.data.target;
        
        const edgeDetails = {};
        
        let hasBidirectional = false;
        const forwardEdges = [];
        const backwardEdges = [];
        const edgeTypes = new Set();
        
        edgeGroup.forEach(edge => {
            const edgeData = edge.data;
            edgeTypes.add(edgeData.type);
            
            if (edgeData.source === source && edgeData.target === target) {
                forwardEdges.push(edge);
            } else {
                backwardEdges.push(edge);
                hasBidirectional = true;
            }
            
            const directionKey = edgeData.source === source ? 'forward' : 'backward';
            const detailKey = `(${edgeData.source},${edgeData.target})`;
            
            if (!edgeDetails[detailKey]) {
                edgeDetails[detailKey] = {
                    source: edgeData.source,
                    target: edgeData.target,
                    type: edgeData.type,
                    direction: directionKey,
                    objectType: edgeData.objectType,
                    objects: edgeData.objects || [],
                    objectCount: edgeData.objectCount || 0,
                    originalLabel: edgeData.label,
                    originalId: edgeData.id,
                };
            }
        });
        
        const typesList = Array.from(edgeTypes);
        let edgeTypeIndicator = 'directional';
        let labelParts = [];
        
        if (hasBidirectional) {
            edgeTypeIndicator = 'bidirectional';
            labelParts.push(`${forwardEdges.length}→`, `${backwardEdges.length}←`);
        } else {
            labelParts.push(`${forwardEdges.length} edges`);
        }
        
        const label = `${typesList.join(',')} (${labelParts.join(', ')})`;
        
        const mergedEdge = {
            data: {
                id: `merged_${source}_${target}`,
                source: source,
                target: target,
                labelData: label,
                type: 'merged',
                edgeType: edgeTypeIndicator,
                
                edgeDetails: edgeDetails,
                
                totalEdgeCount: edgeGroup.length,
                forwardEdgeCount: forwardEdges.length,
                backwardEdgeCount: backwardEdges.length,
                edgeTypes: typesList,
                
                totalObjectCount: edgeGroup.reduce((sum, edge) => sum + (edge.data.objectCount || 0), 0),
                allObjectTypes: [...new Set(edgeGroup.map(edge => edge.data.objectType).filter(Boolean))],
                label: [...new Set(edgeGroup.map(edge => edge.data.objectType).filter(Boolean))],
                allObjects: edgeGroup.reduce((all, edge) => {
                    if (edge.data.objects) {
                        return [...all, ...edge.data.objects];
                    }
                    return all;
                }, [])
            }
        };
        
        mergedEdges.push(mergedEdge);
    });

    const connectedNodeIds = new Set();
    
    edges.forEach(edge => {
        connectedNodeIds.add(edge.data.source);
        connectedNodeIds.add(edge.data.target);
    });
    
    mergedEdges.forEach(edge => {
        connectedNodeIds.add(edge.data.source);
        connectedNodeIds.add(edge.data.target);
    });
    
    const connectedNodes = allNodes.filter(node => connectedNodeIds.has(node.data.id));
    
    const optimizedElements = [...connectedNodes, ...mergedEdges];
    return optimizedElements;
}


function getElements(graphData) {
    const elements = _getOcdfgElements(graphData);
    const optimizedElements = _optimizeOcdfgElements(elements);

    return optimizedElements;
}


function _getNodeArray(elements, type) {
    const nodeArray = elements
        .filter(ele => ele.data.type === type)
        .map(ele => ele.data.id)

    return nodeArray;
}


function _calculateNodesLayers(elements) {
    const layers = {};

    elements.forEach(ele => {
        if (!ele.data.source && !ele.data.target) return;
        if (ele.data.source === ele.data.target) return;
        if (!ele.data.edgeTypes.includes('act_act')) return;

        layers[ele.data.target] = (layers[ele.data.target] || 0) + 1;
    });

    const nodesLayers = Object.entries(layers).reduce((result, [key, value]) => {
        if (!result[value]) {
            result[value] = [];
        }
        result[value].push(key);
        return result;
    }, {});

    console.log(nodesLayers);

    return nodesLayers;
}


function _calculateNodePositions(elements, layers, YRange, XRange = null) {
    const result = {};

    const processY = 850;
    const objectTypeY = 150;

    const processNodes = _getNodeArray(elements, 'process');
    const objectTypeNodes = _getNodeArray(elements, 'object_type');

    console.log(processNodes);
    console.log(objectTypeNodes);

    const layerKeys = Object.keys(layers)
        .map(Number)
        .sort((a, b) => a - b);
    const numLayers = layerKeys.length;

    const xMin = 10;
    const xMax = 1000;
    const yMin = YRange[0];
    const yMax = YRange[1];

    const xStep = numLayers > 1 ? (xMax - xMin) / (numLayers - 1) : 0;

    layerKeys.forEach((layerKey, layerIndex) => {
        const nodes = layers[layerKey];
        const numNodes = nodes.length;

        const x = xMin + layerIndex * xStep;

        if (numNodes === 0) return;

        if (numNodes === 1) {
            const y = (yMin + yMax) / 2;
            if (!result[nodes[0]]) {
                result[nodes[0]] = { x, y };
            }
        } else {
            const yStep = (yMax - yMin) / (numNodes - 1);
            nodes.forEach((nodeId, nodeIndex) => {
                const y = yMin + nodeIndex * yStep;
                if (!result[nodeId]) {
                    result[nodeId] = { x, y };
                }
            });
        }
    });

    const xStart = 100;
    const xEnd = 1000;
    const processN = processNodes.length;

    if (processN === 1) {
        const nodeId = processNodes[0];
        if (!result[nodeId]) {
            result[nodeId] = { x: (xStart + xEnd) / 2, y: processY };
        }
    } else if (processN > 1) {
        const processStep = (xEnd - xStart) / (processN - 1);
        processNodes.forEach((nodeId, i) => {
            if (!result[nodeId]) {
                result[nodeId] = {
                    x: xStart + i * processStep,
                    y: processY,
                };
            }
        });
    }

    const objectTypeN = objectTypeNodes.length;

    if (objectTypeN === 1) {
        const nodeId = objectTypeNodes[0];
        if (!result[nodeId]) {
            result[nodeId] = { x: (xStart + xEnd) / 2, y: objectTypeY };
        }
    } else if (objectTypeN > 1) {
        const objectTypeStep = (xEnd - xStart) / (objectTypeN - 1);
        objectTypeNodes.forEach((nodeId, i) => {
            if (!result[nodeId]) {
                result[nodeId] = {
                    x: xStart + i * objectTypeStep,
                    y: objectTypeY,
                };
            }
        });
    }

    console.log(result);
    return result;
}

function getFlowData(elements) {
    const activityYRange = [250, 650];

    const layers = _calculateNodesLayers(elements);
    const positions = _calculateNodePositions(elements, layers, activityYRange);

    const flowData = elements.map(ele => {
        const data = { ...ele.data };
        data['position'] = positions[data.id] || { x: 0, y: 0 };
        return data;
    });

    const nodes = flowData.filter(data => {
        return !data.source && !data.target;
    });

    const edges = flowData.filter(data => {
        return data.source && data.target;
    });

    console.log(nodes);
    console.log(edges);
    return {nodes, edges};
}

export {getElements, getFlowData};