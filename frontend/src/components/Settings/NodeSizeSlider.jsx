import { Box, Slider } from "@mui/material";
import { useSetting } from "../SettingContext"
import { grey } from "@mui/material/colors";

const idMap = {
        'process': 0,
        'object_type': 1,
        'activity': 2
    };

export default function NodeSizeSlider({ nodeType }) {
    const { nodeSize, setNodeSize } = useSetting();
    const index = idMap[nodeType];

    const handleChange = (event, newValue) => {
        setNodeSize(prev => {
            const updatedNodeSize = [...prev];
            updatedNodeSize[index] = newValue;
            return updatedNodeSize;
        })
    }

    return (
        <Box sx={{width: 190, mr: 2, mb: 2}}>
            <Slider 
                sx={{
                    color: grey[500],
                    '& .MuiSlider-track': {
                        backgroundColor: grey[500],
                    },
                }}
                aria-label="node-size-slider"
                defaultValue={nodeSize[index]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                step={10}
                min={10}
                max={120}
            />
        </Box>
    )
}