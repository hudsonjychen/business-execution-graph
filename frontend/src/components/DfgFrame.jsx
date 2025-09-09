import { Box, IconButton } from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import useStatusStore from "../store/useStatusStore";


export default function DfgFrame() {
    const setMode = useStatusStore(state => state.setMode);

    return (
        <Box sx={{
            position: 'fixed', 
            top: 66, 
            left: 10, 
            right: 10, 
            bottom: 94, 
            height: 'calc(100vh - 160px)', 
            zIndex: '10'
        }}>
            <IconButton 
                sx={{
                    position: 'relative',
                    top: 16,
                    left: 8,
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        transform: 'scale(1.05)',
                    },
                    '&:active': {
                        transform: 'scale(0.95)',
                    },
                }}
                onClick={() => setMode('discovery')}
            >
                <CloseRoundedIcon 
                    fontSize='medium'
                    sx={{ color: 'grey.900' }}
                />
            </IconButton>
        </Box>
    )
}