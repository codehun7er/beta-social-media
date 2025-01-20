import './Messenger.scss';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

import { MessengerHeader } from './MessengerComponents/MessengerHeader';
import { MessengerMain } from './MessengerComponents/MessengerMain';

import { getMessengerChats } from '../../features/messenger/messengerSlice';

export const Messenger = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		const originalTitle = document.title;
		document.title = 'Messenger';

		dispatch(getMessengerChats());

		return () => {
			document.title = originalTitle;
		};
	}, [dispatch]);

	return (
		<div className='messenger'>
			<div
				className={`messenger__contacts ${
					location.pathname.includes('/messenger/') ? 'active' : ''
				}`}
			>
				<MessengerHeader />
				<MessengerMain />
			</div>

			<Outlet />
		</div>
	);
};
