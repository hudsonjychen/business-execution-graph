import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import '/src/styles/Interaction.css'

export default function Knowledge({ elementsProcess }) {
    const interactionRef = useRef(null);

    useEffect(() => {
    
        const cy = cytoscape(
        {
            container: interactionRef.current,

            elements: elementsProcess,
            
            style: [
                {
                    selector: 'node[category="process"]',
                    style: {
                        'width': 90,
                        'height': 90,
                        'background-color': '#444444',
                        'label': 'data(label)'
                    }
                },

                {
                    selector: 'node[category="object_type"]',
                    style: {
                        'width': 50,
                        'height': 50,
                        'background-color': '#666',
                        'label': 'data(label)'
                    }
                },

                {
                    selector: 'node[category="activity"]',
                    style: {
                        'width': 30,
                        'height': 30,
                        'background-color': '#999999',
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
                        'curve-style': 'unbundled-bezier'
                    }
                }
            ],
            
            layout: {
                name: 'circle',
            },
        });
    
    }, [elementsProcess]);

    return (
        <div className="interaction-container">
            <div 
                ref={interactionRef} 
                className="interaction"
            />
        </div>
    )
}