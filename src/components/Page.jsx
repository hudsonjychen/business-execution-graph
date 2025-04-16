import { useState } from 'react'
import TimeSlider from './TimeSlider'
import ObjectFilterBox from './ObjectFilterBox'
import '/src/styles/App.css'
import '/src/styles/BottomToolBox.css'
import '/src/styles/TopToolBox.css'
import NetworkGraph from './Network_cy'
import ProcessSizeConfig from './ProcessSizeConfig'

export default function Page( {items, objects, nodeList, edgeList, range, marks} ) {
    
    const [itemName, setItem] = useState('Not specified');
    const [objectName, setObject] = useState(objects);

    return (

        <div>
          <div className = 'top-tool-container'>
            <div className = 'top-tool-item'>
              <ProcessSizeConfig
                items={items}
                itemName={itemName}
                setItem={setItem}/>
            </div>
            <div className = 'top-tool-item'>
              <ObjectFilterBox
                objects={objects}
                objectName={objectName}
                setObject={setObject}/>
            </div>
          </div>
    
          <div>
            <NetworkGraph
              nodeList={nodeList}
              edgeList={edgeList}
              itemName={itemName}
              objectName={objectName}
            />
          </div>
    
          <TimeSlider
            range={range}
            marks={marks}
          />
        </div>
    )
}