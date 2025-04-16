import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import '/src/stylesnew/Interaction.css'
import NodeInfoCard from "./NodeInfoCard";

export default function Interaction({ elements, notationType }) {
    const interactionRef = useRef(null);
    const [infoCard, setInfoCard] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

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

    }, [elements, notationType]);

    const handleClickOutside = () => {
        if (infoCard) {
            setInfoCard(null);
        }
    };
    
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
                    <NodeInfoCard  top={cardPosition.top} left={cardPosition.left}/>
                )
            }
        </div>
    )
}