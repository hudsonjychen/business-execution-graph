import { Sheet, Stack } from "@mui/joy";
import Filters from "../components/Filters";
import Import from "../components/Import";
import Download from "../components/Download";
import InteractionColorPal from "../components/InteractionColorPal";
import InteractionConfigs from "../components/InteractionConfigs";
import Mode from "../components/Mode";
import KnowledgeColorPal from "../components/KnowledgeColorPal";
import KnowledgeConfigs from "../components/KnowledgeConfigs";
import useStatusStore from "../store/useStatusStore";


export default function Top({ setElements, setKnowledge, setNodeCard }) {
    const mode = useStatusStore(state => state.mode);

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
                {
                    mode === 'discovery' ? (
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <InteractionColorPal />
                            <InteractionConfigs />
                        </Stack>
                    ) : (
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <KnowledgeColorPal />
                            <KnowledgeConfigs />
                        </Stack>
                    )
                }
            </Stack>
        </Sheet>
    )
}