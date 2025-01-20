import { ProfileModalLink } from './ProfileModalLink';

export const ProfileModalNav = ({ currentPage, handleClick }) => {
	return (
		<nav className='profile__modal-info-nav'>
			<ProfileModalLink currentPage={currentPage} title='Personal' handleClick={handleClick} />

			<ProfileModalLink currentPage={currentPage} title='Professions' handleClick={handleClick} />

			<ProfileModalLink currentPage={currentPage} title='Skills' handleClick={handleClick} />
		</nav>
	);
};
