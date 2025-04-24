import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function InfoButton() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <IconButton aria-label='info' onClick={handleOpen}>
                <InfoOutlinedIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="info-dialog-title"
                aria-describedby="info-dialog-description"
            >
                <DialogTitle id="info-dialog-title">
                    {"Information"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="info-dialog-description">
                        <strong>App Name:</strong> InterPM<br />
                        <strong>Version:</strong> 1.0.0<br />
                        <strong>Developer:</strong> Jiayuan Chen<br />
                        <strong>Affiliation:</strong> Stockholm universitet, SAP<br />
                        <strong>Supervisors:</strong> Amin Jalali @ SU, Majid Rafiei @ SAP<br />
                        <strong>Email:</strong> <a href="mailto:jich5340@student.su.se">jich5340@student.su.se</a><br />
                        <strong>GitHub:</strong> <a href="https://github.com/hudsonjychen" target="_blank" rel="noopener noreferrer">
                            github.com/hudsonjychen
                        </a><br />
                        <br />
                        Feel free to reach out for feedback, bug reports, or collaboration opportunities!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}