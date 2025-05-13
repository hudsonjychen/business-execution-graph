import { FormControl, MenuItem, Select } from '@mui/material';
import { useSetting } from "../SettingContext";

export default function EdgeNotationConfig() {
    const notationTypes = ['objectType', 'totalObjectCount', 'averageFlowTime'];
    const { notationTypeChecked, setNotationTypeChecked } = useSetting();

    const handleChange = (event) => {
        setNotationTypeChecked(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small'>
                <Select
                    labelId='edge-notation-config-label'
                    id='edge-notation-config'
                    value={notationTypeChecked}
                    onChange={handleChange}
                >   
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {notationTypes.map((notationType) => (
                        <MenuItem key={notationType} value={notationType}>
                            {notationType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}