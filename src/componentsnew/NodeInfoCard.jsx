import { Box, Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function NodeInfoCard( {top, left} ) {
    return (
        <Box style={{position: 'absolute', top: `${top}px`, left: `${left}px`}}>
            <Card sx={{ maxWidth: 250}}>
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        Order Management
                    </Typography>
                    <Typography variant="body2">
                        Object count: 320
                        <br />
                        Average execution time: 25min
                        <br />
                        Object type:
                        <br />
                        order: 60, item: 260
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}