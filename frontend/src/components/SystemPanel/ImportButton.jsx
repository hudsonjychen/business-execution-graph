import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import IconButton from '@mui/material/IconButton';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useGlobal } from "../GlobalContext";
import { useFilter } from "../FilterContext";

export default function ImportButton({ setElements, setKnowledge, setNodeCard, setObjects, setObjectTypeCounts, setActivityCounts }) {
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
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
                mode: 'cors'
            });
        
            const result = await response.json();
            console.log("Succeed", result);

            const res = await fetch("http://localhost:5000/get_data");
            const data = await res.json();
            setElements(data.elements);
            setKnowledge(data.knowledge);
            setObjectTypes(['all', ...data.objectTypes]);
            setNodeCard(data.nodes);
            setObjectTypeChecked(['all', ...data.objectTypes]);
            setObjects(data.objects);
            setProcessChecked(['all', ...data.processes]);
            setProcesses(['all', ...data.processes]);
            setObjectTypeCounts(data.otcounts);
            setActivityCounts(data.actcounts);
        } 
        catch (err) {
            console.error("Fail", err);
        }
    }

    return (
        <div>
            <IconButton aria-label='import' onClick={handleClick}>
                <FileOpenOutlinedIcon />
            </IconButton>
            <VisuallyHiddenInput
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept=".json"
            />
        </div>
    )
}