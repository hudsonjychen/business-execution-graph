import { Box, Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function NodeInfoCard( {top, left, selectedNodeId, nodes} ) {
    const node = nodes[selectedNodeId]
    const listObjectType = Object.entries(node.objectType).map(([objectType, objectTypeInfo]) =>(
            <div key={objectType} style={{ textIndent: '1em' }}>
                #{objectType}: {objectTypeInfo.count}
            </div>
        )
    );

    return (
        <Box style={{position: 'absolute', top: `${top}px`, left: `${left}px`}}>
            <Card sx={{ minWidth: 180}}>
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {node.label}
                    </Typography>
                    <Typography variant="body2">
                        Total Object Count: {node.totalObjectCount}
                        <br />
                        Object Type:
                        <br />
                        <>
                            {listObjectType}
                        </>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}