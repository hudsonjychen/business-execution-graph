const getImportanceIndex = (elements, type) => {
    const targetInstance = {};
    const importanceIndex = {};
    const targetList = [];

    const nodeList = elements
        .filter(element => element.data.label)
        .map(element => element.data.id);
    
    const edgeList = elements.filter(element => !element.data.label);
    if (type === 'incomingEdges'){
        targetList.push(...edgeList.map(element => element.data.target));
    } else if (type === 'outgoingEdges'){
        targetList.push(...edgeList.map(element => element.data.source));
    } else if (type === 'totalEdges'){
        targetList.push(...edgeList.flatMap(element => [element.data.target, element.data.source]));
    } else {
        return null;
    }

    targetList.forEach(target => {
        targetInstance[target] = (targetInstance[target] || 0) + 1;
    });

    const maxValue = Math.max(...Object.values(targetInstance));
    const minValue = Math.min(...Object.values(targetInstance));
    const range = maxValue - minValue;
    const a = 0.125;
    const b = 1;
    if(range){
        for (const key in targetInstance){
            const normalized = (targetInstance[key] - minValue) / range;
            importanceIndex[key] = a + normalized * (b - a);
        }
    } else{
        for (const key in targetInstance){
            importanceIndex[key] = 0.625;
        }
    }

    nodeList.forEach(node => {
        if (!Object.keys(importanceIndex).includes(node)) {
            importanceIndex[node] = 0;
        }
    })
    return importanceIndex;
};

const mapToLevel = (value, levels) => {
    const target = value * 800;
    return levels.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
};

export { getImportanceIndex, mapToLevel };