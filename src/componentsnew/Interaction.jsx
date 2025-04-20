import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import '/src/stylesnew/Interaction.css'
import NodeInfoCard from "./NodeInfoCard";

export default function Interaction({ elements, notationType, nodes }) {
    const interactionRef = useRef(null);
    const [infoCard, setInfoCard] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const selectedNodeRef = useRef(null);

    useEffect(() => {
        const cy = cytoscape(
        {
            container: interactionRef.current,

            elements: elements,
            /**
            [
                {data: { id: 'om', label: 'Order Management' }},
                {data: { id: 'dm', label: 'Delivery Management' }},
                {data: { id: 'rm', label: 'Return Management' }},
                {data: { id: 'om-dm', source: 'om', target: 'dm', label: '{Order, Item}' }},
                {data: { id: 'dm-om', source: 'dm', target: 'om', label: '{Order, Item}' }},
                {data: { id: 'om-rm', source: 'om', target: 'rm', label: '{Item}' }}
            ],
            */
            
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

        cy.on('tap', 'node', (event) => {
            const node = event.target;
            const data = node.data();
            const pos = node.renderedPosition();

            setSelectedNodeId(node.id());

            setInfoCard({
                label: data.label,
                desc: data.desc,
            });

            setCardPosition({
                top: pos.y + 50,
                left: pos.x + 120,
            });

            console.log(cardPosition.top);
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
        
            setInfoCard({
                label: node.data().label,
                desc: node.data().desc,
            });
        
            setCardPosition({
                top: pos.y + 50,
                left: pos.x + 120,
            });
        });

    }, [elements, notationType]);

    useEffect(() => {
        let animationFrameId;
    
        const updateCardPosition = () => {
            if (infoCard && selectedNodeRef.current) {
                const pos = selectedNodeRef.current.renderedPosition();
                setCardPosition({
                    top: pos.y + 50,
                    left: pos.x + 120,
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
            <div className="interaction-container">
                <div 
                    ref={interactionRef} 
                    className="interaction"
                />
            </div>
            {
                infoCard && (
                    <NodeInfoCard 
                        top={cardPosition.top} 
                        left={cardPosition.left}
                        selectedNodeId={selectedNodeId}
                        nodes={nodes}
                    />
                )
            }
        </div>
    )
}