import { Stack, Typography, Box, Dropdown, MenuButton, IconButton, Menu } from "@mui/joy";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import useDataStore from "../store/useDataStore";
import { useState } from "react";

export default function FileInfo() {
    const fileInfo = useDataStore(state => state.fileInfo)
    const [open, setOpen] = useState(false)
    return (
        <Dropdown
            open={open}
            onOpenChange={setOpen}
        >
            <MenuButton
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                sx={{ 
                    backgroundColor: 'white', 
                    borderRadius: 'lg', 
                    position: 'fixed',
                    width: 52,
                    height: 52, 
                    left: 42, 
                    bottom: 36, 
                    boxShadow: 'md', 
                    zIndex: 10 
                }}
            >
                <InfoOutlineIcon sx={{ width: 42, height: 42 }}/>
            </MenuButton>
            <Menu 
                placement="top-start"
            >
                <Box sx={{ width: 320, ml: 1.8, mr: 1.8, mt: 0.6, mb: 0.6 }}>
                    <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                        <Typography level="title-md">
                            File Information
                        </Typography>
                    </Stack>

                    <Stack direction='row' spacing={1} justifyContent='space-between'>
                        <Typography level="body-sm" color="neutral">
                            Filename
                        </Typography>
                        <Typography level="body-sm">
                            {'filename' in fileInfo ? fileInfo.filename : '-----'}
                        </Typography>
                    </Stack>

                    <Stack direction='row' spacing={1} justifyContent='space-between'>
                        <Typography level="body-sm" color="neutral">
                            Size
                        </Typography>
                        <Typography level="body-sm">
                            {'size' in fileInfo ? fileInfo.size + ' MB' : '-----'}
                        </Typography>
                    </Stack>

                    <Stack direction='row' spacing={1} justifyContent='space-between'>
                        <Typography level="body-sm" color="neutral">
                            Upload time
                        </Typography>
                        <Typography level="body-sm">
                            {'uploadtime' in fileInfo ? fileInfo.uploadtime : '-----'}
                        </Typography>
                    </Stack>
                </Box>
            </Menu>
        </Dropdown>
    )
}