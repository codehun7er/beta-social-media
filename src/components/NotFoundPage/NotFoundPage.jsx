import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowIcon } from '../../images/next.svg';
import { ReactComponent as SearchIcon } from '../../images/search.svg';

import './NotFoundPage.scss';

export const NotFoundPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const originalTitle = document.title;
		document.title = 'Not found';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return (
		<div className='not-found__wrapper'>
			<div className='not-found'>
				<button onClick={() => navigate(-1)} className='not-found__back'>
					<ArrowIcon className='not-found__back-icon' />
				</button>

				<h2 className='not-found__title'>Not Found</h2>
				<SearchIcon className='not-found__icon' />
				<p className='not-found__description'>
					This page doesn't exist, click arrow to go back or click button to go to feed
				</p>
				<Link to='/feed' className='not-found__button'>
					Go to feed
				</Link>
			</div>
		</div>
	);
};
