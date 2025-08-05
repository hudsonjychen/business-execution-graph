import { Box, Chip, ChipDelete, Typography } from '@mui/joy';
import useSelectorStore from "../store/useSelectorStore";

export default function ProcessChip({ processLabel}) {
    const cancelFocusingNode = useSelectorStore(state => state.cancelFocusingNode);

    return (
        <Box sx={{ position: 'fixed', left: 116, bottom: 42 }}>
            <Chip 
                variant='soft'
                color='success' 
                endDecorator={<ChipDelete sx={{ ml: 2 }} onDelete={() => cancelFocusingNode()}/>} 
                sx={{ py: 1, px: 2 }}
            >
                <Typography level='h4' fontSize={16} color='success'>
                    {processLabel}
                </Typography>
            </Chip>
        </Box>
    )
}