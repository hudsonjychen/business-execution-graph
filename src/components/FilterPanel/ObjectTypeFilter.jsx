import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, Checkbox, ListItemText } from '@mui/material';
import { useGlobal } from "../GlobalContext";
import { useFilter } from "../FilterContext";

export default function ObjectTypeFilter() {
    const { fileImported } = useGlobal();
    const { objectTypes, objectTypeChecked, setObjectTypeChecked } = useFilter();

    const handleChange = (check) => {
        if (check === 'all') {
            if (objectTypeChecked.includes('all')) {
                setObjectTypeChecked([]);
            } else {
                setObjectTypeChecked(objectTypes);
            }
        } else {
            if (objectTypeChecked.includes(check)) {
                const checks = objectTypeChecked.filter((c) => c !== check);
                if (checks.includes('all')) {
                    checks.splice(checks.indexOf('all'), 1);
                }
                setObjectTypeChecked(checks);
            } else {
                const checks = [...objectTypeChecked, check];
                if (checks.length === objectTypes.length - 1) {
                    checks.unshift('all');
                }
                setObjectTypeChecked(checks);
            }
        }
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small' disabled={!fileImported}>
                <InputLabel id='objet-type-filter-label'>Object Type</InputLabel>
                <Select
                    labelId='object-type-filter-label'
                    id='object-type-filter'
                    multiple
                    value={objectTypeChecked}
                    input={<OutlinedInput label='Object Type' />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {objectTypes.map((objectType) => (
                        <MenuItem key={objectType} value={objectType}>
                            <Checkbox 
                                checked={objectTypeChecked.includes(objectType)}
                                onChange={() => handleChange(objectType)}
                            />
                            <ListItemText primary={objectType} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}