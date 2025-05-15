import { FormControl, MenuItem, Select } from '@mui/material';
import { useSetting } from '../SettingContext';

export default function ColorSchemeSetting() {
    const { colorLevelType, setColorLevelType } = useSetting();
    const colorLevelTypes = ['disabled', 'incomingEdges', 'outgoingEdges', 'totalEdges'];

    const handleChange = (event) => {
        setColorLevelType(event.target.value);
    };
    
    return (
        <div>
            <FormControl sx={{ m: 1, width: 160}} size='small'>
                <Select
                    labelId='color-level-setting-label'
                    id='color-level-setting'
                    value={colorLevelType}
                    onChange={handleChange}
                >   
                    {colorLevelTypes.map((clt) => (
                        <MenuItem key={clt} value={clt}>
                            {clt}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}