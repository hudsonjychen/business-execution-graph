import EdgeNotationConfig from "./EdgeNotationConfig";
import NodeSizeConfig from "./NodeSizeConfig";
import ObjectTypeFilter from "./ObjectTypeFilter";
import './ConfigPanel.css';

export default function ConfigPanel( 
    {   attributeTypes, notationTypes, 
        notationType, setNotationType
    } 
) {

    return (
        <div className="config-panel-container">
            <div className="config-panel-item">
                <ObjectTypeFilter />
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