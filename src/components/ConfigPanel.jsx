import EdgeNotationConfig from "./EdgeNotationConfig";
import NodeSizeConfig from "./NodeSizeConfig";
import ObjectTypeFilter from "./ObjectTypeFilter";
import '/src/styles/ConfigPanel.css'

export default function ConfigPanel( 
    {   objectTypes, attributeTypes, notationTypes, 
        notationType, setNotationType, 
        objectTypeChecked, setObjectTypeChecked 
    } 
) {

    return (
        <div className="config-panel-container">
            <div className="config-panel-item">
                <ObjectTypeFilter 
                    objectTypes={objectTypes}
                    objectTypeChecked={objectTypeChecked}
                    setObjectTypeChecked={setObjectTypeChecked} 
                />
            </div>
            <div className="config-panel-item">
                <NodeSizeConfig attributeTypes={attributeTypes} />
            </div>
            <div className="config-panel-item">
                <EdgeNotationConfig 
                    notationTypes={notationTypes} 
                    notationType={notationType}
                    setNotationType={setNotationType}
                />
            </div>
        </div>
    )
}