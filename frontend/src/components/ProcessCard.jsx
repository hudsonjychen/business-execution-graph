import { Card, Box, Stack, Typography, List, ListItem, Button } from "@mui/joy";
import { ActivityIcon, ObjectIcon } from "../util/CustomIcons";
import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { useGlobal } from "../contexts/GlobalContext";
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import useSelectorStore from "../store/useSelectorStore";
import useStatusStore from "../store/useStatusStore";


const CardTemplate = ({ processLabel, processInfo }) => {
    
    const setFocusingNode = useSelectorStore(state => state.setFocusingNode);
    const setMode = useStatusStore(state => state.setMode);

    return (
        <Card sx={{ width: 220 }}>
            <Box>
                <Typography level="title-md">
                    {processLabel}
                </Typography>
            </Box>

            <Stack direction='row' justifyContent='space-between' mb={-2}>
                <Stack direction='row' alignItems='center' spacing={0.5}>
                    <ObjectIcon fontSize='md' />
                    <Typography level="title-sm">
                        Object Types
                    </Typography>
                </Stack>
                <Typography level="body-sm"  variant="soft" mr={2}>
                    {processInfo.object_type_list.length}
                </Typography>
            </Stack>

            <List sx={{ "--List-gap": "-10px", ml: 1 }}>
                {
                    Object.entries(processInfo.object_type).map(([ot, obj]) => (
                        <ListItem 
                            key={ot}
                            sx={{ 
                                display: 'flex', 
                                direction: 'row', 
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography level="body-sm">
                                {ot}
                            </Typography>
                            <Typography level="body-sm">
                                {obj.length}
                            </Typography>
                        </ListItem>
                    ))
                }
                <ListItem sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between'}}>
                    <Typography level="body-sm" fontStyle='italic' fontWeight='bold'>
                        Total
                    </Typography>
                    <Typography  level="body-sm" variant="soft">
                        {processInfo.total_object_count}
                    </Typography>
                </ListItem>
            </List>

            <Stack direction='row' justifyContent='space-between' mb={-2}>
                <Stack direction='row' alignItems='center' spacing={0.5}>
                    <ActivityIcon fontSize='md'/>
                    <Typography level="title-sm">
                        Activities
                    </Typography>
                </Stack>
                <Typography level="body-sm" variant="soft" mr={2}>
                    {processInfo.activity_list.length}
                </Typography>
            </Stack>

            <List sx={{ "--List-gap": "-10px", ml: 1 }}>
                {
                    Object.entries(processInfo.activity).map(([act, e]) => (
                        <ListItem 
                            key={act}
                            sx={{ 
                                display: 'flex', 
                                direction: 'row', 
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography level="body-sm">
                                {act}
                            </Typography>
                            <Typography level="body-sm">
                                {e.length}
                            </Typography>
                        </ListItem>
                    ))
                }
                <ListItem sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between'}}>
                    <Typography level="body-sm" fontStyle='italic' fontWeight='bold'>
                        Total
                    </Typography>
                    <Typography level="body-sm" variant="soft">
                        {processInfo.total_event_count}
                    </Typography>
                </ListItem>
            </List>

            <Box>
                <Button 
                    onClick={() => {
                        setFocusingNode(processLabel);
                        setMode('knowledge');
                    }}
                    variant="soft"
                    color="success"
                    startDecorator={<ArrowOutwardRoundedIcon sx={{ fontSize: 16 }}/>}
                    size="sm"
                    sx={{
                        fontSize: 12
                    }}
                >
                    Focus
                </Button>
            </Box>

        </Card>
    )
}

export default function ProcessCard ({ cardRef, processLabel, processInfo, position, interactionRef }) {

    const [adjustedPos, setAdjustedPos] = useState(position);

    useEffect(() => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const canvas = interactionRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        let newX = position.x;
        let newY = position.y;

        if (position.x + cardRect.width > canvasRect.right) {
            newX = canvasRect.right - cardRect.width;
        }
        if (newX < canvasRect.left) newX = canvasRect.left;

        if (position.y + cardRect.height > canvasRect.bottom - 56) {
            newY = canvasRect.bottom - cardRect.height - 56;
        }
        if (newY < canvasRect.top - 56) newY = canvasRect.top - 56;

        setAdjustedPos({ x: newX, y: newY });
    }, [position]);

    return ReactDOM.createPortal(
        <div
            ref={cardRef}
            style={{
                position: 'absolute',
                left: adjustedPos.x,
                top: adjustedPos.y + 56,
                transition: 'left 0.05s linear, top 0.05s linear',
                zIndex: 999,
            }}
        >
            <CardTemplate processLabel={processLabel} processInfo={processInfo} />
        </div>,
        document.body
    );
};
