import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { explorerFollowUser } from '../../../features/explorer/explorerSlice';

import { ReactComponent as MessengerIcon } from '../../../images/messenger.svg';
import { ExplorerSubmitUnfollowModal } from './ExplorerSubmitUnfollowModal';

export const ExplorerUserListItem = ({ user }) => {
	const [isShow, setIsShow] = useState(false);
	const [isFollowHovered, setIsFollowHovered] = useState(false);
	const dispatch = useDispatch();

	return (
		<li className='explorer__users-list-item'>
			<Link to={`/users/${user.username}`} className='explorer__users-list-link'>
				<div className='explorer__users-list-img-wrapper'>
					<img className='explorer__users-list-img' src={user.avatar} alt='avatar' />
				</div>

				<div className='explorer__users-list-text'>
					<p className='explorer__users-list-username'>{user.username}</p>
					<p className='explorer__users-list-name'>
						{user.firstname} {user.lastname}
					</p>
				</div>
			</Link>

			<div className='explorer__users-list-buttons'>
				{user.following ? (
					<button
						onClick={() => setIsShow(true)}
						onMouseEnter={() => setIsFollowHovered(true)}
						onMouseLeave={() => setIsFollowHovered(false)}
						className='explorer__users-list-follow following'
					>
						{isFollowHovered ? 'Unfollow' : 'Following'}
					</button>
				) : (
					<button
						onClick={() => dispatch(explorerFollowUser(user.id))}
						className='explorer__users-list-follow'
					>
						Follow
					</button>
				)}

				<Link to={`/messenger/${user.id}`} className='explorer__users-list-message'>
					<MessengerIcon className='explorer__users-list-icon' />
				</Link>
			</div>

			<ExplorerSubmitUnfollowModal isShow={isShow} setIsShow={setIsShow} user={user} />
		</li>
	);
};
