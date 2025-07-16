import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, Checkbox, ListItemText } from '@mui/material';
import { useGlobal } from "../GlobalContext";
import { useFilter } from "../FilterContext";

export default function ProcessFilter() {
    const { fileImported } = useGlobal();
    const { processes, processChecked, setProcessChecked } = useFilter();
    
    const handleChange = (check) => {
        if (check === 'all') {
            if (processChecked.includes('all')) {
                setProcessChecked([]);
            } else {
                setProcessChecked(processes);
            }
        } else {
            if (processChecked.includes(check)) {
                const checks = processChecked.filter((c) => c !== check);
                if (checks.includes('all')) {
                    checks.splice(checks.indexOf('all'), 1);
                }
                setProcessChecked(checks);
            } else {
                const checks = [...processChecked, check];
                if (checks.length === processes.length - 1) {
                    checks.unshift('all');
                }
                setProcessChecked(checks);
            }
        }
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small'>
                <InputLabel id='process-filter-label'>Process</InputLabel>
                <Select
                    labelId='process-filter-label'
                    id='process-filter'
                    multiple
                    value={processChecked}
                    input={<OutlinedInput label='Process' />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {processes.map((process) => (
                        <MenuItem key={process} value={process}>
                            <Checkbox 
                                checked={processChecked.includes(process)}
                                onChange={() => handleChange(process)}
                            />
                            <ListItemText primary={process} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}