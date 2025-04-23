import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import { Typography } from '@mui/material'
import './Instruction.css'

export default function Instruction() {
    return (
        <div>
            <FileOpenOutlinedIcon />
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 38 }}>
                Start by importing event data
            </Typography>
        </div>
    )
}