import './Sidebar.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useOutsideClick } from '../../../features/hooks/useOutsideClick';
import { SidebarLink } from './SidebarLink';
import Skeleton from 'react-loading-skeleton';

import { ReactComponent as ExplorerIcon } from '../../../images/explore.svg';
import { ReactComponent as FeedIcon } from '../../../images/feed.svg';
import { ReactComponent as MessengerIcon } from '../../../images/messenger.svg';
import { ReactComponent as AdminPanelIcon } from '../../../images/admin.svg';
import { ReactComponent as MoreIcon } from '../../../images/more.svg';
import { ReactComponent as SupportIcon } from '../../../images/question.svg';
import { ReactComponent as SettingsIcon } from '../../../images/settings.svg';
import { ReactComponent as LogOutIcon } from '../../../images/logout.svg';
import { logoutUser } from '../../../features/auth/authSlice';

export const Sidebar = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const miniUserData = useSelector(state => state.profile.miniUserData);
	const isAdmin = useSelector(state => state.profile.isAdmin);
	const location = useLocation();
	const rootLocation = location.pathname.split('/')[1];

	const dispatch = useDispatch();
	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick();

	const links = [
		{
			path: '/feed',
			IconComponent: FeedIcon,
		},
		{
			path: '/messenger',
			IconComponent: MessengerIcon,
		},
		{
			path: '/explorer',
			IconComponent: ExplorerIcon,
		},
	];

	const activeLine = (
		<motion.div layoutId='activeSidebarLink' className='animated-line sidebar-line' />
	);

	const variants = {
		hidden: {
			y: '-10px',
			opacity: 0,
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
			y: '-10px',
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	useEffect(() => {
		const img = new Image();
		img.src = miniUserData.avatar;

		img.onload = () => {
			setIsLoaded(true);
		};
	}, [miniUserData.avatar]);

	return (
		<nav className='logged-in-layout__sidebar-wrapper'>
			<div className='logged-in-layout__sidebar first-section'>
				<motion.span className='logged-in-layout__sidebar-profile'>
					<Link to={`users/${miniUserData.username}`}>
						{isLoaded ? (
							<img
								className='logged-in-layout__sidebar-img'
								src={miniUserData.avatar}
								alt='avatar'
							/>
						) : (
							<Skeleton circle width={33} height={33} />
						)}
					</Link>
					{location.pathname.includes(`/users`) && activeLine}
				</motion.span>
				<hr className='logged-in-layout__sidebar-line' />
				<div className='logged-in-layout__sidebar-icons'>
					{links.map(link => {
						return <SidebarLink key={link.path} link={link} />;
					})}
				</div>
			</div>

			<div className='logged-in-layout__sidebar second-section'>
				<div className='logged-in-layout__sidebar-icon-wrapper more'>
					<MoreIcon
						ref={btnRef}
						onClick={() => setIsShow(prev => !prev)}
						className='logged-in-layout__sidebar-icon more'
					/>
					{(rootLocation.includes('settings') ||
						rootLocation.includes('support') ||
						rootLocation.includes('admin-panel')) &&
						activeLine}

					<AnimatePresence>
						{isShow && (
							<motion.ul
								ref={targetRef}
								variants={variants}
								initial='hidden'
								animate='show'
								exit='exit'
								className='logged-in-layout__sidebar-dropdown'
							>
								<li
									onClick={() => setIsShow(false)}
									className='logged-in-layout__sidebar-dropdown-item'
								>
									<NavLink to='/support' className='logged-in-layout__sidebar-dropdown-link'>
										<SupportIcon className='logged-in-layout__sidebar-dropdown-link-icon' />
										<span>Help & support</span>
									</NavLink>
								</li>

								<li
									onClick={() => setIsShow(false)}
									className='logged-in-layout__sidebar-dropdown-item'
								>
									<NavLink to='/settings' className='logged-in-layout__sidebar-dropdown-link'>
										<SettingsIcon className='logged-in-layout__sidebar-dropdown-link-icon' />
										<span>Settings</span>
									</NavLink>
								</li>

								{isAdmin && (
									<li
										onClick={() => setIsShow(false)}
										className='logged-in-layout__sidebar-dropdown-item'
									>
										<NavLink to='/admin-panel' className='logged-in-layout__sidebar-dropdown-link'>
											<AdminPanelIcon className='logged-in-layout__sidebar-dropdown-link-icon' />
											<span>Admin Panel</span>
										</NavLink>
									</li>
								)}

								<li
									onClick={() => setIsShow(false)}
									className='logged-in-layout__sidebar-dropdown-item'
								>
									<button
										onClick={() => dispatch(logoutUser())}
										className='logged-in-layout__sidebar-dropdown-link logout'
									>
										<LogOutIcon className='logged-in-layout__sidebar-dropdown-link-icon' />
										<span>Logout</span>
									</button>
								</li>
							</motion.ul>
						)}
					</AnimatePresence>
				</div>
			</div>
		</nav>
	);
};
