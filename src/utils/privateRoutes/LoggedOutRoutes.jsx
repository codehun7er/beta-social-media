import { Navigate, Outlet } from 'react-router-dom';

export const LoggedOutRoutes = () => {
	const login = localStorage.getItem('lo_uuid');

	return login ? <Navigate to='/feed' /> : <Outlet />;
};
