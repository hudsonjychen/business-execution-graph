import { useGlobal } from "../contexts/GlobalContext";
import Prompt from "../components/Prompt";
import Interaction from "../components/Interaction";
import Knowledge from "../components/Knowledge";
import Summary from "../components/Summary";
import FileInfo from "../components/FileInfo";
import useStatusStore from "../store/useStatusStore";
import { Box, CircularProgress } from "@mui/joy";
import ErrorAlert from "../components/ErrorAlert";

export default function CanvasPage({ elements, nodeCard, knowledge }) {

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