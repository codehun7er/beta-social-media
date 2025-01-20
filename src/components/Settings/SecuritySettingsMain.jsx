import { useSelector } from 'react-redux';
import { format } from 'fecha';
import { SecuritySettingsLink } from './SecuritySettingsUI';

import { ReactComponent as UsernameIcon } from '../../images/arroba.svg';
import { ReactComponent as EmailIcon } from '../../images/mail.svg';
import { ReactComponent as PasswordIcon } from '../../images/password.svg';
import { ReactComponent as DeleteIcon } from '../../images/delete.svg';

export const SecuritySettingsMain = () => {
	const { securityData } = useSelector(state => state.auth);

	return (
		<div className='settings__main'>
			<div className='settings__security-content'>
				<h2 className='settings__security-title'>Security Settings</h2>

				<div className='settings__security-nav'>
					<SecuritySettingsLink
						title='Change username'
						path='username'
						description={securityData.username}
					>
						<UsernameIcon className='settings__security-link-icon' />
					</SecuritySettingsLink>

					<SecuritySettingsLink title='Change email' path='email' description={securityData.email}>
						<EmailIcon className='settings__security-link-icon' />
					</SecuritySettingsLink>

					<SecuritySettingsLink
						title='Change password'
						path='password'
						description={
							securityData.passwordHasBeenChanged
								? `was changed ${format(securityData.lastPasswordUpdate, 'MMMM Do, YYYY')}`
								: 'never changed'
						}
					>
						<PasswordIcon className='settings__security-link-icon' />
					</SecuritySettingsLink>
				</div>
			</div>

			<hr className='settings__security-nav-line' />

			<div className='settings__security-danger'>
				<h2 className='settings__security-title danger'>Dangerous Zone</h2>

				<SecuritySettingsLink
					title='Delete account'
					path='delete-account'
					description="If you delete your account, you won't have a chance to restore it"
					dangerous={true}
				>
					<DeleteIcon className='settings__security-link-icon delete' />
				</SecuritySettingsLink>
			</div>
		</div>
	);
};
