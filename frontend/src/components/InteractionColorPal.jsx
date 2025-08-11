import { Box, Menu, MenuButton, IconButton, Typography, Divider, Tooltip, Stack, Button, Select, Option, Dropdown } from "@mui/joy";
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange } from '@mui/material/colors';
import useConfigStore from "../store/useConfigStore";

export default function InteractionColorPal() {
    const colorScheme = useConfigStore(state => state.colorScheme);
    const setColorScheme = useConfigStore(state => state.setColorScheme);
    const setSelectedColor = useConfigStore(state => state.setSelectedColor);
    const clearInteractionColorConfig = useConfigStore(state => state.clearInteractionColorConfig);

    const schemeTypes = ['disabled', 'incomingEdges', 'outgoingEdges', 'totalEdges'];
    const schemeTypeLabels = ['Disabled', 'Incoming Edges', 'Outgoing Edges', 'Total Edges'];

    const colors = [
        red, pink, purple, deepPurple,
        indigo, blue, lightBlue, cyan,
        teal, green, lightGreen, lime,
        yellow, amber, orange, deepOrange
    ];

    const colorNames = [
        'Red', 'Pink', 'Purple', 'Deep Purple',
        'Indigo', 'Blue', 'Light Blue', 'Cyan',
        'Teal', 'Green', 'Light Green', 'Lime',
        'Yellow', 'Amber', 'Orange', 'Deep Orange'
    ];

    const ColorPicker = () => {
        return(
            <Box
                sx={{display: 'grid',
                    gridTemplateColumns: 'repeat(8, 36px)',
                    gap: 0.5
                }}
            >
                {colors.map((color, index) => (
                    <Tooltip key={index} title={colorNames[index]} placement="right">
                        <Button
                            key={index}
                            onClick={() => setSelectedColor(color)}
                            sx={{
                                padding: 0,
                                width: 36,
                                height: 36,
                                bgcolor: color[500],
                                borderRadius: 5,
                                '&:hover': {
                                    backgroundColor: color[300],
                                }
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>
        )
    }

    const Palette = () => (
        <Box sx={{ m: 2, width: 318 }}>
            <Typography level="h4" mb={1}>
                Color Palette
            </Typography>
            <Typography level="body-sm" mb={2}>
                Set node color for interaction visualization.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography level="title-md">
                    Color Scheme
                </Typography>
                <Select 
                    sx={{ width: '12rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='none'
                    value={colorScheme}
                    onChange={(e, newValue) => setColorScheme(newValue)}
                >
                    {schemeTypes.map((item, index) => (
                        <Option key={item} value={item}>
                            {schemeTypeLabels[index]}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Typography level="body-sm" mb={2}>
                Darker nodes indicate higher importance based on the proportion of their incoming, outgoing, or total edges. 
                <br />Select a metric to enable color scheme.           
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack alignItems="flex-start" mb={5} spacing={2}>
                <Typography level="title-md">
                    Color Selector
                </Typography>
                <Box sx={{ alignSelf: 'center' }}>
                    <ColorPicker />
                </Box>
            </Stack>
            <Stack direction="row" alignItems="center">
                <Button level="solid" onClick={() => clearInteractionColorConfig()}>
                    Reset
                </Button>
            </Stack>
        </Box>
    )

    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
            >
                <PaletteOutlinedIcon />
            </MenuButton>
            <Menu onClick={(e) => {e.stopPropagation();}}>
                <Palette />
            </Menu>
        </Dropdown>
    )
}