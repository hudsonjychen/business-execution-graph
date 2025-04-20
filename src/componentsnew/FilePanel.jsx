import ImportButton from "./ImportButton";
import DownloadButton from "./DownloadButton";
import InfoButton from "./InfoButton";
import '/src/stylesnew/FilePanel.css'

export default function FilePanel({ setElements, setInfo, setNodes }) {
    return (
        <div className="file-panel-container">
            <div className="file-panel-item">
                <ImportButton 
                    setElements={setElements} 
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