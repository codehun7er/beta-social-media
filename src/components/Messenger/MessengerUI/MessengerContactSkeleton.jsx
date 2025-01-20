import Skeleton from 'react-loading-skeleton';

export const MessengerContactSkeleton = ({ count }) => {
	const getRandomWidth = (min, max) => {
		return Math.floor(Math.random() * (max - min) + min);
	};

	return Array(count)
		.fill(0)
		.map((item, i) => (
			<div key={i} className='messenger__contacts-skeleton'>
				<Skeleton circle width={54} height={54} />
				<div className='messenger__contacts-skeleton-info'>
					<div className='messenger__contacts-skeleton-header'>
						<Skeleton
							width={getRandomWidth(80, 140)}
							style={{ marginBottom: '3px', fontSize: '18px' }}
						/>
						<Skeleton width={getRandomWidth(40, 70)} style={{ fontSize: '14px' }} />
					</div>
					<Skeleton width={getRandomWidth(100, 180)} />
				</div>
			</div>
		));
};
