import { Box, IconButton } from "@mui/joy";
import useDataStore from "../store/useDataStore";
import getFlowData from "../functions/getFlowData";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import useStatusStore from "../store/useStatusStore";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import { ActivityNode, ProcessNode } from '../graph/Nodes';
import { ActActEdge, ActPEdge } from '../graph/Edges';
import { getLayoutedNodes } from '../graph/useLayoutNodes';
import '@xyflow/react/dist/style.css';
import {useEffect, useState} from "react";



export async function _DFGFlow() {
    const ocdfgData = useDataStore(state => state.ocdfgData);
    const expandedProcess = useDataStore(state => state.expandedProcess);
    const preloadData = useDataStore(state => state.preloadData);
    const { objectListAll, objectTypeListAll, processList } = preloadData;
    console.log(processList);

    const nodeTypes = {
        process: ProcessNode,
        activity: ActivityNode
    }

    if (!ocdfgData || Object.keys(ocdfgData).length === 0 || !expandedProcess) return null;
    
    const graphData = ocdfgData[expandedProcess];
    console.log(graphData);
    const { initNodes, initEdges } = getFlowData(graphData, processList);
    const { activityNodes, processNodes } = initNodes;
    const { actActEdges, actPEdges } = initEdges;

    const layoutedNodes = await getLayoutedNodes(activityNodes, actActEdges);

    console.log(layoutedNodes, processNodes);
    console.log(actActEdges, actPEdges);

    const nodeList = [...layoutedNodes, ...processNodes];
    const edgeList = [...actActEdges, ...actPEdges];

    const setMode = useStatusStore(state => state.setMode);

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
            <ReactFlow     
                nodes={nodeList}
                edges={edgeList}
                fitView
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>
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
        </Box>
    )
}

export default function DFGFlow() {
    const ocdfgData = useDataStore(state => state.ocdfgData);
    const expandedProcess = useDataStore(state => state.expandedProcess);
    const preloadData = useDataStore(state => state.preloadData);
    const {processList} = preloadData;

    const nodeTypes = { process: ProcessNode, activity: ActivityNode };
    const edgeTypes = { act_act: ActActEdge, act_p: ActPEdge };

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!ocdfgData || !expandedProcess) return;

        const graphData = ocdfgData[expandedProcess];
        const { initNodes, initEdges } = getFlowData(graphData, processList);
        const { activityNodes, processNodes } = initNodes;
        const { actActEdges, actPEdges } = initEdges;

        console.log(activityNodes, processNodes, actActEdges, actPEdges);

        (async () => {
            const layoutedNodes = await getLayoutedNodes(activityNodes, actActEdges);
            setNodes([...layoutedNodes, ...processNodes]);
            setEdges([...actActEdges, ...actPEdges]);
        })();
    }, [ocdfgData, expandedProcess, processList, setNodes, setEdges]);

    const setMode = useStatusStore(state => state.setMode);

    return (
        <Box sx={{position:'fixed',top:66,left:0,right:0,bottom:94,width:'100vw',height:'calc(100vh - 160px)',zIndex:'10'}}>
        <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView 
            nodeTypes={nodeTypes}
        >
            <Background/>
            <Controls/>
        </ReactFlow>
        <IconButton
            sx={{position: 'fixed',
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
            <CloseRoundedIcon fontSize='medium' sx={{ color: 'grey.900' }}/>
        </IconButton>
        </Box>
    );
}