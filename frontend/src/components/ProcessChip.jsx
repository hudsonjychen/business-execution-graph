import { Box, Chip, ChipDelete, Typography } from '@mui/joy'

export default function ProcessChip({ processLabel}) {
    return (
        <Box sx={{ position: 'fixed', left: 116, bottom: 39 }}>
            <Chip 
                color='success' 
                endDecorator={<ChipDelete sx={{ ml: 2 }}/>} 
                sx={{ py: 1, px: 3 }}
            >
                <Typography fontSize={20} color='success'>
                    {processLabel}
                </Typography>
            </Chip>
        </Box>
    )
}