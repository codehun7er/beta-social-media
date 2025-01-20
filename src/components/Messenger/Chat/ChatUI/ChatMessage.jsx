import { useState, useEffect, useRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '../../../../features/hooks/useDebounce';
import { format } from 'fecha';
import { AnimatePresence, motion } from 'framer-motion';
import { selectMessage } from '../../../../features/chat/chatSlice';
import { ChatDefaultContextMenu } from './ChatDefaultContextMenu';
import { ChatSelectContextMenu } from './ChatSelectContextMenu';
import { ChatContextMenu } from './ChatContextMenu';

export const ChatMessage = forwardRef(({ message }, ref) => {
	const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
	const [isDateHovered, setIsDateHovered] = useState(false);
	const { debouncedValue, setDebouncedValue } = useDebounce(isDateHovered, 2000);
	const { miniUserData } = useSelector(state => state.profile);
	const { selectedMessages, currentSelectedMessages, currentChatInputActions } = useSelector(
		state => state.chat
	);
	const isSelected = selectedMessages.find(id => id === message.id);
	const editAction = currentChatInputActions.find(action => action.type === 'EDIT');
	const messageRef = useRef(null);

	const dispatch = useDispatch();

	const variants = {
		hidden: {
			opacity: 0,
			y: '-5px',
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
			y: '-5px',
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	const handleContextMenu = e => {
		e.preventDefault();

		const { pageX, pageY } = e;
		setContextMenu(prev => ({ show: !prev.show, x: pageX, y: pageY }));
	};

	const onSelect = () => {
		if (selectedMessages[0]) dispatch(selectMessage(message.id));
	};

	const getMessageClassName = () => {
		let messageClassName = 'messenger__chat-message-info';

		if (message.user.id === miniUserData.id) {
			messageClassName += ' currentUser';
		} else {
			messageClassName += ' recipients';
		}

		if (message.lastInCollection) {
			messageClassName += ' tail';
		}

		if (
			selectedMessages.find(id => id === message.id) ||
			currentSelectedMessages.find(id => id === message.id)
		) {
			messageClassName += ' selected';
		}

		if (message.firstInCollection) {
			messageClassName += ' rounded';
		}

		return messageClassName;
	};

	useEffect(() => {
		if (!editAction) {
			messageRef.current.innerHTML = message.text;
		}
	}, [editAction, message.text]);

	useEffect(() => {
		if (!isDateHovered) setDebouncedValue(false);
	}, [isDateHovered, setDebouncedValue]);

	return (
		<div ref={ref} className='messenger__chat-message'>
			<div
				onClick={onSelect}
				onContextMenu={handleContextMenu}
				className={`messenger__chat-message-selectable ${
					message.user.id === miniUserData.id ? 'currentUser' : 'recipients'
				}`}
			>
				<div className={getMessageClassName()}>
					<span ref={messageRef} className='messenger__chat-message-text' />

					<span
						onMouseEnter={() => setIsDateHovered(true)}
						onMouseLeave={() => setIsDateHovered(false)}
						className='messenger__chat-message-date'
					>
						<span className='messenger__chat-message-date-fake'>
							<div>
								{message.edited && <span className={`messenger__chat-message-edited`}>edited</span>}
								{format(message.sendingTime, 'hh:mm A')}
							</div>
						</span>

						<div className='messenger__chat-message-date-short'>
							<div className='messenger__chat-message-date-short-item'>
								{message.edited && <span className={`messenger__chat-message-edited`}>edited</span>}
								{format(message.sendingTime, 'hh:mm A')}
							</div>
						</div>
					</span>
				</div>

				<AnimatePresence>
					{debouncedValue && (
						<motion.div
							variants={variants}
							initial='hidden'
							animate='show'
							exit='exit'
							className='messenger__chat-message-full-date'
						>
							{format(message.sendingTime, 'hh:mm A, DD MMMM YYYY')}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{contextMenu.show && (
					<ChatContextMenu x={contextMenu.x} y={contextMenu.y} setContextMenu={setContextMenu}>
						{selectedMessages.length > 0 ? (
							<ChatSelectContextMenu
								message={message}
								setContextMenu={setContextMenu}
								isSelected={isSelected}
							/>
						) : (
							<ChatDefaultContextMenu message={message} setContextMenu={setContextMenu} />
						)}
					</ChatContextMenu>
				)}
			</AnimatePresence>
		</div>
	);
});
