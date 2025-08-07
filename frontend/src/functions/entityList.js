function getEntityList(processData) {
    const objectTypeSet = new Set();
    const activitySet = new Set();
    const processSet = new Set();

    for (const process in processData) {
        const section = processData[process];

        if (section.object_type_list) {
            section.object_type_list.forEach(type => objectTypeSet.add(type));
        }

        if (section.activity_list) {
            section.activity_list.forEach(activity => activitySet.add(activity));
        }

        processSet.add(process);
    };

    const objectTypeList = Array.from(objectTypeSet);
    const activityList = Array.from(activitySet);
    const processList = Array.from(processSet);

    return { objectTypeList, activityList, processList };
}

export default getEntityList;