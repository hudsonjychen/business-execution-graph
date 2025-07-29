import { Box, IconButton, Button, Tooltip, Popover, Divider, Switch, Stack, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { useGlobal } from "../GlobalContext";
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, grey } from '@mui/material/colors';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import "./SettingDrawer.css";
import { useSetting } from "../SettingContext";
import ColorSchemeSetting from "./ColorSchemeSetting";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";

export default function ColorPalette() {
    const { mode, fileImported } = useGlobal();
    const { setSelectedColor, setColorLevelType, setSelectedColorPattern } = useSetting();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleSelect = (color, object) => {
        if(object === 'discovery'){
            setSelectedColor(color);
        }
        
        if(object === 'process'){
            setSelectedColorPattern(prev => ({
                ...prev,
                process: color
            }));
        }
        
        if(object === 'objectType'){
            setSelectedColorPattern(prev => ({
                ...prev,
                objectType: color
            }));
        }
        
        if(object === 'activity'){
            setSelectedColorPattern(prev => ({
                ...prev,
                activity: color
            }));
        }
    };

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

    const open = Boolean(anchorEl);

    const palette = (object) => {
        return(
            <Box
                sx={{display: 'grid',
                    gridTemplateColumns: 'repeat(8, 30px)',
                    gap: 0,
                    mb: 2,
                }}
            >
                {colors.map((color, index) => (
                    <Tooltip key={index} title={colorNames[index]} placement="right">
                        <Button
                            key={index}
                            onClick={() => handleSelect(color, object)}
                            sx={{
                                minWidth: 0,
                                width: 30,
                                height: 30,
                                bgcolor: color[500],
                                borderRadius: 0,
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>
        )
    }
    
    const handleReset = () => {
        setSelectedColor(null);
        setColorLevelType('disabled');
    }

    const discoveryPalette = (
        <Box>
            <Typography variant="h6" color="text.primary" mb={1}>
                Color Palette
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Select a color for nodes in the interactions.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                    Color Scheme
                </Typography>
                <ColorSchemeSetting />
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Darker nodes can indicate a higher proportion of incoming, outgoing, or total edges.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Single Color
            </Typography>
            {palette('discovery')}
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" alignItems="center">
                <Button variant="outlined" onClick={handleReset}>
                    Reset
                </Button>
            </Stack>
        </Box>
    );

    const knowledgePalette = (
        <Box>
            <Typography variant="h6" color="text.primary" mb={1}>
                Color Palette
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Select a color for nodes in the interactions.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Accordion sx={{ minWidth: 270 }}>
                <AccordionSummary  
                    expandIcon={<ArrowDownwardOutlinedIcon />}
                    aria-controls="process-node"
                    id="process-node-header"
                >
                    <Typography variant="body2" color="text.secondary">
                        Process Node
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {palette('process')}
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ minWidth: 270 }}>
                <AccordionSummary  
                    expandIcon={<ArrowDownwardOutlinedIcon />}
                    aria-controls="object-type-node"
                    id="object-type-node-header"
                >
                    <Typography variant="body2" color="text.secondary">
                        Object Type Node
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {palette('objectType')}
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ minWidth: 270, mb: 2 }}>
                <AccordionSummary  
                    expandIcon={<ArrowDownwardOutlinedIcon />}
                    aria-controls="activity-node"
                    id="activity-node-header"
                >
                    <Typography variant="body2" color="text.secondary">
                        Activity Node
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {palette('activity')}
                </AccordionDetails>
            </Accordion>
        </Box>
    )

    return (
        <div>
            <div>
                <IconButton 
                    aria-label='Palette' 
                    onClick={handleClick} 
                    disabled={!fileImported}
                >
                    <PaletteOutlinedIcon fontSize="medium" />
                </IconButton>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        sx: {
                        width: mode === 'discovery' ? 240 : 270,
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 3,
                        }
                    }}
                >
                    {mode === 'discovery' ? discoveryPalette : knowledgePalette}
                </Popover>
            </div>
        </div>
    )
}