import './ActivateAccount.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { activateUser, resetAuthData } from '../../features/auth/authSlice';

export const ActivateAccount = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const { isError } = useSelector(state => state.auth);
	const code = location.search.slice(6);

	useEffect(() => {
		dispatch(activateUser(code));
		dispatch(resetAuthData());
	}, [code, dispatch]);

	useEffect(() => {
		const originalTitle = document.title;

		document.title = 'Activate account';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return (
		<div className='activate container'>
			<p className='activate__text'>
				{isError ? 'Something went wrong' : 'Welcome to the ITDependency'}
			</p>
			<button className='activate__button' onClick={() => navigate('/login')}>
				Login
			</button>
		</div>
	);
};
