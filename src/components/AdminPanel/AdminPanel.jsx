import { useEffect } from 'react';
import './AdminPanel.scss';

export const AdminPanel = () => {
	useEffect(() => {
		const originalTitle = document.title;

		document.title = 'Admin panel';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return <div className='admin-panel'></div>;
};
