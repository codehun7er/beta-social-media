import { ReactComponent as BioIcon } from '../../../../../images/profile.svg';
import { ReactComponent as ProfessionsIcon } from '../../../../../images/laptop.svg';
import { ReactComponent as SkillsIcon } from '../../../../../images/lamp.svg';

export const ProfileModalLink = ({ currentPage, title, handleClick }) => {
	const isActive = currentPage === title.toLowerCase();

	const Icon = ({ className }) => {
		switch (title) {
			case 'Personal':
				return <BioIcon className={className} />;
			case 'Skills':
				return <SkillsIcon className={className} />;
			case 'Professions':
				return <ProfessionsIcon className={className} />;
			default:
		}
	};

	return (
		<div
			onClick={() => handleClick(title.toLowerCase())}
			className={`profile__modal-info-link ${isActive ? 'active' : ''}`}
		>
			<Icon className='profile__modal-info-icon' />
			<p className='profile__modal-info-title'>{title}</p>
		</div>
	);
};
