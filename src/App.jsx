import Page from './components/Page'
import { useState, useEffect } from 'react' 
import ObjectTypeFilter from './componentsnew/ObjectTypeFilter';
import NodeSizeConfig from './componentsnew/NodeSizeConfig';
import ConfigPanel from './componentsnew/ConfigPanel';
import FilePanel from './componentsnew/FilePanel';
import Interaction from './componentsnew/Interaction';
import NodeInfoCard from './componentsnew/NodeInfoCard';
import Divider from './componentsnew/Divider';
import { Position } from 'reactflow';
import InteractionInfo from './componentsnew/InteractionInfo';
import TimeSlider from './components/TimeSlider';

const items = ['Object count', 'Execution time'];
const objects = ['All', 'Order', 'Payment'];
const notations = ['objectType', 'totalObjectCount', 'averageFlowTime'];

/**
const nodeList = [
  {id: 1, label: "Order to Cash", object_type: ['order', 'item'], object_count: 120, average_execution_time: 2},
  {id: 2, label: "Delivery to Goods Posting", objects: ['item', 'package'], object_count: 90, average_execution_time: 2},
  {id: 3, label: "Shipment to Signing for", objects: ['order','package', 'route'], object_count: 80, average_execution_time: 2},
  {id: 4, label: "Process 4", objects: ['order', 'route'], object_count: 500, average_execution_time: 2},
  {id: 5, label: "Process 5", objects: ['route'], object_count: 30, average_execution_time: 2},
];

const edgeList = [
  {source: 1, target: 2, object_type: ['item'], object_count: 50 },
  {source: 2, target: 3, object_type: ['package'], object_count: 30 },
  {source: 3, target: 2, object_type: ['package'], object_count: 20 },
  {source: 3, target: 4, object_type: ['order', 'route'], object_count: 15 },
  {source: 4, target: 3, object_type: ['order', 'route'], object_count: 10 },
  {source: 4, target: 5, object_type: ['route'], object_count: 5 },
]
*/

const range = 80;
const marks = [
  {value:10, label: '23-Q1'},
  {value:20, label: '23-Q2'},
  {value:30, label: '23-Q3'},
  {value:40, label: '23-Q4'},
  {value:50, label: '24-Q1'},
  {value:60, label: '24-Q2'},
  {value:70, label: '24-Q3'},
  {value:80, label: '24-Q4'},
];

export default function App(){

  /**
  const [nodeList, setNodeList] = useState([]);
  const [edgeList, setEdgeList] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then((response) => response.json())
      .then((data) => {
          setNodeList(data.node_list);
          setEdgeList(data.edge_list);
        })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  console.log(nodeList)
  console.log(edgeList)
  */

  const [elements, setElements] = useState([]);
  const [info, setInfo] = useState({});
  const [notationType, setNotationType] = useState('');
  const [nodes, setNodes] = useState({});

  return(
    <div>
      <ConfigPanel
          objectTypes={objects}
          attributeTypes={items}
          notationTypes={notations}
          notationType={notationType}
          setNotationType={setNotationType}
      />
      <FilePanel 
          setElements={setElements} 
          setInfo={setInfo} 
          setNodes={setNodes}
      />
      <Divider />
      <Interaction 
        elements={elements} 
        nodes={nodes}
        notationType={notationType}
      />
      <InteractionInfo info={info}/>
      <Divider />
    </div>
  )
}
