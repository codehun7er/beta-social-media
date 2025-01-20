import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

export const ProfileFollowItem = ({ follower }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = follower.avatar;

		img.onload = () => {
			setIsLoaded(true);
		};
	}, [follower.avatar]);

	return (
		<Link to={`/users/${follower.username}`} className='profile__followers-item'>
			<div className='profile__followers-item-img-wrapper'>
				{isLoaded ? (
					<img className='profile__followers-item-img' src={follower.avatar} alt='follower' />
				) : (
					<Skeleton className='profile__followers-item-img-skeleton' circle />
				)}
			</div>
			<p className='profile__followers-item-username'>{follower.username}</p>
		</Link>
	);
};
