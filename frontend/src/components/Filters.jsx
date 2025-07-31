import { Box, Stack, Select, Option, Checkbox } from '@mui/joy';
import useDataStore from "../store/useDataStore";
import useFilterStore from "../store/useFilterStore";
import getEntityList from '../functions/entityList';

export default function Filters() {
    const processData = useDataStore(state => state.processData);
    const selectedObjectTypes = useFilterStore(state => state.selectedObjectTypes);
    const selectedProcesses = useFilterStore(state => state.selectedProcesses);
    const setSelectedObjectTypes = useFilterStore(state => state.setSelectedObjectTypes);
    const setSelectedProcesses = useFilterStore(state => state.setSelectedProcesses);

    let processOptions = [], objectTypeOptions = [];

    if (Object.keys(processData).length > 0) {
        const { objectTypeList, activityList, processList } = getEntityList(processData);
        processOptions = processList;
        objectTypeOptions = objectTypeList;
    }

    return (
        <Box sx={{ m: 2, width: '28rem' }}>
            <Stack 
                direction='row' 
                justifyContent='space-between' 
                alignItems='center'
                spacing={2} 
                sx={{ pt: 1, pb: 1 }}
            >
                <Select
                    multiple
                    placeholder={'Object Types...'}
                    value={selectedObjectTypes}
                    sx={{ width: '14rem' }}
                    onChange={(e, newValue) => setSelectedObjectTypes(newValue)}
                    
                >
                    {objectTypeOptions.map((item) => (
                        <Option key={item} value={item}>
                            <Checkbox
                                checked={selectedObjectTypes.includes(item)}
                                sx={{ pointerEvents: 'none', mr: 1 }}
                            />
                            {item}
                        </Option>
                    ))}
                </Select>
                <Select
                    multiple
                    placeholder={'Processes...'}
                    value={selectedProcesses}
                    sx={{ width: '14rem' }}
                    onChange={(e, newValue) => setSelectedProcesses(newValue)}
                >
                    {processOptions.map((item) => (
                        <Option key={item} value={item}>
                            <Checkbox
                                checked={selectedProcesses.includes(item)}
                                sx={{ pointerEvents: 'none', mr: 1 }}
                            />
                            {item}
                        </Option>
                    ))}
                </Select>
            </Stack>
        </Box>
    )
}