import { useGlobal } from "./GlobalContext";
import Interaction from "./Interaction";
import Knowledge from "./Knowledge";

export default function CanvasPage({ elements, objectTypeChecked, nodes, notationType, elementsProcess }) {
    const { mode } = useGlobal();

    return (
        <div>
            {mode === 'discovery' ? (
                <Interaction 
                    elements={elements} 
                    objectTypeChecked={objectTypeChecked}
                    nodes={nodes}
                    notationType={notationType}
                />
            ) : mode === 'knowledge' ? (
                <Knowledge 
                    elementsProcess={elementsProcess}
                />
            ) : null}
        </div>
    )
}