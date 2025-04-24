import { useState } from 'react' 
import ConfigPanel from './ConfigPanel/ConfigPanel';
import FilePanel from './FilePanel/FilePanel';
import { GlobalProvider } from './GlobalContext';
import ModeNavi from './ModeNavi/ModeNavi';
import CanvasPage from './CanvasPage/CanvasPage';

const attributes = ['objectCount', 'objectTypeCount'];
const notations = ['objectType', 'totalObjectCount', 'averageFlowTime'];

export default function AppPage(){
    const [elements, setElements] = useState([]);
    const [notationTypeChecked, setNotationTypeChecked] = useState('');
    const [nodeCard, setNodeCard] = useState({});
    const [knowledge, setKnowledge] = useState([]);
    const [objects, setObjects] = useState([]);

    return(
        <div>
            <GlobalProvider>
                <ConfigPanel
                    attributeTypes={attributes}
                    notationTypes={notations}
                    notationTypeChecked={notationTypeChecked}
                    setNotationTypeChecked={setNotationTypeChecked}
                />
                <FilePanel 
                    setElements={setElements} 
                    setKnowledge={setKnowledge}
                    setNodeCard={setNodeCard}
                    setObjects={setObjects}
                />
                <ModeNavi />
                <CanvasPage
                    elements={elements} 
                    nodeCard={nodeCard}
                    notationTypeChecked={notationTypeChecked}
                    knowledge={knowledge}
                    objects={objects}
                />
            </GlobalProvider>
        </div>
  )
}