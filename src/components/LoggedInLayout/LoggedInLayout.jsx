import './LoggedInLayout.scss';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar/Sidebar';

export const LoggedInLayout = () => {
	return (
		<div className='logged-in-layout'>
			<Sidebar />
			<main className='logged-in-layout__main'>
				<Outlet />
			</main>
		</div>
	);
};
