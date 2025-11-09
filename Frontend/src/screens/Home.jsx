import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import FileIcon from "@mui/icons-material/DescriptionRounded"
import { getUserRole, selectUser } from "../state/features/authSlice";

const Home = () => {
    const navigate = useNavigate();
    const user = useSelector(selectUser)
    const location = useLocation();
    const userRole = useSelector(getUserRole)

    console.log("Current location:", location.pathname);

    const handleLoginClick = () => {
        console.log("Button clicked, navigating to /login");
        console.log("Before navigate - location:", location.pathname);
        
        navigate('/login');
        
        // Check if location changes after navigate
        setTimeout(() => {
            console.log("After navigate - location:", location.pathname);
        }, 100);
    };


    return (
        <Container component='section' sx={{ my: 'auto' }}>
            <Paper component={Box} p={5} mt={4} mx='auto' maxWidth='800px' elevation={2}>
                <Stack justifyContent='center' alignItems='center'>
                    <Avatar
                        sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto' }}
                    >
                        <FileIcon fontSize='large' />
                    </Avatar>
                    <Typography mt={3} variant='h3' textAlign='center' fontWeight={500}>
                        {user ? `Hello ${user?.name} !!` : 'Welcome To Timesheets!'}
                    </Typography>
                    {user ? (
                        <Typography variant='body1' mt={2} mb={3} textAlign='center'>
                            You are currently logged in as {userRole}. To view the
                            available actions, simply open the sidebar located in the top left
                            corner.
                        </Typography>
                    ) : (
                        <Typography variant='body1' mt={2} mb={3} textAlign='center'>
                            Timesheets is a web application designed to help individuals
                            organizations track and manage their time effectively. This app
                            allows employees to log the number of hours they work on specific
                            tasks and projects{' '}
                        </Typography>
                    )}
                    {!user && (
                        <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            onClick={handleLoginClick}
                        >
                            Login Here
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
}


export default Home;