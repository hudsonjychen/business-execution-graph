import { useState } from 'react' 
import { GlobalProvider } from '../contexts/GlobalContext';
import { SettingProvider } from '../contexts/SettingContext';
import CanvasPage from './CanvasPage';
import Top from './Top'

export default function AppPage(){
    const [elements, setElements] = useState([]);
    const [nodeCard, setNodeCard] = useState({});
    const [knowledge, setKnowledge] = useState([]);

    return(
        <div>
            <GlobalProvider>
                <SettingProvider>
                    <Top 
                        setElements={setElements} 
                        setKnowledge={setKnowledge}
                        setNodeCard={setNodeCard}
                    />
                    <CanvasPage
                        elements={elements} 
                        nodeCard={nodeCard}
                        knowledge={knowledge}
                    />
                </SettingProvider>
´            </GlobalProvider>
        </div>
  )
}