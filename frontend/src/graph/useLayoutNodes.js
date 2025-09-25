import { useEffect } from 'react';
import ELK from 'elkjs/lib/elk.bundled.js';
import { useNodesInitialized, useReactFlow } from '@xyflow/react';


const layoutOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT',
    'elk.layered.spacing.edgeNodeBetweenLayers': '40',
    'elk.spacing.nodeNode': '40',
    'elk.layered.nodePlacement.strategy': 'SIMPLE',
};

const elk = new ELK();

// uses elkjs to give each node a layouted position
export const getLayoutedNodes = async (nodes, edges) => {
    const graph = {
        id: 'root',
        layoutOptions,
        children: nodes.map((n) => {
            const targetPorts = n.data.targetHandles.map((t) => ({
                id: t.id,
                properties: {
                    side: 'WEST',
                },
            }));

            const sourcePorts = n.data.sourceHandles.map((s) => ({
                id: s.id,
                properties: {
                    side: 'EAST',
                },
            }));

            return {
                id: n.id,
                width: n.width ?? 90,
                height: n.height ?? 50,
                properties: {
                    'org.eclipse.elk.portConstraints': 'FIXED_ORDER',
                },
                ports: [{ id: n.id }, ...targetPorts, ...sourcePorts],
            };
        }),
        edges: edges.map((e) => ({
            id: e.id,
            sources: [e.sourceHandle || e.source],
            targets: [e.targetHandle || e.target],
        })),
    };

    const layoutedGraph = await elk.layout(graph);

    const layoutedNodes = nodes.map((node) => {
        const layoutedNode = layoutedGraph.children?.find((lgNode) => lgNode.id === node.id);

        return {
            ...node,
            position: {
                x: layoutedNode?.x ?? 0,
                y: layoutedNode?.y ?? 0,
            },
        };
    });

    return layoutedNodes;
};

export default function useLayoutNodes() {
    const nodesInitialized = useNodesInitialized();
    const { getNodes, getEdges, setNodes, fitView } = useReactFlow();

    useEffect(() => {
        if (nodesInitialized) {
            const layoutNodes = async () => {
                const layoutedNodes = await getLayoutedNodes(getNodes(), getEdges());

                setNodes(layoutedNodes);
                fitView();
            };

            layoutNodes();
        }
    }, [nodesInitialized, getNodes, getEdges, setNodes, fitView]);

    return null;
}
