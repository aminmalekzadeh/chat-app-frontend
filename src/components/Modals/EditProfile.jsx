import { useState, useCallback } from 'react';
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
import { Stack, Container, TextField, IconButton, InputAdornment, Alert, Divider, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useAuth from '../../hooks/useAuth';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { MIconButton } from '../@material-extend';
import { UploadAvatar } from '../upload';
import { fData } from '../../utils/formatNumber';

EditProfile.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function EditProfile(props) {
    const { onClose, open } = props;
    const { updateProfile } = useAuth();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const isMountedRef = useIsMountedRef();
    const [showPassword, setShowPassword] = useState(false);
    const [ImageProfile, setImageProfile] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));


    const UpdateProfileSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        userName: Yup.string().required('User Name is required'),
        password: Yup.string().required('Password is required')
    });



    const formik = useFormik({
        initialValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            password: '',
            country: user.country,
            avatarUrl: '',
            file: '',
        },
        // validationSchema: UpdateProfileSchema,
        onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
            try {
                handleClose();
                console.log('ImageProfile', ImageProfile)
                await updateProfile(values.firstName, values.lastName, values.email, values.userName, values.phoneNumber, values.password, values.country,
                    ImageProfile, values.file);
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

    const { errors, touched, values, isSubmitting, handleSubmit, setFieldValue, getFieldProps, handleChange } = formik;

    const handleClose = (value) => {
        onClose(value);
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                setImageProfile(file);
                setFieldValue('avatarUrl', {
                    ...file,
                    preview: URL.createObjectURL(file)
                });
            }
        },
        [setFieldValue]
    );

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Edit Profile</DialogTitle>
            <Divider sx={{ margin: '10px' }} />
            <Container>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Box sx={{ marginBottom: 2 }}>
                            <UploadAvatar
                                accept="image/*"
                                file={values.avatarUrl}
                                maxSize={3145728}
                                onDrop={handleDrop}
                                error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                                caption={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 2,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.secondary'
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                            />
                        </Box>
                        <Stack direction={{ xs: 'column', sm: 'row', margin: '5px' }} spacing={2}>
                            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

                            <TextField
                                fullWidth
                                defaultValue={user.firstName}
                                {...getFieldProps('firstName')}
                                label="First name"
                            />

                            <TextField
                                fullWidth
                                defaultValue={user.lastName}
                                {...getFieldProps('lastName')}
                                label="Last name"
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            autoComplete="username"
                            type="text"
                            helperText={touched.userName && errors.email}
                            {...getFieldProps('userName')}
                            defaultValue={user.userName}
                            label="Username"
                            sx={{ margin: '5px' }}
                        />

                        <TextField
                            fullWidth
                            autoComplete="email"
                            type="email"
                            defaultValue={user.email}
                            label="Email address"
                            sx={{ margin: '5px' }}
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                        />

                        <TextField
                            fullWidth
                            type="text"
                            label="Country"
                            {...getFieldProps('country')}
                            defaultValue={user.country}
                            sx={{ margin: '5px' }}
                        />

                        <TextField
                            fullWidth
                            type="text"
                            label="Phone Number"
                            {...getFieldProps('phoneNumber')}
                            defaultValue={user.phoneNumber}
                            sx={{ margin: '5px' }}
                        />

                        <TextField
                            fullWidth
                            autoComplete="current-password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            {...getFieldProps('password')}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleShowPassword} edge="end">
                                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                        />

                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
                                Save
                            </LoadingButton>
                        </DialogActions>

                    </Form>
                </FormikProvider>
            </Container>

        </Dialog>
    );
}

export default EditProfile;


