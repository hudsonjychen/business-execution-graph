import { useState } from "react";
import { useGlobal } from "../GlobalContext";
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import { Box, Drawer, IconButton, Divider, Stack } from "@mui/material";
import Typography from '@mui/material/Typography';
import EdgeNotationConfig from "./EdgeNotationConfig";
import NodeSizeConfig from "./NodeSizeConfig";
import "./SettingDrawer.css";
import { ObjectTypeFrequencyInput, ActivityFrequencyInput } from "./FrequencyInput";
import NodeSizeSlider from "./NodeSizeSlider";
import NodeTypeFilter from "./NodeTypeFilter";
import { SharedNodeFilter } from "./SharedNodeFilter";

export default function SettingDrawer() {
    const { mode, fileImported } = useGlobal();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const interactionSettings = (
        <Box sx={{width: 410, padding: 3}}>
            <Typography variant="h5" color="text.primary" mb={1}>
                Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
                Customize settings for the inter-process interaction graph.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Interactions Configurations
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Node Size
                </Typography>
                <NodeSizeConfig />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Edge Notation
                </Typography>
                <EdgeNotationConfig />
            </Stack>
        </Box>
    );

    const knowledgeSettings = (
        <Box sx={{width: 410, padding: 3}}>
            <Typography variant="h5" color="text.primary" mb={1}>
                Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
                Customize settings for the process knowledge graph.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Node Filter
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Node Type
                </Typography>
                <NodeTypeFilter />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Shared Status
                </Typography>
                <SharedNodeFilter />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Object Instance Frequency
                </Typography>
                <ObjectTypeFrequencyInput />
            </Stack>
            <Typography sx={{ fontSize: '0.8rem' }} color='text.secondary'>
                Enter a frequency threshold. Object types with a frequency lower than this value will be filtered out.
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Activity Instance Frequency
                </Typography>
                <ActivityFrequencyInput />
            </Stack>
            <Typography sx={{ fontSize: '0.8rem' }} color='text.secondary'>
                Enter a frequency threshold. Activities with a frequency lower than this value will be filtered out.
            </Typography>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Styles
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Process Node Size
                </Typography>
                <NodeSizeSlider nodeType={'process'} />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Object Type Node Size
                </Typography>
                <NodeSizeSlider nodeType={'object_type'} />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                    Activity Node Size
                </Typography>
                <NodeSizeSlider nodeType={'activity'} />
            </Stack>
        </Box>
    );

    const settingsContent = mode === 'discovery' ? interactionSettings : knowledgeSettings;

    return (
        <div>
            <div className="setting-button">
                <IconButton 
                    aria-label='Settings' 
                    onClick={toggleDrawer(true)} 
                    disabled={!fileImported}
                >
                    <HandymanOutlinedIcon fontSize="medium" />
                </IconButton>
            </div>
            <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
                {settingsContent}
            </Drawer>
        </div>
    );
}