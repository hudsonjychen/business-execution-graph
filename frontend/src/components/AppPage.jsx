import { useState } from 'react' 
import FilterPanel from './FilterPanel/FilterPanel';
import SystemPanel from './SystemPanel/SystemPanel';
import { GlobalProvider } from './GlobalContext';
import { FilterProvider } from './FilterContext';
import { SettingProvider } from './SettingContext';
import ModeNavi from './ModeNavi/ModeNavi';
import CanvasPage from './CanvasPage/CanvasPage';
import SettingDrawer from './Settings/SettingDrawer';
import ColorPalette from './Settings/ColorPalette';

import Top from './Top'

export default function AppPage(){
    const [elements, setElements] = useState([]);
    const [nodeCard, setNodeCard] = useState({});
    const [knowledge, setKnowledge] = useState([]);
    const [objects, setObjects] = useState([]);
    const [objectTypeCounts, setObjectTypeCounts] = useState({});
    const [activityCounts, setActivityCounts] = useState({});

    return(
        <div>
            <GlobalProvider>
                <ModeNavi />
                <FilterProvider>
                    <SettingProvider>
                        <Top 
                            setElements={setElements} 
                            setKnowledge={setKnowledge}
                            setNodeCard={setNodeCard}
                            setObjects={setObjects}
                            setObjectTypeCounts={setObjectTypeCounts}
                            setActivityCounts={setActivityCounts}
                        />
                        <CanvasPage
                            elements={elements} 
                            nodeCard={nodeCard}
                            knowledge={knowledge}
                            objects={objects}
                            objectTypeCounts={objectTypeCounts}
                            activityCounts={activityCounts}
                        />
                    </SettingProvider>
                </FilterProvider>
            </GlobalProvider>
        </div>
  )
}