import { useGlobal } from "../GlobalContext";
import Interaction from "./Interaction";
import Knowledge from "./Knowledge";
import ProcessInfoChip from "./ProcessInfoChip";

export default function CanvasPage({ elements, nodeCard, notationType, knowledge, objects }) {
    const { mode, objectTypeChecked } = useGlobal();

    return (
        <div>
            {mode === 'discovery' ? (
                <div>
                    <Interaction 
                        elements={elements} 
                        objectTypeChecked={objectTypeChecked}
                        nodeCard={nodeCard}
                        notationType={notationType}
                    />
                    <ProcessInfoChip
                        elements={elements} 
                        knowledge={knowledge}
                        objects={objects}
                    />
                </div>
            ) : mode === 'knowledge' ? (
                <Knowledge 
                    knowledge={knowledge}
                />
            ) : null}
        </div>
    )
}