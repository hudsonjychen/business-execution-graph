import ObjectTypeFilter from "./ObjectTypeFilter";
import ProcessFilter from "./ProcessFilter";
import './FilterPanel.css';

export default function FilterPanel() {
    return (
        <div className="config-panel-container">
            <div className="config-panel-item">
                <ObjectTypeFilter />
            </div>
            <div className="config-panel-item">
                <ProcessFilter />
            </div>
        </div>
    )
}