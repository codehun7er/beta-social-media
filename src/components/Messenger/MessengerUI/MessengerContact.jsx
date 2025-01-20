import { useState, useEffect } from 'react';
import { useStompClient } from '../../../features/hooks';
import { format } from 'fecha';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { MessengerContextMenu } from './';

export const MessengerContact = ({ chat }) => {
	const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
	const [isLoaded, setIsLoaded] = useState(false);

	const stompClient = useStompClient();

	const handleClick = () => {
		if (chat.markedAsUnread && stompClient) {
			stompClient.send('/app/unread', {}, JSON.stringify(chat.code));
		}
	};

	const handleContextMenu = e => {
		e.preventDefault();

		const { pageX, pageY } = e;
		setContextMenu(prev => ({ show: !prev.show, x: pageX, y: pageY }));
	};

	useEffect(() => {
		const img = new Image();
		img.src = chat.avatar;

		img.onload = () => {
			setIsLoaded(true);
		};
	}, [chat.avatar]);

	return (
		<li>
			<NavLink
				onMouseDown={e => e.preventDefault()}
				onClick={handleClick}
				onContextMenu={handleContextMenu}
				to={`/messenger/${chat.code}`}
				className='messenger__contacts-chat'
			>
				{isLoaded ? (
					<img className='messenger__contacts-chat-img' src={chat.avatar} alt='avatar' />
				) : (
					<Skeleton circle width={54} height={52} />
				)}
				<div className='messenger__contacts-chat-info'>
					<div className='messenger__contacts-chat-header'>
						<p className='messenger__contacts-chat-name'>{chat.chatName}</p>
						<p className='messenger__contacts-chat-time'>
							{format(
								chat.draft.text ? chat.draft.editingTime : chat.lastMessage.sendingTime,
								'hh:mm A'
							)}
						</p>
					</div>

					<div className='messenger__contacts-chat-body'>
						{chat.draft.text ? (
							<p className='messenger__contacts-chat-text'>
								<span className='messenger__contacts-chat-draft'>Draft: </span>
								<span>{chat.draft.text.replace(/<[^>]*>/g, '').trim()}</span>
							</p>
						) : (
							<p className='messenger__contacts-chat-text'>
								{chat.lastMessage.text.replace(/<[^>]*>/g, '').trim()}
							</p>
						)}

						<AnimatePresence>
							{chat.markedAsUnread && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className='messenger__contacts-chat-unread'
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</NavLink>

			<AnimatePresence>
				{contextMenu.show && (
					<MessengerContextMenu
						x={contextMenu.x}
						y={contextMenu.y}
						chat={chat}
						setContextMenu={setContextMenu}
					/>
				)}
			</AnimatePresence>
		</li>
	);
};
