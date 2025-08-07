import { Box, Button, ToggleButtonGroup } from "@mui/joy";
import { useGlobal } from "../contexts/GlobalContext";
import useStatusStore from "../store/useStatusStore";


export default function Mode() {
    const { fileImported } = useGlobal();
    const mode = useStatusStore(state => state.mode);
    const setMode = useStatusStore(state => state.setMode);

    return (
        <Box>
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
        </Box>
    )
}