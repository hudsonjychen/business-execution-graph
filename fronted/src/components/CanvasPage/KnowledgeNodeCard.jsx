import { Box, Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function KnowledgeNodeCard( {top, left, selectedNodeLabel, updatedCount} ) {
    return (
        <Box style={{ position: 'absolute', top: `${top}px`, left: `${left}px` }}>
            <Card sx={{ minWidth: 80, padding: 1, boxShadow: 2 }}>
                <CardContent sx={{ paddingBottom: '8px !important', paddingTop: '8px' }}>
                    <Typography
                        sx={{
                        color: 'grey.700',
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: '6px',
                        }}
                    >
                        {selectedNodeLabel}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                        fontSize: 12,
                        color: 'grey.800',
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>Count:</span>{' '}
                        {updatedCount[selectedNodeLabel]}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}