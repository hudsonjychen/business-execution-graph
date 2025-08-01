import { Card, Stack, Typography } from "@mui/joy";
import { ObjectIcon, ProcessIcon } from "../util/CustomIcons";
import useDataStore from "../store/useDataStore";
import useFilterStore from "../store/useFilterStore";
import summary from "../functions/summary";
import { filterProcessData } from "../functions/filters";

export default function Summary() {
    const processData = useDataStore(state => state.processData);
    const objectToType = useDataStore(state => state.objectToType);
    const selectedObjectTypes = useFilterStore(state => state.selectedObjectTypes);
    const selectedProcesses = useFilterStore(state => state.selectedProcesses);
    
    let processCount = 0, objectTypeCount = 0, objectCount = 0;

    if(Object.keys(processData).length > 0 && selectedObjectTypes.length > 0 && selectedProcesses.length > 0) {
        const filteredProcessData = filterProcessData(selectedObjectTypes, selectedProcesses, processData, objectToType);
        objectTypeCount = summary(filteredProcessData).objectTypeCount;
        objectCount = summary(filteredProcessData).objectCount;
        processCount = Object.keys(filteredProcessData).length;
    }

    return (
        <Card 
            sx={{ 
                width: 'fit-content', 
                display: 'flex', 
                flexDirection: 'row', 
                p: 2, 
                position: 'fixed', 
                right: 42, 
                bottom: 36,
                boxShadow: 'md',
                borderRadius: 'lg',
                zIndex: '10' 
            }}
        >
            <Stack direction='row'>
                <ProcessIcon />
                <Typography level="title-md">
                    Process Count: <strong>{processCount}</strong>
                </Typography>
            </Stack>
            <Stack direction='row'>
                <ObjectIcon />
                <Typography level="title-md">
                    Object Type Count: <strong>{objectTypeCount}</strong>
                </Typography>
            </Stack>
            <Stack direction='row'>
                <ObjectIcon />
                <Typography level="title-md">
                    Object Count: <strong>{objectCount}</strong>
                </Typography>
            </Stack>
        </Card>
    )
}