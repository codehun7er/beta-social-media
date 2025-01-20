import './Profile.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useOutsideClick } from '../../features/hooks';

import {
	ProfileDropzone,
	ProfileEditInfo,
	ProfileMoreInfo,
	ProfileSubmitUnfollowModal,
	ProfileFollowInfo,
	ProfileFollowInfoModal,
} from './ProfileUI';

import {
	deleteProfileAvatar,
	deleteProfileCover,
	deleteUserCV,
	followProfile,
	getUserProfile,
	uploadProfileAvatar,
	uploadProfileCover,
	uploadUserCV,
} from '../../features/profile/profileSlice';
import { ProfilePosts } from './ProfileUI/ProfilePosts';
import { ProfilePostsInput } from './ProfileUI/ProfilePosts/ProfilePostsInput';

import { ReactComponent as InfoImg } from '../../images/info.svg';
import { ReactComponent as MessengerIcon } from '../../images/messenger.svg';
import { ReactComponent as MoreIcon } from '../../images/more.svg';
import { ProfileMore } from './ProfileUI/ProfileMore';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadCV } from '../../features/profile/profileService';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';

export const Profile = () => {
	const [isMoreInfoShow, setIsMoreInfoShow] = useState(false);
	const [isEditInfoShow, setIsEditInfoShow] = useState(false);
	const [isSubmitShow, setIsSubmitShow] = useState(false);
	const [isFollowHovered, setIsFollowHovered] = useState(false);
	const [isFollowInfo, setIsFollowInfo] = useState({ show: false, type: 'FOLLOWERS' });
	const [isCVLoading, setIsCVLoading] = useState(false);
	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick();

	const { username } = useParams();
	const dispatch = useDispatch();

	const { userData, miniUserData, isError, followersData, followingData, postsData } = useSelector(
		state => state.profile
	);

	const variants = {
		hidden: {
			opacity: 0,
			y: '-15px',
		},

		show: {
			y: '0px',
			opacity: 1,
			transition: {
				bounce: 0,
				duration: 0.2,
			},
		},

		exit: {
			y: '-15px',
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	const handleFileChange = e => {
		if (e.target.files) {
			const file = e.target.files[0];

			const formData = new FormData();
			formData.append('file', file);

			dispatch(uploadUserCV(formData));
		}
	};

	const handleDownloadCV = async () => {
		try {
			setIsCVLoading(true);
			const response = await downloadCV(userData.cv.filename);
			const url = window.URL.createObjectURL(response);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `${userData.username}_CV.${userData.cv.contentType}`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			setIsCVLoading(false);
		} catch (error) {
			setIsCVLoading(false);
		}
	};

	useEffect(() => {
		const originalTitle = document.title;
		document.title = username;

		dispatch(getUserProfile(username));

		return () => {
			document.title = originalTitle;
		};
	}, [username, dispatch]);

	if (isError && !userData) return <NotFoundPage />;

	return (
		userData && (
			<div className='profile container'>
				<div className='profile__content'>
					<div className='profile__header'>
						<div className='profile__cover-block'>
							<ProfileDropzone
								className='profile__cover'
								img={userData.cover}
								hasImg={userData.hasCover}
								isCircle={false}
								addAction={uploadProfileCover}
								deleteAction={deleteProfileCover}
								isMyProfile={miniUserData.username === username}
							/>
						</div>

						<div className='profile__header-content'>
							<div className='profile__info'>
								<div className='profile__info-img'>
									<div className='profile__avatar-block'>
										<ProfileDropzone
											className='profile__avatar'
											img={userData.avatar}
											hasImg={userData.hasAvatar}
											isCircle={true}
											addAction={uploadProfileAvatar}
											deleteAction={deleteProfileAvatar}
											isMyProfile={miniUserData.username === username}
										/>
									</div>
								</div>

								<div className='profile__info-text'>
									<h1 className='profile__username'>{userData.username}</h1>
									<p className='profile__name'>
										{userData.firstname} {userData.lastname}
									</p>
									<div className='profile__info-buttons'>
										<p onClick={() => setIsMoreInfoShow(true)} className='profile__info-button'>
											<InfoImg className='profile__info-icon' />
											<span>More Info</span>
										</p>
										{userData.hasCV ? (
											<>
												{isCVLoading ? (
													<p className='profile__cv-link loading'>Loading...</p>
												) : (
													<button className='profile__cv-link' onClick={handleDownloadCV}>
														Download CV
													</button>
												)}

												{miniUserData.username === username && (
													<button
														onClick={() => dispatch(deleteUserCV())}
														className='profile__cv-delete'
													>
														Delete CV
													</button>
												)}
											</>
										) : (
											miniUserData.username === username && (
												<label className='profile__cv-input-label'>
													<input
														type='file'
														className='profile__cv-input'
														onChange={handleFileChange}
													/>

													<span className='profile__cv-btn'>Upload CV</span>
												</label>
											)
										)}
									</div>
								</div>
							</div>

							<div className='profile__header-buttons'>
								{miniUserData.username === username ? (
									<button
										onClick={() => setIsEditInfoShow(true)}
										className='profile__header-edit profile__button'
									>
										Edit <span className='profile__header-edit-text'>profile</span>
									</button>
								) : (
									<>
										{userData.following ? (
											<button
												onMouseEnter={() => setIsFollowHovered(true)}
												onMouseLeave={() => setIsFollowHovered(false)}
												onClick={() => setIsSubmitShow(true)}
												className='profile__button follow following'
											>
												{isFollowHovered ? 'Unfollow' : 'Following'}
											</button>
										) : (
											<button
												onClick={() => dispatch(followProfile(userData.id))}
												className='profile__button follow'
											>
												Follow
											</button>
										)}

										<Link
											to={`/messenger/${userData.id}`}
											className='profile__header-send profile__button'
										>
											<MessengerIcon className='profile__header-send-icon' />
										</Link>

										<div className='profile__header-more'>
											<button
												ref={btnRef}
												onClick={() => setIsShow(prev => !prev)}
												className='profile__header-more-button profile__button'
											>
												<MoreIcon className='profile__header-more-icon' />
											</button>

											<AnimatePresence>
												{isShow && (
													<motion.ul
														ref={targetRef}
														variants={variants}
														initial='hidden'
														animate='show'
														exit='exit'
														className='profile__more'
													>
														<ProfileMore id={userData.id} setIsShow={setIsShow} />
													</motion.ul>
												)}
											</AnimatePresence>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					<div className='profile__main'>
						<div className='profile__main-left-column'>
							<div className='profile__posts'>
								{miniUserData.username === username && (
									<div className='profile__posts-header'>
										<ProfilePostsInput />
									</div>
								)}

								{postsData.content.length > 0 && (
									<div className='profile__posts-main'>
										<ProfilePosts />
									</div>
								)}
							</div>
						</div>

						<div className='profile__main-right-column'>
							{userData.countOfFollowing !== 0 || userData.countOfFollowers !== 0 ? (
								<div className='profile__followers profile__right-block'>
									{userData.countOfFollowers > 0 && (
										<ProfileFollowInfo
											title='Followers'
											data={followersData.content}
											amount={userData.countOfFollowers}
											setIsFollowInfo={setIsFollowInfo}
										/>
									)}

									{userData.countOfFollowing > 0 && (
										<ProfileFollowInfo
											title='Following'
											data={followingData.content}
											amount={userData.countOfFollowing}
											setIsFollowInfo={setIsFollowInfo}
										/>
									)}
								</div>
							) : (
								<div className='profile__right-block notFound'>
									<span>User doesn't have any followers or following</span>
								</div>
							)}
						</div>
					</div>

					<ProfileMoreInfo isShow={isMoreInfoShow} setIsShow={setIsMoreInfoShow} />

					<ProfileEditInfo isShow={isEditInfoShow} setIsShow={setIsEditInfoShow} />

					<ProfileSubmitUnfollowModal isShow={isSubmitShow} setIsShow={setIsSubmitShow} />

					<ProfileFollowInfoModal isFollowInfo={isFollowInfo} setIsFollowInfo={setIsFollowInfo} />
				</div>
			</div>
		)
	);
};
