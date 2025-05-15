import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

export default function TimeSlider( {range, marks} ){

    function valuetext(value) {
        return `${value}`;
    }

    const minDistance = 10;

    const [value, setValue] = useState([10, range]);

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
        return;
        }
    
        if (activeThumb === 0) {
        setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
        } else {
        setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
        }
    };

    const handleReset = () => {
        setValue([10, range])
    }

    return (
        <div className = 'bottom-tool-container'>
            <div className = 'bottom-slider-item'>
            <Box sx={{ width: 600 }}>
                <Slider
                    getAriaLabel={() => 'Minimum distance'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="off"
                    getAriaValueText={valuetext}
                    marks={marks}
                    step={10}
                    min={10}
                    max={range}
                    disableSwap
                />
            </Box>
            </div>
            <div className = 'bottom-button-item'>
                <Button variant='contained' onClick={handleReset}>RESET</Button>
            </div>
        </div>
    );
}