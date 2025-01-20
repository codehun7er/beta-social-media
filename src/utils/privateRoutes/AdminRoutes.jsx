import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { NotFoundPage } from '../../components';

export const AdminRoutes = () => {
	const isAdmin = useSelector(state => state.profile.isAdmin);

	return isAdmin ? <Outlet /> : <NotFoundPage />;
};
