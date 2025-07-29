import { Box, Button, ToggleButtonGroup } from "@mui/joy";
import { useGlobal } from "./GlobalContext";

export default function Mode() {
    const { mode, setMode, fileImported } = useGlobal();

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