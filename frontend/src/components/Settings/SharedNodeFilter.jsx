import { FormControl, MenuItem, Select } from '@mui/material';
import { useSetting } from "../SettingContext";

export function SharedNodeFilter() {
    const { sharedNodeShown, setSharedNodeShown } = useSetting();
    const nodeSharedStatus = ['both', 'shared', 'nonshared'];

    const handleChange = (event) => {
        setSharedNodeShown(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small'>
                <Select
                    labelId='shared-node-filter-label'
                    id='shared-node-filter'
                    value={sharedNodeShown}
                    onChange={handleChange}
                >   
                    {nodeSharedStatus.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}