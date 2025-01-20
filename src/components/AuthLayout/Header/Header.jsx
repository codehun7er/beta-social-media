import './Header.scss';
import { NavLink } from 'react-router-dom';

export const Header = () => {
	return (
		<header className='header'>
			<div className='header__content container'>
				<NavLink to='/' className='header__title link'>
					ITD<span className='header__title-part'>ependency</span>
				</NavLink>

				<nav className='header__nav'>
					<NavLink to='/login' className='header__link link'>
						Log in
					</NavLink>
					<NavLink to='/signup' className='header__link link'>
						Sign up
					</NavLink>
				</nav>
			</div>
		</header>
	);
};
