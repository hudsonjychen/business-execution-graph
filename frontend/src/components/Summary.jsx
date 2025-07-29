import { useFilter } from "./FilterContext";
import { objectTypeFilter } from './CanvasPage/Interaction'
import { Card, Stack, Typography } from "@mui/joy";
import { ObjectIcon, ProcessIcon } from "./CustomIcons";
import useDataStore from "../store/useDataStore";
import summary from "../functions/summary";

export default function Summary({ elements, knowledge, objects }) {
    const { processChecked, objectTypeChecked } = useFilter();
    const preloadData = useDataStore(state => state.preloadData);
    const processData = useDataStore(state => state.processData);

    console.log(processData);
    
    let processCount = 0, objectTypeCount = 0, objectCount = 0;

    if(Object.keys(preloadData).length > 0) {
        processCount = preloadData.processList.length
    }

    if(Object.keys(processData).length > 0) {
        objectTypeCount = summary(processData).objectTypeCount;
        objectCount = summary(processData).objectCount;
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