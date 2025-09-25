import { Box, Card, Typography } from "@mui/joy";
import { ActivityIcon, ObjectIcon, ProcessIcon } from "../assets/CustomIcons";
import { Handle, Position } from '@xyflow/react';


function ProcessNode({ data }) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 100, 
                minHeight: 60,
                borderRadius: '12px',
                p: 1.5,
                position: 'relative',
                textAlign: 'center',
                backgroundColor: '#fefefe',
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
                    minHeight: '40px',
                }}
            >
                <Typography level="title-md">{data.label}</Typography>
            </Box>

            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </Card>
  );
}


function ActivityNode({ data }) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 80, 
                minHeight: 50,
                borderRadius: '12px',
                p: 1.5,
                position: 'relative',
                textAlign: 'center',
                backgroundColor: '#fefefe',
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
                <ActivityIcon />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '40px',
                }}
            >
                <Typography level="title-sm">{data.label}</Typography>
            </Box>

            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </Card>
  );
}


function ObjectTypeNode({ data }) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 80, 
                minHeight: 40,
                borderRadius: '12px',
                p: 1.5,
                position: 'relative',
                textAlign: 'center',
                backgroundColor: '#fefefe',
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
                <ObjectIcon />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '40px',
                }}
            >
                <Typography level="title-sm">{data.label}</Typography>
            </Box>

            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </Card>
  );
}


const nodeTypes = {
    process: ProcessNode,
    activity: ActivityNode,
    object_type: ObjectTypeNode
}

export default nodeTypes;