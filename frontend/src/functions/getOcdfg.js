function getOcdfgElements(graphData) {
    const ocdfgElements = [];
    
    function addNodes(data) {
        const { nodes } = data;
        
        if (nodes.object_types) {
            nodes.object_types.forEach(objectType => {
                ocdfgElements.push({
                    data: {
                        id: objectType,
                        label: objectType,
                        type: 'object_type'
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
                        type: 'process'
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
                        type: 'activity'
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
                                source: activity,
                                target: objectType,
                                label: `${objectType}`,
                                type: 'act_ot_start',
                                objectType: objectType,
                                objects: objects,
                                relation: 'start'
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
                                objectType: objectType,
                                objects: objects,
                                relation: 'end'
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

export default getOcdfgElements;