import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import { Box, Typography } from '@mui/material'

export default function Prompt() {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'center',
                mt: -8,
            }}
        >
            <FileOpenOutlinedIcon sx={{ fontSize: 36, color: 'grey.400' }} />
            <Typography
                sx={{
                    fontSize: 32,
                    color: 'grey.400'
                }}
            >
                Start by importing event data
            </Typography>
        </Box>
    );
}