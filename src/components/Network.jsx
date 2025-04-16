import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone/umd/vis-network.min';
import { Button } from '@mui/material';

function hasCommonElement(objects, objectList) {
  return objects.some(obj => objectList.includes(obj));
}

function calculateSize(nodes, nodeList, itemName) {
  if(itemName === 'Not specified') {
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

export default function NetworkGraph( {nodeList, edgeList, itemName, objectName} ) {
  const networkRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const nodes = [];
    const edges = [];

    nodeList.map((node) => {
      if (hasCommonElement(node.objects, objectName)) {
        nodes.push({
          id: node.id, 
          shape: 'dot', 
          label: node.label, 
          size: 50, 
          font: {size: 18, strokeWidth: 3, strokeColor: 'white'}, 
          multi: true, 
          title: node.label, 
          labelHighlightBold: true
        })
      } 
    })
  
    edgeList.map((edge) => (
      edges.push({
        from: edge.from, 
        to: edge.to,
        arrows: { to: { enabled: true, scaleFactor: 3 } },
        arrowStrikethrough: false,
        width: edge.width
        })
    ))

    calculateSize(nodes, nodeList, itemName)

    const options = {
      edges: {
        smooth: {
          enabled: false,
        }
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -40000,
          centralGravity: 0.6,
          springLength: 200,
          springConstant: 0.06
        },
      },
      layout: {
        improvedLayout: true,
        randomSeed: 89,
      },
      interaction: {
        dragNodes: false,
      }
    };

    const container = networkRef.current;
    const network = new Network(container, { nodes, edges }, options);

    canvasRef.current = container.querySelector('canvas');

  }, [objectName, itemName]);

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