import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ChangeSettings } from './ChangeSettings';
import { changeUserUsername, resetAuthData } from '../../features/auth/authSlice';

import { ReactComponent as UsernameIcon } from '../../images/arroba.svg';

export const UsernameSettings = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetAuthData());
	}, [dispatch]);

	return (
		<ChangeSettings
			type='username'
			saveAction={changeUserUsername}
			description='To change your username you just need to write a new username in the input below'
			navigateTo='/settings'
		>
			<UsernameIcon className='settings__security-change-icon' />
		</ChangeSettings>
	);
};
