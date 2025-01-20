import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import './AuthLayout.scss';

export const AuthLayout = () => {
	return (
		<div className='auth-layout'>
			<Header />
			<main className='auth-layout__main'>
				<Outlet />
			</main>
		</div>
	);
};
