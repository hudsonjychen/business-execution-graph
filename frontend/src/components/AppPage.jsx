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
                    <SystemPanel 
                        setElements={setElements} 
                        setKnowledge={setKnowledge}
                        setNodeCard={setNodeCard}
                        setObjects={setObjects}
                        setObjectTypeCounts={setObjectTypeCounts}
                        setActivityCounts={setActivityCounts}
                    />
                    <FilterPanel />
                    <SettingProvider>
                        <ColorPalette />
                        <SettingDrawer />
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