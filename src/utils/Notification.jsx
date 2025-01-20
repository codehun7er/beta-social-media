import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const Notification = ({
	title,
	userId,
	description,
	img,
	onTimeOut,
	onClose,
	removeAllNotifications,
	isClosing,
	setIsClosing,
	closingType,
	setClosingType,
}) => {
	const notificationRef = useRef(null);

	const variants = {
		hidden: {
			opacity: 0,
		},

		show: {
			opacity: 1,

			transition: {
				duration: 0.3,
			},
		},

		fastShow: {
			opacity: 1,
		},

		exitWithDelay: {
			opacity: 0,

			transition: {
				duration: 3,
				delay: 2,
			},
		},
	};

	useEffect(() => {
		let timeoutId;

		if (isClosing) {
			timeoutId = setTimeout(onTimeOut, 5000);
		} else {
			clearTimeout(timeoutId);
		}

		return () => clearTimeout(timeoutId);
	}, [isClosing, onTimeOut]);

	useEffect(() => {
		const handleMouseOver = e => {
			e.stopPropagation();

			if (e.currentTarget !== notificationRef.current) {
				setIsClosing(true);
			}
		};

		document.addEventListener('mouseover', handleMouseOver);

		return () => document.removeEventListener('mouseover', handleMouseOver);
	}, [setIsClosing]);

	const onMouseOver = e => {
		e.stopPropagation();

		setIsClosing(false);
		setClosingType('notFirstClose');
	};

	return (
		<motion.div
			ref={notificationRef}
			variants={variants}
			initial='hidden'
			animate={`${
				isClosing ? 'exitWithDelay' : closingType === 'firstClose' ? 'show' : 'fastShow'
			}`}
			onMouseOver={onMouseOver}
		>
			<Link className='notification' onClick={removeAllNotifications} to={`/messenger/${userId}`}>
				<div className='notification__main'>
					<div>
						<img className='notification__img' src={img} alt='avatar' />
					</div>
					<div>
						<div className='notification__title'>{title}</div>
						<div className='notification__description'>{description}</div>
					</div>
				</div>

				<div onClick={onClose} className='notification__close' />
			</Link>
		</motion.div>
	);
};
