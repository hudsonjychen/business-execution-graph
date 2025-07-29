import { useGlobal } from "../GlobalContext";
import Prompt from "./Prompt";
import Interaction from "./Interaction";
import Knowledge from "./Knowledge";
import { Tooltip, Box } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { grey } from "@mui/material/colors";
import Summary from "../Summary";
import FileInfo from "../FileInfo";
import useStatusStore from "../../store/useStatusStore";
import { CircularProgress } from "@mui/joy";

export default function CanvasPage({ elements, nodeCard, knowledge, objectTypeCounts, activityCounts }) {

    const { mode, fileImported } = useGlobal();
    const loadingStatus = useStatusStore(state => state.loadingStatus);

    return (
        <div>
            <FileInfo />
            <Summary />
            {!fileImported ? (
                <Prompt />
            ) : (loadingStatus ? (
                mode === 'discovery' ? (
                    <div>
                        <Interaction 
                            elements={elements} 
                            nodeCard={nodeCard}
                        />
                    </div>
                ) : mode === 'knowledge' ? (
                    <div>
                        <Knowledge 
                            knowledge={knowledge}
                            objectTypeCounts={objectTypeCounts}
                            activityCounts={activityCounts}
                        />
                    </div>
                ) : null ) : (
                    <CircularProgress />
                )
            )}
        </div>
    )
}