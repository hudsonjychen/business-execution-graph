import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath
} from '@xyflow/react';
import { Chip } from '@mui/joy';

export function ActActEdge(props) {
    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        markerStart,
        markerEnd,
        data,
    } = props;

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} markerStart={markerStart}/>
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'auto',
                    }}
                >
                    <Chip
                        variant="outlined"
                        color="primary"
                        size="sm"
                    >
                        {data?.objectType ?? 'N/A'}
                    </Chip>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}


export function ActPEdge(data) {

    return (
        <>
            <BaseEdge 
                style={{ 
                    strokeWidth: 2,
                    strokeDasharray: '5 5'
                }}
            />
            <EdgeLabelRenderer>
                <Chip
                    variant="outlined"
                    color="primary"
                    size="sm"
                >
                    {data?.objectType ?? 'N/A'}
                </Chip>
            </EdgeLabelRenderer>
        </>
    );
}