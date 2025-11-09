import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";  // ✅ Add Controller
import { yupResolver } from '@hookform/resolvers/yup';
import Box from "@mui/material/Box"; 
import Container from "@mui/material/Container"; 
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";  // ✅ Use TextField instead
import LoginIcon from "@mui/icons-material/LockPersonRounded";
import auth from "../services/auth";
import schema from "../validations/login";
import { useLoginUserMutation } from "../state/features/apiSlice";
import { isUserLoggedIn, setCredentials } from "../state/features/authSlice"; 

const Login = () => {
    const navigate = useNavigate(); 
    const isAlreadyLoggedIn = useSelector(isUserLoggedIn); 
    const dispatch=useDispatch()
    const [loginUser, { isLoading, data, error }] = useLoginUserMutation(); 

    const { control, formState: { errors }, handleSubmit } = useForm({
        mode: 'onTouched', 
        defaultValues: {
            email: '', 
            password: ''
        },
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (isAlreadyLoggedIn) navigate('/');

        if (data) {
            const user = {
                _id: data._id, 
                name: data.name, 
                email: data.email, 
                token: data.token, 
                role: data.role, 
                reportsTo: data.reportsTo
            };
            auth.saveAuthToken(data.token);
            auth.saveUser(data.user);

            dispatch(setCredentials({user}))
            navigate("/");
        }
    }, [data, isAlreadyLoggedIn, navigate]); 

    const onSubmit = (data) => loginUser(data); 

    return (
        <Container component='main' maxWidth='xs' sx={{ my: 'auto' }}>
            <Stack alignItems='center'>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> 
                    <LoginIcon />
                </Avatar>
                <Typography component='h1' variant="h4">
                    Log In 
                </Typography>

                {error && (
                    <Typography 
                        color="error" 
                        variant="body1" 
                        textAlign='center'
                        fontWeight={500}
                        my={2}
                    >
                        {error.data?.message || error.error}
                    </Typography>
                )}

                <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    {/* ✅ Use Controller with TextField */}
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='E-mail'
                                error={!!errors?.email}
                                helperText={errors?.email?.message}
                                disabled={isLoading}
                                autoComplete="username"
                                autoFocus
                                fullWidth
                                margin="normal"
                            />
                        )}
                    />
                    
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='Password'
                                type='password'
                                error={!!errors?.password}
                                helperText={errors?.password?.message}
                                disabled={isLoading}
                                autoComplete="current-password"
                                fullWidth
                                margin="normal"
                            />
                        )}
                    />

                    <FormControlLabel 
                        control={<Checkbox value='remember' color="primary" />}
                        label="Remember me"
                    />

                    <Button 
                        type='submit' 
                        fullWidth 
                        disabled={isLoading} 
                        variant="contained" 
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isLoading ? 'Please wait...' : 'Log in'}
                    </Button>
                </Box>
            </Stack>
        </Container>
    );
}

export default Login;