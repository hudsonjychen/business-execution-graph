import { FormControl, MenuItem, Select } from '@mui/material';
import { useSetting } from "../SettingContext";

export default function NodeTypeFilter() {
    const { nodeTypeShown, setNodeTypeShown } = useSetting();
    const nodeTypes = ['both', 'objectType', 'activity'];

    const handleChange = (event) => {
        setNodeTypeShown(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 200}} size='small'>
                <Select
                    labelId='node-type-filter-label'
                    id='node-type-filter'
                    value={nodeTypeShown}
                    onChange={handleChange}
                >   
                    {nodeTypes.map((nodeType) => (
                        <MenuItem key={nodeType} value={nodeType}>
                            {nodeType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}