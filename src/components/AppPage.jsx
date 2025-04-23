import { useState } from 'react' 
import ConfigPanel from './ConfigPanel/ConfigPanel';
import FilePanel from './FilePanel/FilePanel';
import Divider from './Divider';
import { GlobalProvider } from './GlobalContext';
import ModeNavi from './ModeNavi/ModeNavi';
import CanvasPage from './CanvasPage/CanvasPage';

const items = ['Object count', 'Execution time'];
const notations = ['objectType', 'totalObjectCount', 'averageFlowTime'];

export default function AppPage(){
    const [elements, setElements] = useState([]);
    const [infoChip, setInfoChip] = useState({});
    const [notationType, setNotationType] = useState('');
    const [nodeCard, setNodeCard] = useState({});
    const [knowledge, setKnowledge] = useState([]);
    const [objects, setObjects] = useState([]);

    return(
        <div>
            <GlobalProvider>
                <ConfigPanel
                    attributeTypes={items}
                    notationTypes={notations}
                    notationType={notationType}
                    setNotationType={setNotationType}
                />
                <FilePanel 
                    setElements={setElements} 
                    setKnowledge={setKnowledge}
                    setInfoChip={setInfoChip} 
                    setNodeCard={setNodeCard}
                    setObjects={setObjects}
                />
                <ModeNavi />
                <Divider />
                <CanvasPage
                    elements={elements} 
                    nodeCard={nodeCard}
                    notationType={notationType}
                    knowledge={knowledge}
                    objects={objects}
                />
                <Divider />
            </GlobalProvider>
        </div>
  )
}