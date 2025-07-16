import { FormControl, MenuItem, Select } from '@mui/material';
import { useSetting } from "../SettingContext";

export default function NodeSizeConfig() {
    const attributeTypes = ['objectCount', 'objectTypeCount'];

    const { attributeTypeChecked, setAttributeTypeChecked } = useSetting();

    const handleChange = (event) => {
        setAttributeTypeChecked(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small'>
                <Select
                    labelId='node-size-config-label'
                    id='node-size-config'
                    value={attributeTypeChecked}
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