import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import './Canvas.css'

export default function Knowledge({ knowledge }) {
    const knowledgeRef = useRef(null);

    useEffect(() => {
    
        const cy = cytoscape(
        {
            container: knowledgeRef.current,

            elements: knowledge,
            
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
    
    }, [knowledge]);

    return (
        <div className="canvas-container">
            <div 
                ref={knowledgeRef} 
                className="canvas"
            />
        </div>
    )
}