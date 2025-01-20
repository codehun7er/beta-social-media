import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChangeSettings } from './ChangeSettings';
import { changeUserEmail, resetAuthData } from '../../features/auth/authSlice';

import { ReactComponent as EmailIcon } from '../../images/mail.svg';
import { VerifyEmailSettings } from './VerifyEmailSettings';

export const EmailSettings = () => {
	const { isSuccess } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetAuthData());
	}, [dispatch]);

	return isSuccess ? (
		<VerifyEmailSettings />
	) : (
		<ChangeSettings
			type='email'
			saveAction={changeUserEmail}
			description='To change your email you just need to write a new email in the input below after we will send you a link to confirm your new email'
			navigateTo='/settings/verify-email'
		>
			<EmailIcon className='settings__security-change-icon' />
		</ChangeSettings>
	);
};
