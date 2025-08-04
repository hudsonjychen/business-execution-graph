import getEntityList from "./entityList";
import { filterInteractionData, filterProcessData } from "./filters";
import getVisData from "./visualization";

function getElements(
    interactionData, 
    processData,
    selectedObjectTypes,
    selectedProcesses,
    objectToType
) {
    const { objectTypeList, activityList, processList } = getEntityList(processData);

    const filteredInteractionData = filterInteractionData(
        selectedObjectTypes, 
        selectedProcesses, 
        interactionData, 
        objectToType
    );

    const filteredProcessData = filterProcessData(
        selectedObjectTypes, 
        selectedProcesses, 
        processData 
    );

    const {interactionElements, knowledgeElements} = getVisData(
        objectTypeList, 
        activityList, 
        processList, 
        filteredInteractionData, 
        filteredProcessData
    );

    return {interactionElements, knowledgeElements};
}

export default getElements;