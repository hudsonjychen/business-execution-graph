import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { grey } from '@mui/material/colors';
import NodeInfoCard from "./NodeInfoCard";
import { useGlobal } from "../../contexts/GlobalContext";
import { Box } from "@mui/joy";
import useConfigStore from "../../store/useConfigStore";
import useFilterStore from "../../store/useFilterStore";

export const objectTypeFilter = (elements, objectTypeChecked) => {
    return elements.filter(element => {
        const objectType = element.data.objectType;
        return objectTypeChecked.some(obj => objectType.includes(obj));
    });
};

export const processFilter = (elements, processChecked) => {
    const filteredNodes = [];

    const filteredElements = elements.filter(element => {
        if (element.data.label){
            const process = element.data.label;
            if (processChecked.includes(process)){
                filteredNodes.push(element.data.id);
                return true;
            }
        } else {
            return true;
        }
    });

    return filteredElements.filter(element => {
        if (!element.data.label){
            const source = element.data.source;
            const target = element.data.target;
            return filteredNodes.includes(source) && filteredNodes.includes(target);
        } else {
            return true;
        }
    });

};

const calculateNodeSize = (elements, attributeTypeChecked) => {
    if(attributeTypeChecked == ''){
        return
    }
    const values = {};
    const sizes = {};
    let maxValue;
    let minValue;

    elements.forEach(element => {
        if(element['data']['label']){
            values[element['data']['id']] = element['data'][attributeTypeChecked]
        }
    });

    const allValues = Object.values(values);

    maxValue = Math.max(...allValues);
    minValue = Math.min(...allValues);

    function calculate(maxValue, minValue, value) {
        return (40 + (value - minValue) / (maxValue - minValue) * 80)
    };

    elements.forEach(element => {
        sizes[element['data']['id']] = calculate(maxValue, minValue, values[element['data']['id']]);
    });

    return sizes;
};

const getImportanceIndex = (elements, type) => {
    const targetInstance = {};
    const importanceIndex = {};
    const targetList = [];

    const nodeList = elements
        .filter(element => element.data.label)
        .map(element => element.data.id);
    
    const edgeList = elements.filter(element => !element.data.label);
    if (type === 'incomingEdges'){
        targetList.push(...edgeList.map(element => element.data.target));
    } else if (type === 'outgoingEdges'){
        targetList.push(...edgeList.map(element => element.data.source));
    } else if (type === 'totalEdges'){
        targetList.push(...edgeList.flatMap(element => [element.data.target, element.data.source]));
    } else {
        return null;
    }

    targetList.forEach(target => {
        targetInstance[target] = (targetInstance[target] || 0) + 1;
    });

    const maxValue = Math.max(...Object.values(targetInstance));
    const minValue = Math.min(...Object.values(targetInstance));
    const range = maxValue - minValue;
    const a = 0.125;
    const b = 1;
    if(range){
        for (const key in targetInstance){
            const normalized = (targetInstance[key] - minValue) / range;
            importanceIndex[key] = a + normalized * (b - a);
        }
    } else{
        for (const key in targetInstance){
            importanceIndex[key] = 0.625;
        }
    }

    /**
    for (const key in targetInstance) {
        importanceIndex[key] = targetInstance[key] / targetList.length;
    }
    */

    nodeList.forEach(node => {
        if (!Object.keys(importanceIndex).includes(node)) {
            importanceIndex[node] = 0;
        }
    })
    return importanceIndex;
};

const mapToLevel = (value, levels) => {
    const target = value * 800;
    return levels.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
};

export default function Interaction({ elements, nodeCard }) {
    const colorScheme = useConfigStore(state => state.colorScheme);
    const selectedColor = useConfigStore(state => state.selectedColor);
    const nodeSizeMetric = useConfigStore(state => state.nodeSizeMetric);
    const edgeNotationMetric = useConfigStore(state => state.edgeNotationMetric);

    const selectedObjectTypes = useFilterStore(state => state.selectedObjectTypes);
    const selectedProcesses = useFilterStore(state => state.selectedProcesses);

    const { setPngDataUrl, setVosData } = useGlobal();
    
    const interactionRef = useRef(null);
    const [infoCard, setInfoCard] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const selectedNodeRef = useRef(null);

    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800];


    useEffect(() => {
        const filteredElements = processFilter(objectTypeFilter(elements, selectedObjectTypes), selectedProcesses);
        const importanceIndex = getImportanceIndex(filteredElements, colorScheme);
        setVosData(filteredElements);

        const cy = cytoscape(
        {
            container: interactionRef.current,

            elements: filteredElements,
            
            style: [
                {
                    selector: 'node',
                    style: {
                        'width': 60,
                        'height': 60,
                        'background-color': grey[700],
                        'label': 'data(label)'
                    }
                },
            
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': grey[400],
                        'target-arrow-color': grey[400],
                        'target-arrow-shape': 'triangle',
                        'arrow-scale': 2,
                        'curve-style': 'unbundled-bezier',
                        'control-point-weight': 0.5,
                    }
                }
            ],
            
            layout: {
                name: 'circle',
                nodeDimensionsIncludeLabels: false,
                spacingFactor: 0.8,
                startAngle: Math.PI,
            },
        });

        if(importanceIndex){
            if(selectedColor){
                cy.nodes().forEach(node => {
                    const level = mapToLevel(importanceIndex[node.data('id')], levels);
                    node.style('background-color', selectedColor[level]);
                });
                cy.edges().forEach(edge => {
                    edge.style('line-color', selectedColor[200]);
                    edge.style('target-arrow-color', selectedColor[200],)
                });
            } else {
                cy.nodes().forEach(node => {
                    const level = mapToLevel(importanceIndex[node.data('id')], levels);
                    node.style('background-color', grey[level]);
                });
                cy.edges().forEach(edge => {
                    edge.style('line-color', grey[500]);
                    edge.style('target-arrow-color', grey[500],)
                });
            }
        } else {
            if(selectedColor){
                cy.nodes().forEach(node => {
                    node.style('background-color', selectedColor[500]);
                });
                cy.edges().forEach(edge => {
                    edge.style('line-color', selectedColor[200]);
                    edge.style('target-arrow-color', selectedColor[200],)
                });
            }
        }

        if(nodeSizeMetric != ''){
            const sizes = calculateNodeSize(elements, nodeSizeMetric)

            cy.nodes().forEach(node => {
                const nodeId = node.id();
                const size = sizes[nodeId];
              
                if (size !== undefined) {
                    node.style('width', size);
                    node.style('height', size);
                }
            });
        };

        if(edgeNotationMetric != ''){
            cy.edges().forEach(edge => {
                if (edgeNotationMetric) {
                    edge.style('label', edge.data(edgeNotationMetric));
                } else {
                    edge.style('label', '');
                }
            });
        };

        cy.on('tap', (event) => {
            if (event.target === cy) {
                setInfoCard(null);
            }
        });

        cy.on('tap', 'node', (event) => {
            const node = event.target;
            selectedNodeRef.current = node;
        
            const pos = node.renderedPosition();

            setSelectedNodeId(node.id());
        
            setInfoCard(true);
        
            setCardPosition({
                top: pos.y + 20,
                left: pos.x + 80,
            });
        });

        const pngDataUrl = cy.png({
            output: 'base64uri',
            full: true,
            scale: 2,
            bg: '#ffffff'
        });
        setPngDataUrl(pngDataUrl);

        return () => {
            cy.destroy();
        };

    }, [elements, selectedColor, colorScheme, selectedProcesses, selectedObjectTypes, nodeSizeMetric, edgeNotationMetric]);

    useEffect(() => {
        let animationFrameId;
    
        const updateCardPosition = () => {
            if (infoCard && selectedNodeRef.current) {
                const pos = selectedNodeRef.current.renderedPosition();
                setCardPosition({
                    top: pos.y + 20,
                    left: pos.x + 80,
                });
                animationFrameId = requestAnimationFrame(updateCardPosition);
            }
        };
    
        if (infoCard) {
            animationFrameId = requestAnimationFrame(updateCardPosition);
        }
    
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [infoCard]);
    
    return (
        <Box 
            sx={{ 
                position: 'fixed', 
                top: 66, 
                left: 0, 
                right: 0, 
                bottom: 94, 
                width: '100vw', 
                height: 'calc(100vh - 160px)', 
                zIndex: '5' 
            }}
        >
            <Box 
                ref={interactionRef} 
                sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
            />
            {
                infoCard && (
                    <NodeInfoCard 
                        top={cardPosition.top} 
                        left={cardPosition.left}
                        selectedNodeId={selectedNodeId}
                        nodeCard={nodeCard}
                    />
                )
            }
        </Box>
    )
}