import { Handle, Position } from '@xyflow/react';
import { Box, Card, CardContent, Typography } from "@mui/joy";
import { ActivityIcon, ObjectIcon, ProcessIcon } from "../assets/CustomIcons";


export function _ActivityNode({ data }) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 90, 
                height: 60,
                borderRadius: '12px',
                p: 0.5,
                backgroundColor: '#fbfbfbff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <ActivityIcon />
                <Typography color='neutral' level='title-sm'>
                    Activity
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography level="title-sm">{data.label}</Typography>
            </Box>
            <Box>
                {data.targetHandles.map((handle) => (
                    <Handle
                        key={handle.id}
                        id={handle.id}
                        type="target"
                        position={Position.Left}
                    />
                ))}
            </Box>
            <Box>
                {data.sourceHandles.map((handle) => (
                    <Handle
                        key={handle.id}
                        id={handle.id}
                        type="source"
                        position={Position.Right}
                    />
                ))}
            </Box>
            <Box>
                <Handle
                    id={`${data.label}-tp-s`}
                    type="source"
                    position={Position.Top}
                    style={{ left: '40%' }}
                />
                <Handle
                    id={`${data.label}-tp-t`}
                    type="target"
                    position={Position.Top}
                    style={{ left: '60%' }}
                />
            </Box>
        </Card>
    )
}


export function ActivityNode({ data }) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 90, 
                height: 60,
                borderRadius: '12px',
                p: 1,
                backgroundColor: '#fbfbfbff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 0.5
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 0,
                    flex: '0 0 auto'
                }}
            >
                <ActivityIcon />
                <Typography 
                    color='neutral' 
                    level='title-sm'
                    sx={{ fontSize: '0.75rem', lineHeight: 1 }}
                >
                    Activity
                </Typography>
            </Box>
            
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '1 1 auto',
                    minHeight: 0,
                    overflow: 'hidden'
                }}
            >
                <Typography 
                    level="title-sm"
                    sx={{ 
                        fontSize: '0.7rem', 
                        lineHeight: 1.1,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        hyphens: 'auto',
                        maxWidth: '100%',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {data.label}
                </Typography>
            </Box>

            {data.targetHandles.map((handle) => (
                <Handle
                    key={handle.id}
                    id={handle.id}
                    type="target"
                    position={Position.Left}
                />
            ))}
            
            {data.sourceHandles.map((handle) => (
                <Handle
                    key={handle.id}
                    id={handle.id}
                    type="source"
                    position={Position.Right}
                />
            ))}
            
            <Handle
                id={`${data.label}-tp-s`}
                type="source"
                position={Position.Top}
                style={{ left: '40%' }}
            />
            <Handle
                id={`${data.label}-tp-t`}
                type="target"
                position={Position.Top}
                style={{ left: '60%' }}
            />
        </Card>
    )
}


export function _ProcessNode({ data }) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 120, 
                minHeight: 80,
                borderRadius: '12px',
                p: 1.5,
                backgroundColor: '#fbfbfbff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                }}
            >
                <ProcessIcon />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 40
                }}
            >
                <Typography level="title-md">{data.label}</Typography>
            </Box>
            <Box>
                <Handle
                    id={`${data.label}-b-t`}
                    type="target"
                    position={Position.Bottom}
                    style={{ left: '40%' }}
                />
                <Handle
                    id={`${data.label}-b-s`}
                    type="source"
                    position={Position.Bottom}
                    style={{ left: '60%' }}
                />
            </Box>
        </Card>
    )
}


export function ProcessNode({ data }) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 120, 
                height: 80,
                borderRadius: '12px',
                p: 1,
                backgroundColor: '#fbfbfbff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 0.5
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 0,
                    flex: '0 0 auto'
                }}
            >
                <ProcessIcon />
                <Typography 
                    color='neutral' 
                    level='title-sm'
                    sx={{ fontSize: '1rem', lineHeight: 1 }}
                >
                    Process
                </Typography>
            </Box>
            
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '1 1 auto',
                    minHeight: 0,
                    overflow: 'hidden',
                    mt: -2
                }}
            >
                <Typography 
                    level="title-sm"
                    sx={{ 
                        fontSize: '0.85rem', 
                        lineHeight: 1.1,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        hyphens: 'auto',
                        maxWidth: '100%',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {data.label}
                </Typography>
            </Box>
            
            <Handle
                id={`${data.label}-b-s`}
                type="source"
                position={Position.Bottom}
                style={{ left: '40%' }}
            />
            <Handle
                id={`${data.label}-b-t`}
                type="target"
                position={Position.Bottom}
                style={{ left: '60%' }}
            />
        </Card>
    )
}