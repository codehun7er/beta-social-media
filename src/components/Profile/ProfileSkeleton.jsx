import Skeleton from 'react-loading-skeleton';

export const ProfileSkeleton = () => {
	return (
		<div className='profile container'>
			<div className='profile__skeleton'>
				<div className='profile__skeleton-header'>
					<Skeleton />
				</div>
			</div>
		</div>
	);
};
