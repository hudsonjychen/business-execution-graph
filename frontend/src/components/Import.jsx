import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/joy';
import { useGlobal } from "./GlobalContext";
import { useFilter } from "./FilterContext";

export default function Import({ setElements, setKnowledge, setNodeCard, setObjects, setObjectTypeCounts, setActivityCounts }) {
    const { setFileImported } = useGlobal();
    const { setObjectTypes, setObjectTypeChecked, setProcesses, setProcessChecked } = useFilter();

    const fileInputRef = useRef(null);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = async (event) => {
        const file = event.target.files[0];
        if(file){
            setFileImported(true);
        };
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5002/upload", {
                method: "POST",
                body: formData,
                mode: 'cors'
            });
        
            const result = await response.json();
            console.log("Succeed", result);

            const res = await fetch("http://localhost:5002/get_data");
            const data = await res.json();
            setElements(data.elements);
            setKnowledge(data.knowledge);
            setObjectTypes(data.objectTypes);
            setNodeCard(data.nodes);
            setObjectTypeChecked(data.objectTypes);
            setObjects(data.objects);
            setProcessChecked(data.processes);
            setProcesses(data.processes);
            setObjectTypeCounts(data.otcounts);
            setActivityCounts(data.actcounts);
        } 
        catch (err) {
            console.error("Fail", err);
        }
    }

    return (
        <Box>
            <Box>
                <Button 
                    aria-label='import'
                    onClick={handleClick}
                    startDecorator={<FileOpenOutlinedIcon />}
                    variant='solid'
                    color='neutral'
                >
                    Import
                </Button>
            </Box>
            <VisuallyHiddenInput
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept=".json"
            />
        </Box>
    )
}