import { Sheet, Stack } from "@mui/joy";
import Filters from "./Filters";
import Import from "./Import";
import Download from "./Download";
import ColorPalette from "./ColorPalette";
import Configurations from "./Configurations";
import Mode from "./Mode";

export default function Top({ setElements, setKnowledge, setNodeCard, setObjectTypeCounts, setActivityCounts }) {
    return (
        <Sheet
            variant="plain"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'white',
                borderBottom: '1.2px solid',
                borderColor: 'neutral.outlinedBorder',
                position: 'fixed',
                top: 0,
                left: 0,
                height: 66,
                width: '100%',
            }}
        >
            <Stack direction='row' spacing={2} sx={{ ml: 4 }} >
                <Import
                    setElements={setElements} 
                    setKnowledge={setKnowledge}
                    setNodeCard={setNodeCard}
                />
                <Download />
            </Stack>
            <Stack direction='row' justifyContent='flex-start' sx={{ width: 460 }}>
                <Mode />
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ mr: 3 }}>
                <Filters />
                <ColorPalette />
                <Configurations />
            </Stack>
        </Sheet>
    )
}