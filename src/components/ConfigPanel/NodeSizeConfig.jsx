import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useState } from 'react';
import { useGlobal } from "../GlobalContext";

export default function NodeSizeConfig( {attributeTypes} ) {
    const [attributeType, setAttributeType] = useState('');
    const { mode } = useGlobal();

    const handleChange = (event) => {
        setAttributeType(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small' disabled={mode === 'knowledge'}>
                <InputLabel id='node-size-config-label'>Node Size</InputLabel>
                <Select
                    labelId='node-size-config-label'
                    id='node-size-config'
                    value={attributeType}
                    input={<OutlinedInput label='Attribute Type' />}
                    onChange={handleChange}
                >   
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {attributeTypes.map((attributeType) => (
                        <MenuItem key={attributeType} value={attributeType}>
                            {attributeType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}