import CanvasDivider from "../CanvasDivider";
import { useGlobal } from "../GlobalContext";
import Prompt from "./Prompt";
import Interaction from "./Interaction";
import Knowledge from "./Knowledge";
import ProcessInfoChip from "./ProcessInfoChip";
import { Tooltip, Box } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { grey } from "@mui/material/colors";

export default function CanvasPage({ elements, nodeCard, knowledge, objects, objectTypeCounts, activityCounts }) {
    const { mode, fileImported } = useGlobal();

    return (
        <div>
            {!fileImported ? (
                <Prompt />
            ) : (
                mode === 'discovery' ? (
                    <div>
                        <CanvasDivider />
                        <Interaction 
                            elements={elements} 
                            nodeCard={nodeCard}
                        />
                        <ProcessInfoChip
                            elements={elements} 
                            knowledge={knowledge}
                            objects={objects}
                        />
                        <Box sx={{ position: 'absolute', top: 80, right: 80 }}>
                            <Tooltip title={'Click a node to view its information card'}>
                                <HelpOutlineIcon sx={{color: grey[600]}} />
                            </Tooltip>
                        </Box>
                        <CanvasDivider />
                    </div>
                ) : mode === 'knowledge' ? (
                    <div>
                        <CanvasDivider />
                        <Knowledge 
                            knowledge={knowledge}
                            objectTypeCounts={objectTypeCounts}
                            activityCounts={activityCounts}
                        />
                        <Box sx={{ position: 'absolute', top: 80, right: 80 }}>
                            <Tooltip title={'Click an object type node or activity node to view its count'}>
                                <HelpOutlineIcon sx={{color: grey[600]}} />
                            </Tooltip>
                        </Box>
                        <CanvasDivider />
                    </div>
                ) : null
            )}
        </div>
    )
}