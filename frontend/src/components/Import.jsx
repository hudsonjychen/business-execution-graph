import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/joy';
import { useGlobal } from "../contexts/GlobalContext";
import useDataStore from "../store/useDataStore";
import useStatusStore from "../store/useStatusStore";
import useFilterStore from "../store/useFilterStore";

export default function Import({ setElements, setKnowledge, setNodeCard }) {
    const { setFileImported } = useGlobal();

    const setLoadingStatus = useStatusStore(state => state.setLoadingStatus);

    const setFileInfo = useDataStore(state => state.setFileInfo);
    const clearFileInfo = useDataStore(state => state.clearFileInfo);
    const setPreloadData = useDataStore(state => state.setPreloadData);
    const clearPreloadData = useDataStore(state => state.clearPreloadData);
    const setProcessData = useDataStore(state => state.setProcessData);
    const setInteractionData = useDataStore(state => state.setInteractionData);
    const clearInteractionData = useDataStore(state => state.clearInteractionData);
    const clearProcessData = useDataStore(state => state.clearProcessData);
    const setObjectToType = useDataStore(state => state.setObjectToType);

    const setSelectedObjectTypes = useFilterStore(state => state.setSelectedObjectTypes);
    const setSelectedProcesses = useFilterStore(state => state.setSelectedProcesses);

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

    const pollData = (taskId) => {
        if (!taskId) {
            console.error("taskId is undefined in pollData");
            setLoadingStatus('failure');
            return;
        }

        let retries = 0;
        const maxRetries = 240;

        const intervalId = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:5002/get_data/${taskId}`);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const data = await res.json();

                if (data.ready) {
                    setLoadingStatus('success');
                    setInteractionData(data.interactionData);
                    setProcessData(data.processData);
                    setObjectToType(data.objectToType);

                    setElements(data.elements);
                    setKnowledge(data.knowledge);
                    setNodeCard(data.nodes);
                    setSelectedObjectTypes([...data.objectTypes]);
                    setSelectedProcesses([...data.processes]);
                    clearInterval(intervalId);
                } else if (++retries >= maxRetries) {
                    throw new Error("Polling timeout");
                }
            } catch (err) {
                console.error("Polling error", err);
                clearInterval(intervalId);
                setLoadingStatus('failure');
            }
        }, 500);
    };

    const handleChange = async (event) => {
        setFileImported(true);
        setLoadingStatus(null);
        clearFileInfo();
        clearPreloadData();
        clearInteractionData();
        clearProcessData();

        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5002/upload", {
                method: "POST",
                body: formData,
                mode: 'cors'
            });

            if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

            const result = await response.json();
            if (!result.taskId) throw new Error("No taskId from server");

            setFileInfo(result.fileInfo);
            setPreloadData(result.preloadData);

            pollData(result.taskId);
        } catch (err) {
            console.error("Upload error", err);
            setLoadingStatus('failure');
        }
    };

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