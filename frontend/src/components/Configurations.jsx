import { Box, Menu, MenuButton, IconButton, Typography, Divider, Tooltip, Stack, Button, Select, Option, Dropdown } from "@mui/joy";
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import useConfigStore from "../store/useConfigStore";

export default function Configurations() {
    const nodeSizeMetric = useConfigStore(state => state.nodeSizeMetric);
    const setNodeSizeMetric = useConfigStore(state => state.setNodeSizeMetric);
    const edgeNotationMetric = useConfigStore(state => state.edgeNotationMetric);
    const setEdgeNotationMetric = useConfigStore(state => state.setEdgeNotationMetric);
    const clearInteractionGraphConfig = useConfigStore(state => state.clearInteractionGraphConfig);

    const nodeSizeMetrics = ['none', 'objectCount', 'objectTypeCount'];
    const edgeNotationMetrics = ['none', 'objectType', 'totalObjectCount', 'averageFlowTime'];

    const Panel = () => (
        <Box sx={{ m: 2, width: 318 }}>
            <Typography level="h4" mb={1}>
                Graph Customization
            </Typography>
            <Typography level="body-sm" mb={2}>
                Customize settings for the interaction graph.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography level="title-md">
                    Node Size
                </Typography>
                <Select 
                    sx={{ width: '12rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='none'
                    value={nodeSizeMetric}
                    onChange={(e, newValue) => setNodeSizeMetric(newValue)}
                >
                    {nodeSizeMetrics.map(item => (
                        <Option key={item} value={item}>
                            {item}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Typography level="body-sm" mb={2}>
                Please select a metric to determine the node sizes.
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography level="title-md">
                    Edge Notation
                </Typography>
                <Select 
                    sx={{ width: '12rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='none'
                    value={edgeNotationMetric}
                    onChange={(e, newValue) => setEdgeNotationMetric(newValue)}
                >
                    {edgeNotationMetrics.map(item => (
                        <Option key={item} value={item}>
                            {item}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Typography level="body-sm" mb={5}>
                Please select a metric to assign edge annotations.
            </Typography>
            <Stack direction="row" alignItems="center">
                <Button level="solid" onClick={() => clearInteractionGraphConfig()}>
                    Reset
                </Button>
            </Stack>
        </Box>
    )

    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
            >
                <ArchitectureOutlinedIcon />
            </MenuButton>
            <Menu onClick={(e) => {e.stopPropagation();}}>
                <Panel />
            </Menu>
        </Dropdown>
    )
}