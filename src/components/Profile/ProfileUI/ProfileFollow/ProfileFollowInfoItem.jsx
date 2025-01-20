import { Link } from 'react-router-dom';
import { ReactComponent as MessengerIcon } from '../../../../images/messenger.svg';

export const ProfileFollowInfoItem = ({ follower, setIsShow }) => {
	return (
		<li className='profile__modal-follow-item'>
			<Link
				onClick={() => setIsShow(false)}
				to={`/users/${follower.username}`}
				className='profile__modal-follow-link'
			>
				<img src={follower.avatar} alt='avatar' />
				<p>{follower.username}</p>
			</Link>

			<Link to={`/messenger/${follower.id}`} className='profile__modal-follow-message-btn'>
				<MessengerIcon className='profile__modal-follow-icon' />
			</Link>
		</li>
	);
};
