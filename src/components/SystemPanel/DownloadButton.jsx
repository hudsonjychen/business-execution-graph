import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import IconButton from '@mui/material/IconButton';
import { useGlobal } from "../GlobalContext";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export default function DownloadButton() {
    const { pngDataUrl, vosData, fileImported, mode } = useGlobal();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePngDownload = () => {
        const a = document.createElement('a');
        a.href = pngDataUrl;
        a.download = 'inter-process-interactions.png';
        a.click();
    }

    const handleVosExport = () => {
        const idLabelMap = {};
        vosData.forEach(vd => {
            if (vd.data.label) {
                idLabelMap[vd.data.id] = vd.data.label;
            }
        });
        const dataArray = vosData
            .filter(vd => vd.data.source && vd.data.target)
            .map(vd => ({
                Source: idLabelMap[vd.data.source],
                Target: idLabelMap[vd.data.target]
            }));
        
        const jsonStr = JSON.stringify(dataArray, null, 2);

        const blob = new Blob([jsonStr], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'vos-export.json';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    return (
        <div>
            <IconButton aria-label='download' onClick={handleClick} disabled={!fileImported}>
                <DownloadOutlinedIcon />
            </IconButton>
            <Menu
                id="download-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {handleClose(); handlePngDownload();}}>Download PNG</MenuItem>
                <MenuItem disabled onClick={() => {handleClose(); handleVosExport();}}>Export as VOSviewer</MenuItem>
            </Menu>
        </div>
    )
}