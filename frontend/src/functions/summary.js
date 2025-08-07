function summary(processData) {
    const summary = {};
    const objectTypeList = [];
    const objectList = [];

    for (const process in processData) {
        objectTypeList.push(...processData[process].object_type_list);
        objectList.push(...Object.values(processData[process].object_type).flat());
    }

    const uobjectTypeList = [...new Set(objectTypeList)];
    const uobjectList = [...new Set(objectList)];

    summary['objectTypeCount'] = uobjectTypeList.length;
    summary['objectCount'] = uobjectList.length;

    return summary;
}

export default summary;