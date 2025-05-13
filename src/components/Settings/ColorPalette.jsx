import { Box, IconButton, Button, Tooltip, Popover, Divider, Switch, Stack } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { useGlobal } from "../GlobalContext";
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, grey } from '@mui/material/colors';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import "./SettingDrawer.css";
import { useSetting } from "../SettingContext";

export default function ColorPalette() {
    const { fileImported } = useGlobal();
    const { setSelectedColor } = useSetting();
    const [anchorEl, setAnchorEl] = useState(null);
    const [checked, setChecked] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleSelect = (color) => {
        setSelectedColor(color);
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

    const neutralColors = [ grey[300], grey[500], grey[700] ];
    const neutralColorNames = [ 'Light Grey', 'grey', 'Deep Grey' ];
    const patternColors = [ blue, red, lightGreen, amber, deepPurple ];

    const open = Boolean(anchorEl);

    const palette = (
        <Box>
            <Box
                sx={{display: 'grid',
                    gridTemplateColumns: 'repeat(4, 60px)',
                    gap: 0,
                    mb: 2,
                }}
            >
                {colors.map((color, index) => (
                    <Tooltip key={index} title={colorNames[index]} placement="right">
                        <Button
                            key={index}
                            onClick={() => handleSelect(color[500])}
                            sx={{
                                minWidth: 0,
                                width: 60,
                                height: 60,
                                bgcolor: color[500],
                                borderRadius: 0,
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>
            <Box
                sx={{display: 'grid',
                    gridTemplateColumns: 'repeat(3, 80px)',
                    gap: 0,
                    mb: 2,
                }}
            >
                {neutralColors.map((color, index) => (
                    <Tooltip key={index} title={neutralColorNames[index]} placement="right">
                        <Button
                            key={index}
                            onClick={() => handleSelect(color)}
                            sx={{
                                minWidth: 0,
                                width: 80,
                                height: 80,
                                bgcolor: color,
                                borderRadius: 0,
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>
        </Box>
    )

    const colorPattern = (
        <Box
            sx={{display: 'grid',
                gridTemplateColumns: 'repeat(5, 30px)',
                gap: 0,
                height: 34,
                alignItems: 'center'
            }}
        >
            {patternColors.map((color, index) => (
                <Box
                    key={index}
                    sx={{
                        minWidth: 0,
                        width: 30,
                        height: 30,
                        bgcolor: color[500],
                        borderRadius: 0,
                    }}
                />
            ))}
        </Box>
    )
    
    const handleSwitch = (event) => {
        setChecked(event.target.checked);
        if(event.target.checked){
            setSelectedColor('colorPattern');
        } else {
            setSelectedColor(null);
        }
    }

    return (
        <div>
            <div className="palette-button">
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
                        width: 240,
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 3,
                        }
                    }}
                >
                    <Box>
                        <Typography variant="h6" color="text.primary" mb={1}>
                            Color Palette
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Select a color for nodes in the interactions.
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>
                            Single Color
                        </Typography>
                        {palette}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>
                            Multi Color
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" >
                            {colorPattern}
                            <Switch checked={checked} onChange={handleSwitch}/>
                        </Stack>
                    </Box>
                </Popover>
            </div>
        </div>
    )
}