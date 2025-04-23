import ImportButton from "./ImportButton";
import DownloadButton from "./DownloadButton";
import InfoButton from "./InfoButton";
import './FilePanel.css'

export default function FilePanel({ setElements, setKnowledge, setInfoChip, setNodeCard, setObjects }) {
    return (
        <div className="file-panel-container">
            <div className="file-panel-item">
                <ImportButton 
                    setElements={setElements} 
                    setKnowledge={setKnowledge}
                    setInfoChip={setInfoChip}
                    setNodeCard={setNodeCard}
                    setObjects={setObjects}
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