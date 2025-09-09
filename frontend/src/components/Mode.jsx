import { Stack, Button, ToggleButtonGroup } from "@mui/joy";
import { useGlobal } from "../contexts/GlobalContext";
import useStatusStore from "../store/useStatusStore";
import { Unfold } from "../assets/CustomIcons";


export default function Mode() {
    const { fileImported } = useGlobal();
    const mode = useStatusStore(state => state.mode);
    const setMode = useStatusStore(state => state.setMode);

    return (
        <Stack direction='row' spacing={2} alignItems='center'>
            <ToggleButtonGroup
                disabled={!fileImported} 
                value={mode} 
                onChange={
                    (event, newValue) => {
                        setMode(newValue || mode);
                    }
                }
            >
                <Button value='discovery'>
                    Interactions Discovery
                </Button>
                <Button value='knowledge'>
                    Entity Relations
                </Button>
            </ToggleButtonGroup>
            <Unfold size={18} color={mode === 'unfold' ? 'primary' : null}/>
        </Stack>
    )
}