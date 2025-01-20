import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fullReportReset } from '../../features/report/reportSlice';
import { motion, AnimatePresence } from 'framer-motion';

import './ReportNotification.scss';

export const ReportNotification = () => {
	const { isSuccess, isError } = useSelector(state => state.report);
	const dispatch = useDispatch();

	const variants = {
		show: {
			opacity: 1,
		},
		exit: {
			opacity: 0,
			transition: {
				delay: 2,
				duration: 2,
			},
		},
	};

	useEffect(() => {
		if (isSuccess || isError) dispatch(fullReportReset());
	}, [isError, isSuccess, dispatch]);

	return (
		<AnimatePresence>
			{isSuccess && (
				<motion.div variants={variants} className='report' animate='show' exit='exit'>
					Thank you! Your report will be reviewed by our team.
				</motion.div>
			)}

			{isError && (
				<motion.div variants={variants} className='report' animate='show' exit='exit'>
					Something went wrong, try again later.
				</motion.div>
			)}
		</AnimatePresence>
	);
};
