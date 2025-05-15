import { TextField } from "@mui/material";
import { useSetting } from "../SettingContext";

export function ObjectTypeFrequencyInput() {
    const { objectTypeFrequency, setObjectTypeFrequency } = useSetting();
    const handleChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (value === "") {
            setObjectTypeFrequency(null)
        };
        setObjectTypeFrequency(value)
    }
    return (
        <TextField 
            id="object-type-frequency-input"
            type="number"
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
            }}
            defaultValue={0}
            value={objectTypeFrequency}
            onChange={handleChange}
            sx={{ m: 1, width: 200}} 
            size='small'
        />
    )
}

export function ActivityFrequencyInput() {
    const { activityFrequency, setActivityFrequency } = useSetting();
    const handleChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setActivityFrequency(value)
    }
    return (
        <TextField 
            id="activity-frequency-input"
            type="number"
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
            }}
            defaultValue={0}
            value={activityFrequency}
            onChange={handleChange}
            sx={{ m: 1, width: 200}} 
            size='small'
        />
    )
}