import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useGlobal } from "./GlobalContext";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Box, Button } from '@mui/joy';

export default function Download() {
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
        const items = []
        const links = []
        vosData.forEach(vd => {
            if(vd.data.label){
                const item = {
                    "id": vd.data.id,
                    "label": vd.data.label,
                    "weights": {
                        "object_type_count": vd.data.objectTypeCount,
                        "object_count": vd.data.objectCount,
                        "process_instance_count": vd.data.processInstanceCount
                    }
                }
                items.push(item);
            } else{
                const link ={
                    "source_id": vd.data.source,
                    "target_id": vd.data.target,
                    "strength": vd.data.totalObjectCount
                }
                links.push(link);
            }
        })

        items.forEach(item => {
            item.x = Math.random() * 2 - 1;
            item.y = Math.random() * 2 - 1;
        });

        const dataObject = {
            "network":{
                "items": items,
                "links": links
            }
        }

        const jsonStr = JSON.stringify(dataObject, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const filename = "vosdata.json"
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    return (
        <Box>
            <Box>
                <Button 
                    aria-label='download'
                    onClick={handleClick}
                    startDecorator={<DownloadOutlinedIcon />}
                    variant='soft'
                    color='neutral'
                    disabled={!fileImported}
                >
                    Download
                </Button>
            </Box>
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
                <MenuItem onClick={() => {handleClose(); handleVosExport();}}>Export as VOSviewer</MenuItem>
            </Menu>
        </Box>
    )
}