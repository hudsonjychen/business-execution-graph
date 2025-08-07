import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import { Box, Typography } from '@mui/joy';

export default function Prompt() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'center',
                pb: 20
            }}
        >
            <FileOpenOutlinedIcon sx={{ fontSize: 46, color: 'grey.600' }} />
            <Typography level='h2' color='neutral'>
                Start by importing event data
            </Typography>
        </Box>
    );
}