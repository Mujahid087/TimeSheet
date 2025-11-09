import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../state/features/authSlice';

const RequireAuth = (props) => {
    const { redirectTo, children } = props;
    const location = useLocation();
    const user = useSelector(selectUser);

    return user ? (
        children
    ) : (
        <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
    );
}

RequireAuth.defaultProps = { redirectTo: '/login' };

export default RequireAuth;