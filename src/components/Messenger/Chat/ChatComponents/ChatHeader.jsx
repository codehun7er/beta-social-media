import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useOutsideClick, useStompClient } from '../../../../features/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { setMessengerModal } from '../../../../features/messenger/messengerSlice';
import { ChatHeaderSelect } from '../ChatUI/ChatHeaderSelect';

import { ReactComponent as BackIcon } from '../../../../images/next.svg';
import { ReactComponent as MoreIcon } from '../../../../images/more.svg';
import { ReactComponent as ProfileIcon } from '../../../../images/profile.svg';
import { ReactComponent as MuteIcon } from '../../../../images/muted.svg';
import { ReactComponent as UnmuteIcon } from '../../../../images/volume.svg';
import { ReactComponent as MarkIcon } from '../../../../images/unread-message.svg';
import { ReactComponent as ClearIcon } from '../../../../images/clear.svg';

export const ChatHeader = () => {
	const { currentChat, selectedMessages } = useSelector(state => state.chat);
	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const stompClient = useStompClient();

	const headerVariants = {
		hidden: {
			opacity: 0,
		},

		show: {
			opacity: 1,
			transition: {
				duration: 0.3,
			},
		},

		exit: {
			opacity: 0,
			transition: {
				duration: 0.3,
			},
		},
	};

	const listVariants = {
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

	const handleAction = type => {
		if (stompClient) {
			switch (type) {
				case 'MUTE':
					stompClient.send(
						'/app/mute',
						{},
						JSON.stringify({ code: currentChat.code, muteForever: true })
					);
					break;
				case 'UNMUTE':
					stompClient.send('/app/unmute', {}, JSON.stringify(currentChat.code));
					break;
				case 'MARK':
					stompClient.send('/app/unread', {}, JSON.stringify(currentChat.code));
					if (!currentChat.markedAsUnread) navigate('/messenger');
					break;
				case 'CLEAR':
					dispatch(
						setMessengerModal({ isShow: true, chat: currentChat, type: 'CLEAR', modalType: 'all' })
					);
					break;
				default:
			}

			setIsShow(false);
		}
	};

	return (
		<div className='messenger__chat-header-wrapper'>
			<AnimatePresence mode='wait'>
				{currentChat && (
					<motion.div
						className='messenger__chat-header'
						variants={headerVariants}
						initial='hidden'
						animate='show'
						exit='exit'
					>
						<div className='messenger__chat-header-info'>
							<hr className='messenger__chat-header-line' />

							<button
								onClick={() => navigate('/messenger')}
								className='messenger__chat-header-back'
							>
								<BackIcon className='messenger__chat-header-back-icon' />
							</button>

							{currentChat.type !== 'DC' || currentChat.deleted ? (
								<div className='messenger__chat-header-link default'>
									<img
										className='messenger__chat-header-img'
										src={currentChat.avatar}
										alt='avatar'
									/>
									<div className='messenger__chat-header-text'>
										<p className='messenger__chat-header-name'>{currentChat.chatName}</p>
									</div>
								</div>
							) : (
								<Link className='messenger__chat-header-link' to={`/users/${currentChat.chatName}`}>
									<img
										className='messenger__chat-header-img'
										src={currentChat.avatar}
										alt='avatar'
									/>
									<div className='messenger__chat-header-text'>
										<p className='messenger__chat-header-name'>{currentChat.chatName}</p>
										<span className='messenger__chat-header-activity'>last seen recently</span>
									</div>
								</Link>
							)}
						</div>

						<AnimatePresence>{selectedMessages[0] && <ChatHeaderSelect />}</AnimatePresence>

						<div className='messenger__chat-header-funcs'>
							<MoreIcon
								ref={btnRef}
								onClick={() => setIsShow(prev => !prev)}
								className={`messenger__chat-header-icon ${isShow ? 'active' : ''}`}
							/>

							<AnimatePresence>
								{isShow && (
									<motion.ul
										ref={targetRef}
										variants={listVariants}
										initial='hidden'
										animate='show'
										exit='exit'
										className='messenger__chat-header-more'
									>
										{currentChat.type === 'DC' && (
											<li>
												<Link
													to={`/users/${currentChat.chatName}`}
													className='messenger__chat-header-more-item link'
												>
													<ProfileIcon className='messenger__chat-header-more-icon profile-icon' />
													<span>View profile</span>
												</Link>
											</li>
										)}

										{currentChat.type === 'DC' &&
											(currentChat.muted ? (
												<li
													onClick={() => handleAction('UNMUTE')}
													className='messenger__chat-header-more-item'
												>
													<UnmuteIcon className='messenger__chat-header-more-icon' />
													<span>Unmute</span>
												</li>
											) : (
												<li
													onClick={() => handleAction('MUTE')}
													className='messenger__chat-header-more-item'
												>
													<MuteIcon className='messenger__chat-header-more-icon' />
													<span>Mute</span>
												</li>
											))}

										<li
											onClick={() => handleAction('MARK')}
											className='messenger__chat-header-more-item'
										>
											<MarkIcon className='messenger__chat-header-more-icon' />
											<span>Mark as unread</span>
										</li>

										<li
											onClick={() => handleAction('CLEAR')}
											className='messenger__chat-header-more-item'
										>
											<ClearIcon className='messenger__chat-header-more-icon' />
											<span>Clear history</span>
										</li>
									</motion.ul>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
