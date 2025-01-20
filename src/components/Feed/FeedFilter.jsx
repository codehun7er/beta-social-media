import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const FeedFilter = () => {
	const location = useLocation();

	return (
		<div className='feed__filter'>
			<Link className={`feed__filter-link ${location.pathname === '/feed' && 'active'}`} to='/feed'>
				All
			</Link>

			<Link
				className={`feed__filter-link ${location.pathname === '/feed/following' && 'active'}`}
				to='following'
			>
				Following news
			</Link>
		</div>
	);
};
