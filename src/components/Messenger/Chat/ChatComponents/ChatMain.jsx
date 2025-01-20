import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';

import { getChatData, getChatPage } from '../../../../features/chat/chatSlice';
import { ChatContextCheckBox } from '../ChatUI/ChatContextCheckBox';
import { ChatMessageCollection } from '../ChatUI/ChatMessageCollection';

export const ChatMain = ({ code }) => {
	const chatRef = useRef(null);

	const {
		currentChatMessages,
		currentChat,
		selectedMessages,
		currentSelectedMessages,
		currentChatCode,
		messagesData,
		isPageLoading,
		lastMessage,
	} = useSelector(state => state.chat);
	const { miniUserData } = useSelector(state => state.profile);
	const dispatch = useDispatch();
	const firstMessageRef = useRef(null);
	const observerRef = useRef(null);

	useEffect(() => {
		dispatch(getChatData(code));
	}, [code, dispatch]);

	useEffect(() => {
		if (chatRef?.current.scrollTop !== 0 && lastMessage.user?.id === miniUserData.id) {
			scroll.scrollToBottom({ containerId: 'chat', duration: 100, smooth: 'easeOutQuad' });
		}
	}, [lastMessage, miniUserData.id, dispatch]);

	useEffect(() => {
		const handleObserver = entries => {
			const entry = entries[0];

			if (
				entry.isIntersecting &&
				!isPageLoading &&
				messagesData[currentChatCode]?.currentPage + 1 < messagesData[currentChatCode]?.totalPage
			) {
				const data = {
					currentChatCode,
					currentPage: messagesData[currentChatCode].currentPage + 1,
					lastMessageId: currentChat.lastMessage.id,
				};

				dispatch(getChatPage(data));
			}
		};

		observerRef.current = new IntersectionObserver(handleObserver, { threshold: 1.0 });

		if (messagesData[currentChatCode]?.totalPage > 1) {
			observerRef.current.observe(firstMessageRef.current);
		}

		return () => observerRef.current.disconnect();
	}, [
		isPageLoading,
		currentChatMessages?.length,
		currentChat,
		messagesData,
		currentChatCode,
		dispatch,
	]);

	return (
		<div
			id='chat'
			ref={chatRef}
			className='messenger__chat-main'
			onContextMenu={e => e.preventDefault()}
		>
			<div
				className={`messenger__chat-main-content ${
					selectedMessages[0] || currentSelectedMessages[0] ? 'selection-mode' : ''
				}`}
			>
				{currentChatMessages &&
					currentChatMessages.map(messageCollection => (
						<ChatMessageCollection
							ref={firstMessageRef}
							collection={messageCollection}
							key={messageCollection.id}
						/>
					))}
			</div>
			<ChatContextCheckBox />
		</div>
	);
};
