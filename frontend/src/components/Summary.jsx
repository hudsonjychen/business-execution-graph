import { useFilter } from "./FilterContext";
import { objectTypeFilter } from './CanvasPage/Interaction'
import { Card, Stack, Typography } from "@mui/joy";
import { ObjectIcon, ProcessIcon } from "./CustomIcons";

export default function Summary({ elements, knowledge, objects }) {
    const { objectTypeChecked } = useFilter();
    let processCount = 0, objectTypeCount = 0, objectCount = 0;

    if(elements){
        const filteredElements = objectTypeFilter(elements, objectTypeChecked);

        filteredElements.forEach(element => {
            if(element['data']['label']){
                processCount += 1;
            }
        });

        knowledge.forEach(element => {
            if(element['data']['category'] === 'object_type' && objectTypeChecked.includes(element['data']['label'])){
                objectTypeCount += 1;
            }
        });

        Object.entries(objects).forEach(([obj, type]) => {
            if (objectTypeChecked.includes(type)) {
                objectCount += 1;
            }
        });
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
                bottom: 48,
                boxShadow: 'md',
                borderRadius: 'lg' 
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