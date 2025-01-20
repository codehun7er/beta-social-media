import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Modal } from '../../../../UI/Modal';
import { ProfileFollowInfoItem } from './ProfileFollowInfoItem';
import { getFollowersPage, getFollowingPage } from '../../../../features/profile/profileSlice';

export const ProfileFollowInfoModal = ({ isFollowInfo, setIsFollowInfo }) => {
	const { followersData, followingData, isPageLoading, miniUserData } = useSelector(
		state => state.profile
	);
	const dispatch = useDispatch();
	const listRef = useRef(null);

	const activeLine = (
		<motion.div layoutId='activeFollowLink' className='animated-line follow-line' />
	);

	const setIsShow = payload => {
		setIsFollowInfo(prev => ({ ...prev, show: payload }));
	};

	const handleTypeChange = payload => {
		setIsFollowInfo(prev => ({ ...prev, type: payload }));
	};

	useEffect(() => {
		const list = listRef.current;

		const handleScroll = e => {
			if (isFollowInfo.type === 'FOLLOWERS') {
				if (
					e.target.scrollHeight - (e.target.scrollTop + list.clientHeight) < 150 &&
					!isPageLoading &&
					followersData.currentPage + 1 < followersData.totalPage
				) {
					const data = {
						page: followersData.currentPage + 1,
						id: miniUserData.id,
					};

					dispatch(getFollowersPage(data));
				}
			}

			if (isFollowInfo.type === 'FOLLOWING') {
				if (
					e.target.scrollHeight - (e.target.scrollTop + list.clientHeight) < 150 &&
					!isPageLoading &&
					followingData.currentPage + 1 < followingData.totalPage
				) {
					const data = {
						page: followingData.currentPage + 1,
						id: miniUserData.id,
					};

					dispatch(getFollowingPage(data));
				}
			}
		};

		list.addEventListener('scroll', handleScroll);

		return () => list.removeEventListener('scroll', handleScroll);
	}, [isPageLoading, followersData, isFollowInfo.type, followingData, miniUserData.id, dispatch]);

	return (
		isFollowInfo && (
			<Modal isShow={isFollowInfo.show} setIsShow={setIsShow}>
				<div className='profile__modal-follow'>
					<div className='profile__modal-follow-header'>
						<div className='profile__modal-follow-nav'>
							<span className='profile__modal-follow-button-wrapper'>
								<button
									className={`profile__modal-follow-button ${
										isFollowInfo.type === 'FOLLOWERS' ? 'active' : ''
									}`}
									onClick={() => handleTypeChange('FOLLOWERS')}
								>
									Followers
								</button>
								{isFollowInfo.type === 'FOLLOWERS' && activeLine}
							</span>

							<span className='profile__modal-follow-button-wrapper'>
								<button
									className={`profile__modal-follow-button ${
										isFollowInfo.type === 'FOLLOWING' ? 'active' : ''
									}`}
									onClick={() => handleTypeChange('FOLLOWING')}
								>
									Following
								</button>
								{isFollowInfo.type === 'FOLLOWING' && activeLine}
							</span>
						</div>

						<div onClick={() => setIsShow(false)} className='modal__close' />
					</div>

					<div ref={listRef} className='profile__modal-follow-content'>
						{isFollowInfo.type === 'FOLLOWERS'
							? followersData.content.map(follower => (
									<ProfileFollowInfoItem
										key={follower.id}
										follower={follower}
										setIsShow={setIsShow}
									/>
							  ))
							: followingData.content.map(follower => (
									<ProfileFollowInfoItem
										key={follower.id}
										follower={follower}
										setIsShow={setIsShow}
									/>
							  ))}
					</div>
				</div>
			</Modal>
		)
	);
};
