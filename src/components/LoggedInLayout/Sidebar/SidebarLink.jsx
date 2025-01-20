import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SidebarLink = ({ link }) => {
	const location = useLocation();
	const rootLocation = location.pathname.split('/')[1];

	const activeLine = (
		<motion.div layoutId='activeSidebarLink' className='animated-line sidebar-line' />
	);

	return (
		<span className='logged-in-layout__sidebar-icon-wrapper'>
			<NavLink className='logged-in-layout__sidebar-icon-link' to={link.path}>
				<link.IconComponent className='logged-in-layout__sidebar-icon' />
			</NavLink>
			{link.path.includes(rootLocation) && activeLine}
		</span>
	);
};
