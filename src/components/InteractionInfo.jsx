import { Typography } from '@mui/material'
import '/src/styles/InteractionInfo.css'

export default function({ info }) {
    return (
        <div className="interaction-info">
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                Process count: {info.processCount}, Object type count: {info.objectTypeCount}, Object count: {info.objectCount}
            </Typography>
        </div>
    )
}