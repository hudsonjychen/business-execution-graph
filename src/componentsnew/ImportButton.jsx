import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import IconButton from '@mui/material/IconButton';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';

export default function ImportButton({ setElements, setInfo }) {
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
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
              method: "POST",
              body: formData,
            });
        
            const result = await response.json();
            console.log("Succeed", result);

            const res = await fetch("http://127.0.0.1:5000/get_data");
            const data = await res.json();
            setElements(data.elements);
            setInfo(data.info);
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