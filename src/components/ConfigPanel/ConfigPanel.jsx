import EdgeNotationConfig from "./EdgeNotationConfig";
import NodeSizeConfig from "./NodeSizeConfig";
import ObjectTypeFilter from "./ObjectTypeFilter";
import './ConfigPanel.css';

export default function ConfigPanel( 
    {   attributeTypes, notationTypes, 
        notationTypeChecked, setNotationTypeChecked
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
                    notationTypeChecked={notationTypeChecked}
                    setNotationTypeChecked={setNotationTypeChecked}
                />
            </div>
        </div>
    )
}