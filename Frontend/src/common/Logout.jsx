// import auth from '../services/auth' 

// const Logout=()=>{
//     auth.logoutUser(); 
//     window.location='/'
//     return null
// }

// export default Logout

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../state/features/authSlice';
import auth from '../services/auth';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear localStorage
        auth.logoutUser();
        
        // Clear Redux state
        dispatch(logout());
        
        // Navigate to home
        navigate('/');
    }, [navigate, dispatch]);

    return null;
};

export default Logout;