import { useState, useContext } from "react";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useFormik, Form, FormikProvider } from 'formik';
import DialogActions from '@mui/material/DialogActions';
import { Stack, Container, TextField, IconButton, InputAdornment, Alert, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import useAuth from '../../hooks/useAuth';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { MIconButton } from '../@material-extend';
import { ChatContext } from "../../contexts/ChatContext";



CallModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    hashId: PropTypes.string.isRequired
};

function CallModal(props) {
    const { onClose, open, hashId } = props;
    const { user, updateProfile } = useAuth();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [URLvideo, setURLvideo] = useState(null);
    const chat = useContext(ChatContext);
    const { peerjsService } = chat;
    const [showPassword, setShowPassword] = useState(false);



    const handleClose = (value) => {
        onClose(value);
    };

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

   

    return (
        <Dialog sx={{ p: 2 }} onClose={handleClose} open={open}>
            <DialogTitle>Auido Call</DialogTitle>
            <Divider sx={{ margin: '10px' }} />
            <Button onClick={() =>  setURLvideo('http://techslides.com/demos/sample-videos/small.mp4') }>
                Load Video
            </Button>
            {URLvideo && <video autoPlay>
                {console.log(URLvideo)}
                <source src={URLvideo}  type="video/mp4"/>
                <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
            </video>}

        </Dialog>
    );
}

export default CallModal;


