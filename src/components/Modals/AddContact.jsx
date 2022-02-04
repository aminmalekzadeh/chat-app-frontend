import { useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useFormik, Form, FormikProvider } from 'formik';
import DialogActions from '@mui/material/DialogActions';
import { Stack, Container, TextField, IconButton, InputAdornment, Alert, Divider, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import closeFill from '@iconify/icons-eva/close-fill';
import useAuth from '../../hooks/useAuth';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { MIconButton } from '../@material-extend';
import { useDispatch, useSelector } from '../../redux/store';
import {
    getNewContactByUsername,
    addNewContact
} from '../../redux/slices/chat';



AddContact.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function AddContact(props) {
    const { onClose, open } = props;
    const { user, updateProfile } = useAuth();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [inputValue, setinputValue] = useState("");
    const [value, setValue] = useState(null);
    const dispatch = useDispatch();
    const { NewContacts } = useSelector((state) => state.chat);
    const isMountedRef = useIsMountedRef();

    const handleClose = (value) => {
        onClose(value);
    };

    useEffect(async () => {
        await dispatch(getNewContactByUsername(inputValue));
        
    }, [inputValue]);

    const formik = useFormik({
        initialValues: {
            user_id: '',
        },
        // validationSchema: UpdateProfileSchema,
        onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
            try {
                handleClose();
                
                 await dispatch(addNewContact(value.id));
                
                enqueueSnackbar('Update success', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill} />
                        </MIconButton>
                    )
                });
                if (isMountedRef.current) {
                    setSubmitting(false);
                }
            } catch (error) {
                console.error(error);
                resetForm();
                if (isMountedRef.current) {
                    setSubmitting(false);
                    setErrors({ afterSubmit: error.message });
                }
            }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps ,handleChange} = formik;
    
    return (
        <Dialog sx={{ p: 2 }} onClose={handleClose} open={open}>
            <DialogTitle>Add New Contact</DialogTitle>
            <Divider sx={{ margin: '10px' }} />
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={4} sx={{ p: 4 }}>
                        <Autocomplete
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                            onInputChange={(e) => setinputValue(e.target.value)}
                            disablePortal
                            id="combo-box-demo"
                            options={NewContacts}
                            getOptionLabel={(option) => option.userName}
                            getOptionDisabled={(option) => option.id === user.id}
                            sx={{ width: 300, height: 200 }}
                            renderInput={(params) =>  <TextField
                                 {...params} {...getFieldProps('user_id')} label="Search User by Username" /> }
                        />
                    </Stack>


                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
                            Add
                        </LoadingButton>
                    </DialogActions>
                </Form>
            </FormikProvider>
        </Dialog>
    );
}

export default AddContact;


