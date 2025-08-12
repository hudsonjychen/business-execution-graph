import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { grey } from '@mui/material/colors';
import { useGlobal } from "../contexts/GlobalContext";
import { Box, IconButton } from "@mui/joy";
import CropFreeRoundedIcon from '@mui/icons-material/CropFreeRounded';
import useDataStore from "../store/useDataStore";
import useConfigStore from "../store/useConfigStore";
import useFilterStore from "../store/useFilterStore";
import ProcessCard from "./ProcessCard";
import { calculateNodeSize } from "../functions/configs";
import getElements from "../functions/getElements";
import { filterProcessData } from "../functions/filters";
import { getImportanceIndex, mapToLevel } from "../functions/color";


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


export default function Interaction({ elements, nodeCard }) {

    const [cyInstance, setCyInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef();

    const processData = useDataStore(state => state.processData);
    const interactionData = useDataStore(state => state.interactionData);
    const objectToType = useDataStore(state => state.objectToType);
    
    const colorScheme = useConfigStore(state => state.colorScheme);
    const selectedColor = useConfigStore(state => state.selectedColor);
    const nodeSizeMetric = useConfigStore(state => state.nodeSizeMetric);
    const edgeNotationMetric = useConfigStore(state => state.edgeNotationMetric);
    const edgeNotationStyle = useConfigStore(state => state.edgeNotationStyle);

    const selectedObjectTypes = useFilterStore(state => state.selectedObjectTypes);
    const selectedProcesses = useFilterStore(state => state.selectedProcesses);

    const { setPngDataUrl, setVosData } = useGlobal();
    
    const interactionRef = useRef(null);

    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800];

    const filteredProcessData = filterProcessData(selectedObjectTypes, selectedProcesses, processData);


    useEffect(() => {

        if (!processData || Object.keys(processData).length === 0) return;
        
        const { interactionElements, knowledgeElements } = getElements(interactionData, processData, selectedObjectTypes, selectedProcesses, objectToType);

        setVosData(interactionElements);

        const cy = cytoscape(
        {
            container: interactionRef.current,

            elements: interactionElements,
            
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

        setCyInstance(cy);

        return () => {
            cy.destroy();
        };

    }, [processData, elements, selectedProcesses, selectedObjectTypes]);
    
    useEffect(() => {
        if (!cyInstance) return;

        const { interactionElements, knowledgeElements } = getElements(interactionData, processData, selectedObjectTypes, selectedProcesses, objectToType);

        const importanceIndex = getImportanceIndex(interactionElements, colorScheme);
        
        if(importanceIndex){
            if(selectedColor){
                cyInstance.nodes().forEach(node => {
                    const level = mapToLevel(importanceIndex[node.data('id')], levels);
                    node.style('background-color', selectedColor[level]);
                });
                cyInstance.edges().forEach(edge => {
                    edge.style('line-color', selectedColor[200]);
                    edge.style('target-arrow-color', selectedColor[200],)
                });
            } else {
                cyInstance.nodes().forEach(node => {
                    const level = mapToLevel(importanceIndex[node.data('id')], levels);
                    node.style('background-color', grey[level]);
                });
                cyInstance.edges().forEach(edge => {
                    edge.style('line-color', grey[500]);
                    edge.style('target-arrow-color', grey[500],)
                });
            }
        } else {
            if(selectedColor){
                cyInstance.nodes().forEach(node => {
                    node.style('background-color', selectedColor[500]);
                });
                cyInstance.edges().forEach(edge => {
                    edge.style('line-color', selectedColor[200]);
                    edge.style('target-arrow-color', selectedColor[200],)
                });
            } else {
                cyInstance.nodes().forEach(node => {
                    node.style('background-color', grey[700]);
                });
                cyInstance.edges().forEach(edge => {
                    edge.style('line-color', grey[400]);
                    edge.style('target-arrow-color', grey[400],)
                });
            }
        }

        if(nodeSizeMetric != 'none'){
            const sizes = calculateNodeSize(interactionElements, nodeSizeMetric)

            cyInstance.nodes().forEach(node => {
                const nodeId = node.id();
                const size = sizes[nodeId];
              
                if (size !== undefined) {
                    node.style('width', size);
                    node.style('height', size);
                }
            });
        } else {
            cyInstance.nodes().forEach(node => {
                node.style('width', 60);
                node.style('height', 60);
            });
        }

        if(edgeNotationMetric != 'none'){
            cyInstance.edges().forEach(edge => {
                if (edgeNotationMetric) {
                    edge.style({
                        'label': edge.data(edgeNotationMetric),
                        'edge-text-rotation': edgeNotationStyle,
                        'text-wrap': 'wrap'
                    });
                } else {
                    edge.style('label', '');
                }
            });
        } else {
            cyInstance.edges().forEach(edge => {
                edge.style('label', '');
            });
        }

        const pngDataUrl = cyInstance.png({
            output: 'base64uri',
            full: true,
            scale: 2,
            bg: '#ffffff'
        });
        setPngDataUrl(pngDataUrl);
    }, [cyInstance, selectedColor, colorScheme, nodeSizeMetric, edgeNotationMetric, edgeNotationStyle])

    useEffect(() => {
        if (!cyInstance) return;

        const handleTap = (event) => {
            const node = event.target;

            if (node.isNode && node.isNode()) {
                const pos = node.renderedPosition();
                const id = node.data('id');
                const label = node.data('label');
                setSelectedNode({ id, label });
                setNodePosition(pos);
            }
        };

        const handleClickOutside = (e) => {
            if (cardRef.current && !cardRef.current.contains(e.target)) {
                setSelectedNode(null);
            }
        };

        cyInstance.on('tap', 'node', handleTap);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            cyInstance.removeListener('tap', 'node', handleTap);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cyInstance]);

    useEffect(() => {
        if (!cyInstance || !selectedNode) return;

        const node = cyInstance.$id(selectedNode.id);
        const updatePosition = () => {
            const pos = node.renderedPosition();
            setNodePosition(pos);
        };

        node.on('position', updatePosition);
        cyInstance.on('render', updatePosition);

        return () => {
            node.removeListener('position', updatePosition);
            cyInstance.removeListener('render', updatePosition);
        };
    }, [cyInstance, selectedNode]);

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
            <IconButton 
                sx={{
                    position: 'fixed',
                    top: 76,
                    right: 20
                }}
                onClick={() => cyInstance.fit(cyInstance.elements(), 20)}
            >
                <CropFreeRoundedIcon />
            </IconButton>
            {
                selectedNode && (
                    <ProcessCard 
                        cardRef={cardRef}
                        processLabel={selectedNode.label}
                        processInfo={filteredProcessData[selectedNode.label]}
                        position={nodePosition}
                        interactionRef={interactionRef}
                    />
                )
            }
        </Box>
    )
}