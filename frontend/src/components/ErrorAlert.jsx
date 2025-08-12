import { Box, Alert, IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { useGlobal } from "../contexts/GlobalContext";
import useStatusStore from "../store/useStatusStore";


export default function ErrorAlert() {
    const { setFileImported } = useGlobal();
    const setLoadingStatus = useStatusStore(state => state.setLoadingStatus);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pb: 20
            }}
        >
            <Alert
                variant="soft"
                color="neutral"
                startDecorator={<ErrorRoundedIcon />}
                endDecorator={
                    <IconButton 
                        variant="soft" 
                        size="sm" 
                        color="neutral"
                        onClick={() => {
                            setFileImported(null);
                            setLoadingStatus(null);
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                }
                sx={{
                    width: 420,
                    p: 2
                }}
            >
                <Typography level="body-md" sx={{ whiteSpace: 'pre-line'}} >
                    {'The file was not uploaded successfully.\nPlease check if the process-enriched OCEL comply with the standards.'}
                </Typography>
            </Alert>
        </Box>
    )
}