import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import IconButton from '@mui/material/IconButton';
import { useGlobal } from "../GlobalContext";

export default function DownloadButton() {
    const { pngDataUrl, fileImported } = useGlobal();

    const handleClick = () => {
        const a = document.createElement('a');
        a.href = pngDataUrl;
        a.download = 'inter-process-interactions.png';
        a.click();
    }

    return (
        <div>
            <IconButton aria-label='download' onClick={handleClick} disabled={!fileImported}>
                <DownloadOutlinedIcon />
            </IconButton>
        </div>
    )
}