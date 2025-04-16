import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import IconButton from '@mui/material/IconButton';

export default function DownloadButton() {
    return (
        <div>
            <IconButton aria-label='download'>
                <DownloadOutlinedIcon />
            </IconButton>
        </div>
    )
}