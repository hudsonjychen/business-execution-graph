import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, grey } from '@mui/material/colors';
import './Canvas.css'
import NodeInfoCard from "./NodeInfoCard";
import { useGlobal } from "../GlobalContext";
import { useFilter } from "../FilterContext";
import { useSetting } from "../SettingContext";

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
    
        const filteredList = elements.filter(element => !element.data.label);
    if (type === 'incomingEdges'){
        targetList.push(...filteredList.map(element => element.data.target));
    } else if (type === 'outgoingEdges'){
        targetList.push(...filteredList.map(element => element.data.source));
    } else if (type === 'totalEdges'){
        targetList.push(...filteredList.flatMap(element => [element.data.target, element.data.source]));
    } else {
        return null;
    }

    targetList.forEach(target => {
        targetInstance[target] = (targetInstance[target] || 0) + 1;
    });

    for (const key in targetInstance) {
        importanceIndex[key] = targetInstance[key] != 0 ? targetInstance[key] / targetList.length : 0;
    }

    nodeList.forEach(node => {
        if (!Object.keys(importanceIndex).includes(node)) {
            importanceIndex[node] = 0;
        }
    })
    return importanceIndex;
};

const mapToLevel = (value, levels) => {
    const target = value * 900;
    return levels.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
};

export default function Interaction({ elements, nodeCard }) {
    const { setPngDataUrl, setVosData } = useGlobal();
    const { objectTypeChecked, processChecked } = useFilter();
    const { attributeTypeChecked, notationTypeChecked, selectedColor, colorLevelType } = useSetting();
    
    const interactionRef = useRef(null);
    const [infoCard, setInfoCard] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const selectedNodeRef = useRef(null);

    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];


    useEffect(() => {
        const filteredElements = processFilter(objectTypeFilter(elements, objectTypeChecked), processChecked);
        const importanceIndex = getImportanceIndex(filteredElements, colorLevelType);
        console.log(importanceIndex);
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

        if(attributeTypeChecked != ''){
            const sizes = calculateNodeSize(elements, attributeTypeChecked)

            cy.nodes().forEach(node => {
                const nodeId = node.id();
                const size = sizes[nodeId];
              
                if (size !== undefined) {
                    node.style('width', size);
                    node.style('height', size);
                }
            });
        };

        if(notationTypeChecked != ''){
            cy.edges().forEach(edge => {
                if (notationTypeChecked) {
                    edge.style('label', edge.data(notationTypeChecked));
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

    }, [elements, selectedColor, colorLevelType, processChecked, objectTypeChecked, attributeTypeChecked, notationTypeChecked]);

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
        <div>
            <div className="canvas-container">
                <div 
                    ref={interactionRef} 
                    className="canvas"
                />
            </div>
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
        </div>
    )
}