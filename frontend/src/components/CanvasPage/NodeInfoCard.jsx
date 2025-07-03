import { Box, Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function NodeInfoCard( {top, left, selectedNodeId, nodeCard} ) {
    const node = nodeCard[selectedNodeId];

    const listObjectType = Object.entries(node.objectType).map(([objectType, objectTypeInfo]) =>(
        <Typography key={objectType} variant="body2" sx={{ fontSize: 14, color: '#555', marginBottom: '8px' }}>
            <span style={{ fontWeight: '400' }}>{objectType}:</span> {objectTypeInfo.count}
        </Typography>
    ));

    const listActivity = node.activity.map(at =>(
        <Typography key={at} variant="body2" sx={{ fontSize: 14, color: '#555', marginBottom: '8px' }}>
            <span style={{ fontWeight: '400' }}>{at}</span>
        </Typography>
    ));

    return (
        <Box style={{position: 'absolute', top: `${top}px`, left: `${left}px`}}>
            <Card sx={{ minWidth: 180}}>
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'grey.600', fontSize: 16, fontWeight: 600, marginBottom: '12px' }}>
                        {node.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 14, color: '#555', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '500' }}>Total Object Count:</span> {node.totalObjectCount}
                    </Typography>
                    <div style={{ marginBottom: '12px' }}>
                        <Typography variant="body2" sx={{ fontSize: 14, color: '#555', fontWeight: '500' }}>
                            <span style={{ fontWeight: '500' }}>Object Type:</span>
                        </Typography>
                        <div style={{ paddingLeft: '1em', paddingTop: '6px' }}>
                            {listObjectType}
                        </div>
                    </div>
                    <Typography variant="body2" sx={{ fontSize: 14, color: '#555', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '500' }}>Process Instance Count:</span> {node.processInstanceCount}
                    </Typography>
                    <div>
                        <Typography variant="body2" sx={{ fontSize: 14, color: '#555', fontWeight: '500' }}>
                            <span style={{ fontWeight: '500' }}>Activity:</span>
                        </Typography>
                        <div style={{ paddingLeft: '1em', paddingTop: '6px' }}>
                            {listActivity}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Box>
    )
}