import { useGlobal } from "../contexts/GlobalContext";
import Prompt from "../components/Prompt";
import Interaction from "../components/Interaction";
import Knowledge from "../components/Knowledge";
import Summary from "../components/Summary";
import FileInfo from "../components/FileInfo";
import useStatusStore from "../store/useStatusStore";
import { Box, Button, CircularProgress } from "@mui/joy";
import ErrorAlert from "../components/ErrorAlert";
import DFGFlow from "../components/DFGFlow";
import { useState } from "react";


export default function CanvasPage({ elements, nodeCard, knowledge }) {

    const [graphType, setGraphType] = useState('cy');

    const { fileImported } = useGlobal();
    const loadingStatus = useStatusStore(state => state.loadingStatus);
    const mode = useStatusStore(state => state.mode);

    return (
        <Box>
            <FileInfo />
            <Summary />

            {!fileImported ? (
                    <Prompt />
                ) : loadingStatus ? (
                loadingStatus === 'success' ? (
                    mode === 'discovery' ? (
                        <Interaction elements={elements} nodeCard={nodeCard} />
                    ) : mode === 'knowledge' ? (
                        <Knowledge knowledge={knowledge} />
                    ) : mode === 'expanded' ? (
                        <Box>
                            <Button
                                sx={{
                                    position: 'absolute',
                                    left: 765,
                                    top: 15,
                                    minWidth: 100
                                }}
                                onClick={()=>{
                                    const type = graphType === 'cy' ? 'flow' : 'cy';
                                    setGraphType(type);
                                }}
                            >
                                {graphType}
                            </Button>
                            {
                                graphType === 'cy' ? (
                                    null
                                ) : (
                                    <DFGFlow />
                                )
                            }
                        </Box>
                    ) : null
                ) : loadingStatus === 'failure' ? (
                    <ErrorAlert />
                ) : null
                ) : (
                    <CircularProgress />
                )
            }
        </Box>
    );
}