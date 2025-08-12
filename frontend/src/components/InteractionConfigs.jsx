import { Box, Menu, MenuButton, IconButton, Typography, Divider, Stack, Button, Select, Option, Dropdown } from "@mui/joy";
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import useConfigStore from "../store/useConfigStore";

export default function InteractionConfigs() {
    const nodeSizeMetric = useConfigStore(state => state.nodeSizeMetric);
    const setNodeSizeMetric = useConfigStore(state => state.setNodeSizeMetric);
    const edgeNotationMetric = useConfigStore(state => state.edgeNotationMetric);
    const setEdgeNotationMetric = useConfigStore(state => state.setEdgeNotationMetric);
    const edgeNotationStyle = useConfigStore(state => state.edgeNotationStyle);
    const setEdgeNotationStyle = useConfigStore(state => state.setEdgeNotationStyle);
    const clearInteractionGraphConfig = useConfigStore(state => state.clearInteractionGraphConfig);

    const nodeSizeMetrics = ['none', 'objectCount', 'objectTypeCount'];
    const nodeSizeMetricLabels = ['None', 'Total Object Count', 'Object Type Diversity'];
    const edgeNotationMetrics = ['none', 'objectType', 'objectCount', 'flowTime', 'totalObjectCount', 'averageFlowTime'];
    const edgeNotationMetricLabels = ['None', 'Object Types', 'Object Count by Type', 'Flow Time by Type', 'Total Object Count', 'Average Flow Time'];
    const edgeNotationStyles = ['none', 'autorotate'];
    const edgeNotationStyleLabels = ['Horizontal', 'Auto Rotate'];

    const Panel = () => (
        <Box sx={{ m: 2, width: 328 }}>
            <Typography level="h4" mb={1}>
                Graph Configurations
            </Typography>
            <Typography level="body-sm" mb={2}>
                Configure for the interaction graph.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography level="title-lg" mb={1}>
                Node Size
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
                <Typography level="title-md">
                    Metric
                </Typography>
                <Select 
                    sx={{ width: '12rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='none'
                    value={nodeSizeMetric}
                    onChange={(e, newValue) => setNodeSizeMetric(newValue)}
                >
                    {nodeSizeMetrics.map((item, index) => (
                        <Option key={item} value={item}>
                            {nodeSizeMetricLabels[index]}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Typography level="body-sm" mb={3}>
                Select a metric to determine the node sizes.
            </Typography>
            <Typography level="title-lg" mb={1}>
                Edge Annotation
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
                <Typography level="title-md">
                    Metric
                </Typography>
                <Select 
                    sx={{ width: '12rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='none'
                    value={edgeNotationMetric}
                    onChange={(e, newValue) => setEdgeNotationMetric(newValue)}
                >
                    {edgeNotationMetrics.map((item, index) => (
                        <Option key={item} value={item}>
                            {edgeNotationMetricLabels[index]}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Typography level="body-sm" mb={1}>
                Select a metric to assign edge annotations.
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography level="title-md">
                    Style
                </Typography>
                <Select 
                    disabled={edgeNotationMetric === 'none'}
                    sx={{ width: '12rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='none'
                    value={edgeNotationStyle}
                    onChange={(e, newValue) => setEdgeNotationStyle(newValue)}
                >
                    {edgeNotationStyles.map((item, index) => (
                        <Option key={item} value={item}>
                            {edgeNotationStyleLabels[index]}
                        </Option>
                    ))}
                </Select>
            </Stack>
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