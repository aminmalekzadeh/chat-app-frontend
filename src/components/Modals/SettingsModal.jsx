import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import { Box, Divider, Typography, Stack } from '@mui/material';
import SettingMode from '../settings/SettingMode';
import SettingColor from '../settings/SettingColor';
import SettingFullscreen from '../settings/SettingFullscreen';


SettingsModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};


function SettingsModal(props) {
    const { onClose, open } = props;

    const handleClose = () => {

    }

    return (
        <Dialog onClose={handleClose} open={open}>

            <DialogTitle sx={{ m: 0, p: 2 }}>
                Settings
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>

            <Stack spacing={3} sx={{ pt: 3, px: 3, pb: 15 }}>
                <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Mode</Typography>
                    <SettingMode />
                </Stack>

                <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Color</Typography>
                    <SettingColor />
                </Stack>

                <SettingFullscreen />
            </Stack>


        </Dialog>
    )
}

export default SettingsModal;
