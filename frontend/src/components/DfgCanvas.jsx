import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { green, blue, orange } from '@mui/material/colors';
import { Box, IconButton } from "@mui/joy";
import CropFreeRoundedIcon from '@mui/icons-material/CropFreeRounded';
import useDataStore from "../store/useDataStore";
import getOcdfgElements from "../functions/getOcdfg";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import useStatusStore from "../store/useStatusStore";


export default function DfgCanvas() {
    const [cyInstance, setCyInstance] = useState(null);

    const ocdfgData = useDataStore(state => state.ocdfgData);
    const unfoldedProcess = useDataStore(state => state.unfoldedProcess);

    const setMode = useStatusStore(state => state.setMode);
    
    const ocdfgRef = useRef(null);

    useEffect(() => {
        console.log(ocdfgData);
        console.log(unfoldedProcess);

        if (!ocdfgData || Object.keys(ocdfgData).length === 0 || !unfoldedProcess) return;
        
        const ocdfgElements = getOcdfgElements(ocdfgData[unfoldedProcess]);

        const cy = cytoscape(
        {
            container: ocdfgRef.current,

            elements: ocdfgElements,
            
            style: [
                {
                    selector: 'node[type="activity"]',
                    style: {
                        'shape': 'round-rectangle',
                        'background-color': green[300],
                        'label': 'data(label)',
                        'width': 60,
                        'height': 45
                    }
                },
                {
                    selector: 'node[type="process"]',
                    style: {
                        'shape': 'round-rectangle',
                        'background-color': blue[800],
                        'label': 'data(label)',
                        'width': 90,
                        'height': 55
                    }
                },
                {
                    selector: 'node[type="object_type"]',
                    style: {
                        'shape': 'ellipse',
                        'background-color': orange[200],
                        'label': 'data(label)',
                        'width': 30,
                        'height': 30
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#666',
                        'target-arrow-color': '#666',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'font-size': '10px'
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

    }, [ocdfgData, unfoldedProcess]);

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
                zIndex: '10' 
            }}
        >
            <Box 
                ref={ocdfgRef} 
                sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
            />
            <IconButton 
                sx={{
                    position: 'fixed',
                    top: 82,
                    left: 18,
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        transform: 'scale(1.05)',
                    },
                    '&:active': {
                        transform: 'scale(0.95)',
                    },
                }}
                onClick={() => setMode('discovery')}
            >
                <CloseRoundedIcon 
                    fontSize='medium'
                    sx={{ color: 'grey.900' }}
                />
            </IconButton>
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
        </Box>
    )
}