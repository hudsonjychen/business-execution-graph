import { useGlobal } from "../contexts/GlobalContext";
import Prompt from "../components/Prompt";
import Interaction from "../components/Interaction";
import Knowledge from "../components/Knowledge";
import Summary from "../components/Summary";
import FileInfo from "../components/FileInfo";
import useStatusStore from "../store/useStatusStore";
import { CircularProgress } from "@mui/joy";

export default function CanvasPage({ elements, nodeCard, knowledge }) {

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
                        />
                    </div>
                ) : null ) : (
                    <CircularProgress />
                )
            )}
        </div>
    )
}