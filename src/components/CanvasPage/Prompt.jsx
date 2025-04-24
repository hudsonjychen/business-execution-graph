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
            <FileOpenOutlinedIcon sx={{ fontSize: 40, color: 'grey.500' }} />
            <Typography
                sx={{
                    fontSize: 38,
                    fontWeight: 300,
                    color: 'grey.500'
                }}
            >
                Start by importing event data
            </Typography>
        </Box>
    );
}