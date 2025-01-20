import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ExplorerNavButton = ({ title, path }) => {
	const location = useLocation();
	const currentLocation = location.pathname.split('/')[2];
	const searchLocation = currentLocation ? currentLocation : '';

	const activeLine = <motion.div layoutId='activeGlobalSearchLink' className='animated-line' />;

	return (
		<Link to={path} className={`explorer__nav-link ${searchLocation === path ? 'active' : ''}`}>
			{title}
			{searchLocation === path && activeLine}
		</Link>
	);
};
