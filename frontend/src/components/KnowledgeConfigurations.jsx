import { Box, Menu, MenuButton, IconButton, Typography, Divider, Stack, Button, Select, Option, Dropdown } from "@mui/joy";
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import useConfigStore from "../store/useConfigStore";

export default function KnowledgeConfigurations() {
    const showingNodeType = useConfigStore(state => state.showingNodeType);
    const setShowingNodeType = useConfigStore(state => state.setShowingNodeType);
    const nodeSharing = useConfigStore(state => state.nodeSharing);
    const setNodeSharing = useConfigStore(state => state.setNodeSharing);
    const clearKnowledgeGraphConfig = useConfigStore(state => state.clearKnowledgeGraphConfig);

    const showingNodeTypes = ['both', 'objectType', 'activity'];
    const showingNodeTypeLabels = ['Both', 'Object Type', 'Activity'];
    const nodeSharingStatus = ['both', 'shared', 'nonshared'];
    const nodeSharingStatusLabels = ['Both', 'Shared', 'Non-shared'];

    const Panel = () => (
        <Box sx={{ m: 2, width: 328 }}>
            <Typography level="h4" mb={1}>
                Graph Configurations
            </Typography>
            <Typography level="body-sm" mb={2}>
                Configure the knowledge graph.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography level="title-md">
                    Showing Node Types
                </Typography>
                <Select 
                    sx={{ width: '10rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='both'
                    value={showingNodeType}
                    onChange={(e, newValue) => setShowingNodeType(newValue)}
                >
                    {showingNodeTypes.map((item, index) => (
                        <Option key={item} value={item}>
                            {showingNodeTypeLabels[index]}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Typography level="body-sm" mb={2}>
                Configure which node types are displayed on the graph.
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography level="title-md">
                    Node Share Status
                </Typography>
                <Select 
                    sx={{ width: '10rem' }} 
                    slotProps={{ listbox: { disablePortal: true }}}
                    defaultValue='both'
                    value={nodeSharing}
                    onChange={(e, newValue) => setNodeSharing(newValue)}
                >
                    {nodeSharingStatus.map((item, index) => (
                        <Option key={item} value={item}>
                            {nodeSharingStatusLabels[index]}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Typography level="body-sm" mb={5}>
                Configure whether to display only shared nodes, only non-shared nodes, or all nodes on the graph. 
            </Typography>
            <Stack direction="row" alignItems="center">
                <Button level="solid" onClick={() => clearKnowledgeGraphConfig()}>
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