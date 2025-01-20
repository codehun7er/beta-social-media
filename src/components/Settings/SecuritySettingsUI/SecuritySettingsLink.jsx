import { Link } from 'react-router-dom';

import { ReactComponent as ArrowIcon } from '../../../images/arrow.svg';

export const SecuritySettingsLink = ({ path, title, description, dangerous = false, children }) => {
	return (
		<Link to={path} className={`settings__security-link ${dangerous ? 'delete' : ''}`}>
			<div className='settings__security-link-left'>
				{children}
				<div className='settings__security-link-info'>
					<p className='settings__security-link-title'>{title}</p>
					<p className='settings__security-link-description'>{description}</p>
				</div>
			</div>

			<div className='settings__security-link-left'>
				<ArrowIcon className='settings__security-link-arrow' />
			</div>
		</Link>
	);
};
