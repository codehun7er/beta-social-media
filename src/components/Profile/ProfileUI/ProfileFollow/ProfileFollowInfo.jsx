import { ProfileFollowItem } from './ProfileFollowItem';

export const ProfileFollowInfo = ({ title, data, amount, setIsFollowInfo }) => {
	return (
		<div className='profile__followers-container'>
			<div className='profile__followers-header'>
				<h2
					onClick={() => setIsFollowInfo({ type: title.toUpperCase(), show: true })}
					className='profile__followers-title'
				>
					{title}
				</h2>
				<span className='profile__followers-amount'>{amount}</span>
			</div>
			<ul className='profile__followers-main'>
				{data.slice(0, 4).map(follower => (
					<ProfileFollowItem key={follower.id} follower={follower} />
				))}
			</ul>
		</div>
	);
};
