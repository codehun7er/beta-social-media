import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const ChatContextMenu = ({ children, x, y, message, setContextMenu }) => {
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

	const menuRef = useRef(null);

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

	useEffect(() => {
		setMenuPosition({ x, y });

		if (y + menuRef.current.clientHeight > window.innerHeight) {
			setMenuPosition(prev => ({
				...prev,
				y: window.innerHeight - menuRef.current.clientHeight - 10,
			}));
		}

		if (x + menuRef.current.clientWidth > window.innerWidth) {
			setMenuPosition(prev => ({
				...prev,
				x: window.innerWidth - menuRef.current.clientWidth - 10,
			}));
		}
	}, [x, y]);

	useEffect(() => {
		const handleMouseMove = e => {
			const { left, right, top, bottom } = menuRef.current.getBoundingClientRect();
			const isMouseOutside =
				e.clientX < left - 80 ||
				e.clientX > right + 80 ||
				e.clientY < top - 80 ||
				e.clientY > bottom + 80;

			if (isMouseOutside) {
				setContextMenu(prev => ({ ...prev, show: false }));
			}
		};

		const handleWheel = () => {
			setContextMenu(prev => ({ ...prev, show: false }));
		};

		const handleOutsideClick = e => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setContextMenu(prev => ({ ...prev, show: false }));
			}
		};

		document.addEventListener('wheel', handleWheel);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('wheel', handleWheel);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [setContextMenu]);

	return (
		<motion.span
			ref={menuRef}
			variants={variants}
			initial='hidden'
			animate='show'
			exit='exit'
			style={{
				position: 'absolute',
				top: `${menuPosition.y}px`,
				left: `${menuPosition.x}px`,
				zIndex: 1,
			}}
			className='messenger__chat-message-menu-wrapper'
			onContextMenu={e => e.preventDefault()}
		>
			<ul onMouseDown={e => e.stopPropagation()} className='messenger__chat-message-menu'>
				{children}
			</ul>
		</motion.span>
	);
};
