import ImportButton from "./ImportButton";
import DownloadButton from "./DownloadButton";
import InfoButton from "./InfoButton";
import './SystemPanel.css'

export default function SystemPanel({ setElements, setKnowledge, setInfoChip, setNodeCard, setObjects, setObjectTypeCounts, setActivityCounts }) {
    return (
        <div className="file-panel-container">
            <div className="file-panel-item">
                <ImportButton 
                    setElements={setElements} 
                    setKnowledge={setKnowledge}
                    setInfoChip={setInfoChip}
                    setNodeCard={setNodeCard}
                    setObjects={setObjects}
                    setObjectTypeCounts={setObjectTypeCounts}
                    setActivityCounts={setActivityCounts}
                />
            </div>
            <div className="file-panel-item">
                <DownloadButton />
            </div>
            <div className="file-panel-item">
                <InfoButton />
            </div>
        </div>
    )
}