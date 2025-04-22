import { useState } from 'react' 
import ConfigPanel from './ConfigPanel';
import FilePanel from './FilePanel';
import Interaction from './Interaction';
import Divider from './Divider';
import InteractionInfo from './InteractionInfo';
import Knowledge from './Knowledge';
import { GlobalProvider } from './GlobalContext';
import ModeNavi from './ModeNavi';
import CanvasPage from './CanvasPage';

const items = ['Object count', 'Execution time'];
const objects = ['all', 'order', 'shipment'];
const notations = ['objectType', 'totalObjectCount', 'averageFlowTime'];

export default function AppPage(){
    const [elements, setElements] = useState([]);
    const [info, setInfo] = useState({});
    const [objectTypeChecked, setObjectTypeChecked] = useState(objects);
    const [notationType, setNotationType] = useState('');
    const [nodes, setNodes] = useState({});
    const [elementsProcess, setElementsProcess] = useState([]);

    return(
        <div>
            <GlobalProvider>
                <ConfigPanel
                    objectTypes={objects}
                    attributeTypes={items}
                    notationTypes={notations}
                    notationType={notationType}
                    setNotationType={setNotationType}
                    objectTypeChecked={objectTypeChecked}
                    setObjectTypeChecked={setObjectTypeChecked}
                />
                <FilePanel 
                    setElements={setElements} 
                    setElementsProcess={setElementsProcess}
                    setInfo={setInfo} 
                    setNodes={setNodes}
                />
                <ModeNavi />
                <Divider />
                <CanvasPage
                    elements={elements} 
                    objectTypeChecked={objectTypeChecked}
                    nodes={nodes}
                    notationType={notationType}
                    elementsProcess={elementsProcess}
                />
                <InteractionInfo info={info}/>
                <Divider />
            </GlobalProvider>
        </div>
  )
}