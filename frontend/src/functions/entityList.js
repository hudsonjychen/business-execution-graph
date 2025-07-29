function getEntityList(processData) {
    const objectTypeSet = new Set();
    const activitySet = new Set();
    const processSet = new Set();

    for (const key in processData) {
        const section = processData[key];

        if (section.object_type) {
            for (const type in section.object_type) {
                objectTypeSet.add(type);
            }
        }

        if (section.activity && Array.isArray(section.activity)) {
            section.activity.forEach(act => activitySet.add(act));
        }

        processSet.add(key);
    };

    const objectTypeList = Array.from(objectTypeSet);
    const activityList = Array.from(activitySet);
    const processList = Array.from(processSet);

    return { objectTypeList, activityList, processList };
}

export default getEntityList;