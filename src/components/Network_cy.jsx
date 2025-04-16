import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Button } from '@mui/material';

function hasCommonElement(objects, objectList) {
    return objects.some(obj => objectList.includes(obj));
}

/**
function calculateSize(nodes, nodeList, itemName) {
    if(itemName === 'not specified') {
      return
    } else {
      const nodeId = [];
      const values = {};
      let maxValue;
      let minValue;
  
      nodes.map((node) => {
        nodeId.push(node.id);
      });
  
      nodeList.forEach((node) => {
        if(nodeId.includes(node.id)){
          values[node.id] = node[itemName];
        }
      });
  
      const allValues = Object.values(values);
  
      maxValue = Math.max(...allValues);
      minValue = Math.min(...allValues);
  
      function calculation(maxValue, minValue, value) {
        return (20 + (value - minValue) / (maxValue - minValue) * 60)
      };
  
      nodes.forEach((node) => {
        if (values[node.id] !== undefined) {
          if (maxValue == minValue) {
            return
          } else {
            node.size = calculation(maxValue, minValue, values[node.id]);
          }
        }
      });
    }
  }
*/
  
export default function NetworkGraph( {nodeList, edgeList, itemName, objectName} ) {
    const networkRef = useRef(null);
    const canvasRef = useRef(null);

    const [elements, setElements] = useState(
        []
    );

    useEffect(() => {
        const nodes = nodeList.map((node) => ({
          data: { id: node.id, label: node.label }
        }));
    
        const edges = edgeList.map((edge) => ({
          data: { id: `${edge.source} ${edge.target}`, source: edge.source, target: edge.target }
        }));
    
        setElements([...nodes, ...edges]);
    
      }, [nodeList, edgeList]);
  
    useEffect(() => {
      
        const cy = cytoscape(
        {
            container: networkRef.current,
            elements,

            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#3498db',
                        'label': 'data(label)',
                        'color': 'blue',
                        'text-valign': 'center',
                        'font-size': '14px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': 'black',
                        'target-arrow-shape': 'triangle',
                        'target-arrow-color': 'black'
                    }
                }
            ],
        });

        cy.on('tap', 'node', function (evt) {
            const node = evt.target;
            alert( node.label() );
        });
  
        const container = networkRef.current;
        canvasRef.current = container.querySelector('canvas');

        return () => cy.destroy();
  
    }, [elements]);
  
    const exportCanvas = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const image = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'network-graph.jpg';
            link.click();
        }
    };
  
    return (
        <div style={{ width: '100%', height: '100%'}}>
            <div 
                ref={networkRef} 
                style={{ width: '1000px', height: '550px', border: '1px solid lightgray', backgroundColor: '#F5F5F5', margin: 'auto auto' }}>
            </div>
            <Button 
                variant='outlined' 
                onClick={exportCanvas}
                style={{ position: 'absolute', left: '30px', top: '30px' }}>
                Save
            </Button>
        </div>
    );
  }