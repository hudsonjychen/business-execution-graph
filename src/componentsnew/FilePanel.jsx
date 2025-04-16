import ImportButton from "./ImportButton";
import DownloadButton from "./DownloadButton";
import InfoButton from "./InfoButton";
import '/src/stylesnew/FilePanel.css'

export default function FilePanel({ setElements, setInfo }) {
    return (
        <div className="file-panel-container">
            <div className="file-panel-item">
                <ImportButton setElements={setElements} setInfo={setInfo}/>
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