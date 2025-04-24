import CanvasDivider from "../CanvasDivider";
import { useGlobal } from "../GlobalContext";
import Prompt from "./Prompt";
import Interaction from "./Interaction";
import Knowledge from "./Knowledge";
import ProcessInfoChip from "./ProcessInfoChip";

export default function CanvasPage({ elements, nodeCard, notationTypeChecked, knowledge, objects }) {
    const { mode, fileImported, objectTypeChecked } = useGlobal();

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
                            objectTypeChecked={objectTypeChecked}
                            nodeCard={nodeCard}
                            notationTypeChecked={notationTypeChecked}
                        />
                        <ProcessInfoChip
                            elements={elements} 
                            knowledge={knowledge}
                            objects={objects}
                        />
                        <CanvasDivider />
                    </div>
                ) : mode === 'knowledge' ? (
                    <div>
                        <CanvasDivider />
                        <Knowledge 
                            knowledge={knowledge}
                        />
                        <CanvasDivider />
                    </div>
                ) : null
            )}
        </div>
    )
}