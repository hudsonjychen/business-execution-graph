import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import { useGlobal } from "../GlobalContext";
import { useFilter } from "../FilterContext";
import { useSetting } from "../SettingContext";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/joy";

export const objectTypeFilter = (knowledge, objectTypeChecked) => {
    const filteredNodes = [];

    const filteredKnowledge =  knowledge.filter(knl => {
        if (knl.data.category === 'object_type'){
            if (objectTypeChecked.includes(knl.data.label)){
                filteredNodes.push(knl.data.id);
                return true;
            } else {
                return false;
            }
        }
        if (knl.data.category) {
            filteredNodes.push(knl.data.id);
            return true;
        } else {
            return true;
        }
    });

    return filteredKnowledge.filter(fknl => {
        if (!fknl.data.category){
            const source = fknl.data.source;
            const target = fknl.data.target;
            return filteredNodes.includes(source) && filteredNodes.includes(target);
        } else {
            return true;
        }
    });
};

export const processFilter = (knowledge, processChecked) => {
    const filteredNodes = [];
    const targets = [];

    let filteredKnowledge = knowledge.filter(knl => {
        if (knl.data.category === 'process'){
            if (processChecked.includes(knl.data.label)){
                filteredNodes.push(knl.data.id);
                return true;
            } else {
                return false;
            }
        }
        if (knl.data.category) {
            filteredNodes.push(knl.data.id);
            return true;
        } else {
            return true;
        }
    });

    filteredKnowledge = filteredKnowledge.filter(fknl => {
        if (!fknl.data.category){
            const source = fknl.data.source;
            const target = fknl.data.target;
            if (filteredNodes.includes(source)){
                targets.push(target);
                return true;
            }
        } else {
            return true;
        }
    });

    return filteredKnowledge.filter(fknl => {
        if (fknl.data.category === 'object_type' || fknl.data.category === 'activity'){
            return targets.includes(fknl.data.id);
        } else {
            return true;
        }
    })
};

export const frequencyFilter = (knowledge, objectTypeFrequency, activityFrequency, objectTypeCounts, activityCounts) => {
    const otCounts = {};
    const actCounts = {};
    const filteredNodes = [];
    const sourceNodes = [];

    knowledge.forEach(knl => {
        if(knl.data.category === 'process'){
            filteredNodes.push(knl.data.id);
            const otCount = objectTypeCounts[knl.data.label]
            const actCount = activityCounts[knl.data.label]
            for (const [ot, count] of Object.entries(otCount)) {
                otCounts[ot] = (otCounts[ot] || 0) + count
            }
            for (const [act, count] of Object.entries(actCount)) {
                actCounts[act] = (actCounts[act] || 0) + count
            }
        }
    })

    let filteredKnowledge = knowledge.filter(knl => {
        if(knl.data.category === 'object_type'){
            if (!objectTypeFrequency || otCounts[knl.data.label] >= objectTypeFrequency){
                filteredNodes.push(knl.data.id);
                return true;
            } else {
                return false;
            }
        }
        if(knl.data.category === 'activity'){
            if (!activityFrequency || actCounts[knl.data.label] >= activityFrequency){
                filteredNodes.push(knl.data.id);
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    })

    filteredKnowledge = filteredKnowledge.filter(fknl => {
        if (!fknl.data.category){
            const source = fknl.data.source;
            const target = fknl.data.target;
            if (filteredNodes.includes(source) && filteredNodes.includes(target)) {
                sourceNodes.push(source);
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    });

    return filteredKnowledge.filter(fknl => {
        if (fknl.data.category === 'process'){
            return sourceNodes.includes(fknl.data.id);
        } else {
            return true;
        }
    });
}

export const nodeTypeFilter = (knowledge, nodeTypeShown) => {
    const filteredNodes = [];
    const sourceNodes = [];

    let filteredKnowledge = knowledge.filter(knl => {
        if(nodeTypeShown === 'both') {
            filteredNodes.push(knl.data.id)
            return true;
        }
        if(nodeTypeShown === 'objectType') {
            if(knl.data.category !== 'activity') {
                filteredNodes.push(knl.data.id);
                return true;
            } else {
                return false;
            }
        }
        if(nodeTypeShown === 'activity') {
            if(knl.data.category !== 'object_type') {
                filteredNodes.push(knl.data.id);
                return true;
            } else {
                return false;
            }
        } 
    });

    filteredKnowledge = filteredKnowledge.filter(fknl => {
        if (!fknl.data.category){
            const source = fknl.data.source;
            const target = fknl.data.target;
            if(filteredNodes.includes(source) && filteredNodes.includes(target)) {
                sourceNodes.push(source);
                return true;
            } else {
                return false;
            };
        } else {
            return true;
        }
    }); 

    return filteredKnowledge.filter(fknl => {
        if (fknl.data.category === 'process'){
            return sourceNodes.includes(fknl.data.id);
        } else {
            return true;
        }
    }); 
}

export const nodeSharedFilter = (knowledge, sharedNodeShown) => {
    const nodeSharedNum = {}
    knowledge.forEach(knl => {
        if(knl.data.target) {
            nodeSharedNum[knl.data.target] = (nodeSharedNum[knl.data.target] || 0) + 1;
        }
    })

    if (sharedNodeShown === 'both'){
        return knowledge;
    } else if (sharedNodeShown === 'shared'){
        return knowledge.filter(knl => {
            if(knl.data.category){
                if(knl.data.category === 'process'){
                    return true
                } else {
                    return nodeSharedNum[knl.data.id] > 1;
                }
            } else {
                return nodeSharedNum[knl.data.target] > 1;
            }
        })
    } else if (sharedNodeShown === 'nonshared'){
        return knowledge.filter(knl => {
            if(knl.data.category){
                if(knl.data.category === 'process'){
                    return true
                } else {
                    return nodeSharedNum[knl.data.id] == 1;
                }
            } else {
                return nodeSharedNum[knl.data.target] == 1;
            }
        })
    }

    console.log(nodeSharedNum);
}

const countsUpdate = (knowledge, objectTypeCounts, activityCounts) => {
    const updatedCount = {};

    for(const knl of knowledge){
        if(knl.data.category === 'process'){
            const otCount = objectTypeCounts[knl.data.label];
            const actCount = activityCounts[knl.data.label];
            for(const [ot, count] of Object.entries(otCount)){
                updatedCount[ot] = (updatedCount[ot] || 0) + count;
            }
            for(const [act, count] of Object.entries(actCount)){
                updatedCount[act] = (updatedCount[act] || 0) + count;
            }
        }
    }

    return updatedCount;
}

export default function Knowledge({ knowledge, objectTypeCounts, activityCounts }) {
    const knowledgeRef = useRef(null);
    const { setPngDataUrl } = useGlobal();
    const { objectTypeChecked, processChecked } = useFilter();
    const { selectedColorPattern, nodeSize, nodeTypeShown, objectTypeFrequency, activityFrequency, sharedNodeShown } = useSetting();

    const fKnowledge_obj_pro = processFilter(objectTypeFilter(knowledge, objectTypeChecked), processChecked);
    const fKnowledge_fre = frequencyFilter(fKnowledge_obj_pro, objectTypeFrequency, activityFrequency, objectTypeCounts, activityCounts);
    const fKnowledge_node_type = nodeSharedFilter(nodeTypeFilter(fKnowledge_fre, nodeTypeShown), sharedNodeShown);

    const fKnowledge = fKnowledge_node_type;

    useEffect(() => {
    
        const cy = cytoscape(
        {
            container: knowledgeRef.current,

            elements: fKnowledge,
            
            style: [
                {
                    selector: 'node[category="process"]',
                    style: {
                        'width': nodeSize[0],
                        'height': nodeSize[0],
                        'background-color': grey[700],
                        'label': 'data(label)'
                    }
                },

                {
                    selector: 'node[category="object_type"]',
                    style: {
                        'width': nodeSize[1],
                        'height': nodeSize[1],
                        'background-color': grey[500],
                        'label': 'data(label)'
                    }
                },

                {
                    selector: 'node[category="activity"]',
                    style: {
                        'width': nodeSize[2],
                        'height': nodeSize[2],
                        'background-color': grey[300],
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
                name: 'circle'
            },
        });

        if(selectedColorPattern.process){
            cy.nodes().forEach(node => {
                if(node.data('category') === 'process'){
                    node.style('background-color', selectedColorPattern.process[500]);
                }
            });
        }
        
        if(selectedColorPattern.objectType){
            cy.nodes().forEach(node => {
                if(node.data('category') === 'object_type'){
                    node.style('background-color', selectedColorPattern.objectType[500]);
                }
            });
        }
        
        if(selectedColorPattern.activity){
            cy.nodes().forEach(node => {
                if(node.data('category') === 'activity'){
                    node.style('background-color', selectedColorPattern.activity[500]);
                }
            });
        }

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
    
    }, [knowledge, selectedColorPattern, objectTypeChecked, processChecked, nodeSize, objectTypeFrequency, activityFrequency, nodeTypeShown, sharedNodeShown]);
    
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
                ref={knowledgeRef} 
                sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
            />
        </Box>
    )
}