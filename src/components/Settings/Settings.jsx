import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { getSecurityData } from '../../features/auth/authSlice';

import './Settings.scss';

export const Settings = () => {
	const { securityData } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		const originalTitle = document.title;
		document.title = 'Settings';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	useEffect(() => {
		if (!securityData) dispatch(getSecurityData());
	}, [securityData, dispatch]);

	return (
		securityData && (
			<div className='settings container'>
				<div className='settings__content'>
					<Outlet />
				</div>
			</div>
		)
	);
};
