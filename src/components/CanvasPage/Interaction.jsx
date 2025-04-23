import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import './Canvas.css'
import NodeInfoCard from "./NodeInfoCard";

export const objectTypeFilter = (elements, objectTypeChecked) => {
    return elements.filter(element => {
        const objectType = element.data.objectType;
        return objectTypeChecked.some(obj => objectType.includes(obj));
    });
};

export default function Interaction({ elements, objectTypeChecked, notationType, nodeCard }) {
    const interactionRef = useRef(null);
    const [infoCard, setInfoCard] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const selectedNodeRef = useRef(null);

    useEffect(() => {
        const filteredElements = objectTypeFilter(elements, objectTypeChecked);

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
                        'background-color': '#666',
                        'label': 'data(label)'
                    }
                },
            
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'unbundled-bezier',
                        'label': notationType ? `data(${notationType})` : '',
                    }
                }
            ],
            
            layout: {
                name: 'circle'
            },
        });

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
                left: pos.x + 50,
            });
        });

    }, [elements, objectTypeChecked, notationType]);

    useEffect(() => {
        let animationFrameId;
    
        const updateCardPosition = () => {
            if (infoCard && selectedNodeRef.current) {
                const pos = selectedNodeRef.current.renderedPosition();
                setCardPosition({
                    top: pos.y + 20,
                    left: pos.x + 50,
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