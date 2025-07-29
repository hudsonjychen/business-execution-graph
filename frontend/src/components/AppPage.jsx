import { useState } from 'react' 
import { GlobalProvider } from './GlobalContext';
import { FilterProvider } from './FilterContext';
import { SettingProvider } from './SettingContext';
import CanvasPage from './CanvasPage/CanvasPage';
import Top from './Top'

export default function AppPage(){
    const [elements, setElements] = useState([]);
    const [nodeCard, setNodeCard] = useState({});
    const [knowledge, setKnowledge] = useState([]);
    const [objectTypeCounts, setObjectTypeCounts] = useState({});
    const [activityCounts, setActivityCounts] = useState({});

    return(
        <div>
            <GlobalProvider>
                <FilterProvider>
                    <SettingProvider>
                        <Top 
                            setElements={setElements} 
                            setKnowledge={setKnowledge}
                            setNodeCard={setNodeCard}
                            setObjectTypeCounts={setObjectTypeCounts}
                            setActivityCounts={setActivityCounts}
                        />
                        <CanvasPage
                            elements={elements} 
                            nodeCard={nodeCard}
                            knowledge={knowledge}
                            objectTypeCounts={objectTypeCounts}
                            activityCounts={activityCounts}
                        />
                    </SettingProvider>
                </FilterProvider>
            </GlobalProvider>
        </div>
  )
}