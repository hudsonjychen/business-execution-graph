import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useGlobal } from "../GlobalContext";
import './ModeNavi.css'

export default function ModeNavi() {
    const { mode, setMode } = useGlobal();

    return (
        <div className='mode-navi'>
            <Box sx={{ width: 300, '& .MuiBottomNavigationAction-label': {
                                        fontSize: '14px',
                                        '&.Mui-selected': {
                                            fontSize: '16px',
                                        }} }}
            >
                <BottomNavigation
                    showLabels
                    value={mode}
                    onChange={(event, newValue) => {
                        setMode(newValue);
                    }}
                >
                    <BottomNavigationAction label="Discovery" value='discovery' />
                    <BottomNavigationAction label="Knowledge" value='knowledge'/>
                </BottomNavigation>
            </Box>
        </div>
    );
}