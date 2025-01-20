import { Outlet } from 'react-router-dom';

export const FeedPosts = () => {
	return (
		<div className='feed__posts'>
			<Outlet />
		</div>
	);
};
