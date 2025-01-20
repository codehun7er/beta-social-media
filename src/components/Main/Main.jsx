import { useEffect } from 'react';
import { Navigate } from 'react-router-dom'
import './Main.scss';

export const Main = () => {
	useEffect(() => {
		const originalTitle = document.title;

		document.title = 'ITDependency';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return <Navigate to='/login' />;
};
