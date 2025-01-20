import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import { clearMessageSelection, setDeleteModal } from '../../../../features/chat/chatSlice';

export const ChatHeaderSelect = () => {
	const { selectedMessages } = useSelector(state => state.chat);
	const dispatch = useDispatch();

	const selectedVariants = {
		hidden: {
			opacity: 0,
			y: -70,
		},
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.25,
			},
		},
		exit: {
			opacity: 0,
			y: -70,
			transition: {
				duration: 0.25,
			},
		},
	};

	return (
		<motion.div
			className='messenger__chat-header-selected'
			variants={selectedVariants}
			initial='hidden'
			animate='show'
			exit='exit'
		>
			<div className='messenger__chat-header-selected-buttons'>
				<button
					onClick={() => dispatch(setDeleteModal({ show: true }))}
					className='messenger__chat-header-selected-btn'
				>
					Delete {selectedMessages.length}
				</button>
			</div>
			<button
				onClick={() => dispatch(clearMessageSelection(true))}
				className='messenger__chat-header-selected-btn cancel'
			>
				Cancel
			</button>
		</motion.div>
	);
};
