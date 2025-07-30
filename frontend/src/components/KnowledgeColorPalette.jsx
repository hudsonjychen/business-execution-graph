import { Box, Menu, MenuButton, IconButton, Typography, Divider, Tooltip, Stack, Button, Select, Option, Dropdown, Radio, RadioGroup } from "@mui/joy";
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange } from '@mui/material/colors';
import useConfigStore from "../store/useConfigStore";
import { useState } from "react";

export default function KnowledgeColorPalette() {
    const [selectedType, setSelectedType] = useState('process');
    
    const setColorSet = useConfigStore(state => state.setColorSet);
    const clearKnowledgeColorConfig = useConfigStore(state => state.clearKnowledgeColorConfig);

    const nodeTypes = ['process', 'objectType', 'activity'];
    const nodeTypeLabels = ['Process', 'Object Type', 'Activity'];

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

    const NodeTypeControl = () => {
        return (
            <RadioGroup
                orientation="horizontal"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                sx={{
                    minHeight: 42,
                    padding: '4px',
                    borderRadius: '12px',
                    bgcolor: 'neutral.softBg',
                    '--RadioGroup-gap': '4px',
                    '--Radio-actionRadius': '8px',
                }}
            >
                {nodeTypes.map((item, index) => (
                    <Radio
                        key={item}
                        color="neutral"
                        value={item}
                        disableIcon
                        label={
                            <Typography level="title-sm">{nodeTypeLabels[index]}</Typography>
                        }
                        variant="plain"
                        sx={{ px: 2, alignItems: 'center' }}
                        slotProps={{
                            action: ({ checked }) => ({
                                sx: {
                                    ...(checked && {
                                        bgcolor: 'background.surface',
                                        boxShadow: 'sm',
                                        '&:hover': {
                                        bgcolor: 'background.surface',
                                        },
                                    }),
                                },
                            }),
                        }}
                    />
                ))}
            </RadioGroup>
        )
    }

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
                            onClick={() => setColorSet(selectedType, color)}
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
                Assign colors for nodes of different types to help visualization.
            </Typography>
            <Stack alignItems="center" justifyContent="center" mb={3}>
                <NodeTypeControl />
            </Stack>
            <Stack alignItems="flex-start" mb={5} spacing={2}>
                <Typography level="title-md">
                    Color Selector
                </Typography>
                <Box sx={{ alignSelf: 'center' }}>
                    <ColorPicker />
                </Box>
            </Stack>
            <Stack direction="row" alignItems="center">
                <Button level="solid" onClick={() => clearKnowledgeColorConfig()}>
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