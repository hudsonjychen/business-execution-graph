import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useGlobal } from "../GlobalContext";

export default function EdgeNotationConfig( {notationTypes, notationTypeChecked, setNotationTypeChecked } ) {
    const { mode, fileImported } = useGlobal();

    const handleChange = (event) => {
        setNotationTypeChecked(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small' disabled={mode === 'knowledge' | !fileImported}>
                <InputLabel id='edge-notation-config-label'>Edge Notation</InputLabel>
                <Select
                    labelId='edge-notation-config-label'
                    id='edge-notation-config'
                    value={notationTypeChecked}
                    input={<OutlinedInput label='Notation Type' />}
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