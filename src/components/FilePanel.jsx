import ImportButton from "./ImportButton";
import DownloadButton from "./DownloadButton";
import InfoButton from "./InfoButton";
import '/src/styles/FilePanel.css'

export default function FilePanel({ setElements, setElementsProcess, setInfo, setNodes }) {
    return (
        <div className="file-panel-container">
            <div className="file-panel-item">
                <ImportButton 
                    setElements={setElements} 
                    setElementsProcess={setElementsProcess}
                    setInfo={setInfo}
                    setNodes={setNodes}
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