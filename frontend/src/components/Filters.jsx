import { useFilter } from "./FilterContext";
import { Box, Stack, Select, Option, Checkbox } from '@mui/joy';

export default function Filters() {
    const { processes, processChecked, setProcessChecked, objectTypes, objectTypeChecked, setObjectTypeChecked } = useFilter();

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
                    value={objectTypeChecked}
                    sx={{ width: '14rem' }}
                    onChange={(e, newValue) => setObjectTypeChecked(newValue)}
                    
                >
                    {objectTypes.map((item) => (
                        <Option key={item} value={item}>
                            <Checkbox
                                checked={objectTypeChecked.includes(item)}
                                sx={{ pointerEvents: 'none', mr: 1 }}
                            />
                            {item}
                        </Option>
                    ))}
                </Select>
                <Select
                    multiple
                    placeholder={'Processes...'}
                    value={processChecked}
                    sx={{ width: '14rem' }}
                    onChange={(e, newValue) => setProcessChecked(newValue)}
                >
                    {processes.map((item) => (
                        <Option key={item} value={item}>
                            <Checkbox
                                checked={processChecked.includes(item)}
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