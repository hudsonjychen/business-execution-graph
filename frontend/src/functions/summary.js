function summary(processData) {
    const summary = {};
    const objectTypeList = [];
    const objectList = [];

    for (const process in processData) {
        objectTypeList.push(...Object.keys(processData[process].object_type));
        objectList.push(...processData[process].object);
    }

    const uobjectTypeList = [...new Set(objectTypeList)];
    const uobjectList = [...new Set(objectList)];

    summary['objectTypeCount'] = uobjectTypeList.length;
    summary['objectCount'] = uobjectList.length;

    return summary;
}

export default summary;