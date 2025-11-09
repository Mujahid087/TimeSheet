// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector} from "react-redux";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {toast} from "react-toastify" 
// import Box from "@mui/material/Box";
// import Container from '@mui/material/Container';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import AddUserIcon from '@mui/icons-material/PersonAdd'; 
// import Input from "@mui/material/Input";
// import Select from "@mui/material/Select";
// import schema from "../validations/user"; 

// import { useCreateUserMutation } from "../state/features/apiSlice";
// import { selectUser } from "../state/features/authSlice";

// const roles=[
//     {
//         label:'Admin', 
//         value:0,
//     }, 
//     {
//         label:'Manager',
//         value:1
//     },
//     {
//         label:'Employee', 
//         value:2,
//     }
// ]

// const CreateUser=()=>{
//     const navigate=useNavigate();
//     const [createUser,{isLoading,data,error}]=useCreateUserMutation(); 
//     const user=useSelector(selectUser) 

//     const defaultFormValues={
//         name:'',
//         email:'', 
//         role:2, 
//         reportsTo:'', 
//         password:'', 
//     }

//     const {control ,formState:{errors},reset,handleSubmit}=useForm({
//         mode:'onTouched', 
//         defaultValues:defaultFormValues, 
//         resolver:yupResolver(schema)
//     })

//     useEffect(()=>{
//         if(data && data.success){
//             toast.success('User has been created!')
//             reset({defaultValues:defaultFormValues})
//         }
//     },[data])

//     useEffect(()=>{
//         const isAdmin=user?.role.roleId===0; 
//         if (!isAdmin) navigate('/')
//     },[]) 

//     const onSubmit=(data)=>{
//         if(!data.reportsTo) delete data.reportsTo; 
//         createUser(data)
//     }

//     return (
//     <Container component='main' maxWidth='xs' sx={{ my: 'auto' }}>
//       <Stack mt={3} alignItems='center'>
//         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//           <AddUserIcon />
//         </Avatar>
//         <Typography component='h1' variant='h4'>
//           Add User
//         </Typography>
//         {error && (
//           <Typography
//             color='red'
//             variant='body1'
//             textAlign='center'
//             fontWeight={500}
//             my={2}
//           >
//             {error.data?.message || error.error}
//           </Typography>
//         )}
//         <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
//           <Input
//             control={control}
//             error={errors?.name?.message}
//             disabled={isLoading}
//             label='Full Name'
//             name='name'
//             autoFocus
//           />
//           <Input
//             control={control}
//             error={errors?.email?.message}
//             disabled={isLoading}
//             label='E-mail'
//             name='email'
//             autoComplete='username'
//           />
//           <Select
//             control={control}
//             name='role'
//             label='User Role'
//             error={errors?.role?.message}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             defaultValue=''
//             disabled={isLoading}
//             options={roles}
//           />
//           <Input
//             control={control}
//             error={errors?.reportsTo?.message}
//             disabled={isLoading}
//             label='Reporting Manager (ID)'
//             name='reportsTo'
//           />
//           <Input
//             control={control}
//             error={errors?.password?.message}
//             disabled={isLoading}
//             name='password'
//             label='Password'
//             type='password'
//             autoComplete='current-password'
//           />
//           <Button
//             type='submit'
//             fullWidth
//             disabled={isLoading}
//             variant='contained'
//             sx={{ mt: 3, mb: 2 }}
//           >
//             {isLoading ? 'Please wait...' : 'Create User'}
//           </Button>
//         </Box>
//       </Stack>
//     </Container>
//   );
// }

// export default CreateUser


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddUserIcon from '@mui/icons-material/PersonAdd';
import schema from "../validations/user";

import { useCreateUserMutation } from "../state/features/apiSlice";
import { selectUser } from "../state/features/authSlice";

const roles = [
    {
        label: 'Admin',
        value: 0,
    },
    {
        label: 'Manager',
        value: 1
    },
    {
        label: 'Employee',
        value: 2,
    }
];

const CreateUser = () => {
    const navigate = useNavigate();
    const [createUser, { isLoading, data, error }] = useCreateUserMutation();
    const user = useSelector(selectUser);

    const defaultFormValues = {
        name: '',
        email: '',
        role: 2,
        reportsTo: '',
        password: '',
    };

    const { control, formState: { errors }, reset, handleSubmit } = useForm({
        mode: 'onTouched',
        defaultValues: defaultFormValues,
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (data && data.success) {
            toast.success('User has been created!');
            reset(defaultFormValues);
        }
    }, [data, reset]);

    useEffect(() => {
        const isAdmin = user?.role?.roleId === 0;
        if (!isAdmin) navigate('/');
    }, [user, navigate]);

    const onSubmit = (data) => {
        if (!data.reportsTo) delete data.reportsTo;
        createUser(data);
    };

    return (
        <Container component='main' maxWidth='xs' sx={{ my: 'auto' }}>
            <Stack mt={3} alignItems='center'>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <AddUserIcon />
                </Avatar>
                <Typography component='h1' variant='h4'>
                    Add User
                </Typography>
                {error && (
                    <Typography
                        color='error'
                        variant='body1'
                        textAlign='center'
                        fontWeight={500}
                        my={2}
                    >
                        {error.data?.message || error.error}
                    </Typography>
                )}
                <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='Full Name'
                                error={!!errors?.name}
                                helperText={errors?.name?.message}
                                disabled={isLoading}
                                autoFocus
                                fullWidth
                                margin="normal"
                            />
                        )}
                    />

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
                                autoComplete='username'
                                fullWidth
                                margin="normal"
                            />
                        )}
                    />

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label='User Role'
                                error={!!errors?.role}
                                helperText={errors?.role?.message}
                                disabled={isLoading}
                                fullWidth
                                margin="normal"
                            >
                                {roles.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="reportsTo"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='Reporting Manager (ID)'
                                error={!!errors?.reportsTo}
                                helperText={errors?.reportsTo?.message}
                                disabled={isLoading}
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
                                autoComplete='current-password'
                                fullWidth
                                margin="normal"
                            />
                        )}
                    />

                    <Button
                        type='submit'
                        fullWidth
                        disabled={isLoading}
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isLoading ? 'Please wait...' : 'Create User'}
                    </Button>
                </Box>
            </Stack>
        </Container>
    );
}

export default CreateUser;