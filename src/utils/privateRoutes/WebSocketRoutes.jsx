import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Outlet } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

import {
	clearHistory,
	deleteChat,
	deleteMessage,
	setNewEditedMessage,
	setNewMessage,
	setNewWSDraft,
	toggleChatMarkAsUnread,
	toggleChatMute,
} from '../../features/chat/chatSlice';
import {
	deleteMessengerChat,
	getLastMessage,
	getMessengerChat,
	setLastDraft,
	setLastEditedMessage,
	setLastMessage,
	toggleMarkAsUnread,
	toggleMute,
} from '../../features/messenger/messengerSlice';
import { useNotify } from '../../features/hooks';
import { StompClientContext } from '../contexts/StompClientContext';

export const WebSocketRoutes = () => {
	const [stompClient, setStompClient] = useState(null);

	const API_URL = `${process.env.REACT_APP_API_URL}`;
	const notify = useNotify();

	const miniUserData = useSelector(state => state.profile.miniUserData);
	const dispatch = useDispatch();

	const onMessageReceived = useCallback(
		async payload => {
			const payloadData = JSON.parse(payload.body);
			const { response } = payloadData;

			switch (payloadData.messageActionType) {
				case 'SEND_MESSAGE':
					dispatch(getMessengerChat(response));
					dispatch(setNewMessage(response));
					dispatch(setLastMessage(response));

					// if (miniUserData.id !== response.user.id) {
					// 	notify({
					// 		title: response.user.username,
					// 		description: response.text.replace(/<[^>]*>/g, '').trim(),
					// 		img: response.user.avatar,
					// 		userId: response.user.id,
					// 	});
					// }

					break;

				case 'SEND_MUTED_MESSAGE':
					dispatch(getMessengerChat(response));
					dispatch(setNewMessage(response));
					dispatch(setLastMessage(response));
					break;

				case 'DRAFT':
					dispatch(setNewWSDraft(response));
					dispatch(setLastDraft(response));
					break;

				case 'EDIT_MESSAGE':
					dispatch(setNewEditedMessage(response));
					dispatch(setLastEditedMessage(response));
					break;

				case 'DELETE_MESSAGE':
					dispatch(deleteMessage(response));
					dispatch(getLastMessage(response));
					break;

				case 'MUTE_CHAT': {
					const data = {
						code: response.code,
						type: 'MUTE',
					};

					dispatch(toggleMute(data));
					dispatch(toggleChatMute(data));
					break;
				}

				case 'UNMUTE_CHAT': {
					const data = {
						code: response,
						type: 'UNMUTE',
					};

					dispatch(toggleMute(data));
					dispatch(toggleChatMute(data));
					break;
				}

				case 'MARK_AS_UNREAD': {
					const data = {
						code: response,
						type: 'MARK_AS_UNREAD',
					};

					dispatch(toggleMarkAsUnread(data));
					dispatch(toggleChatMarkAsUnread(data));
					break;
				}

				case 'MARK_AS_READ': {
					const data = {
						code: response,
						type: 'MARK_AS_READ',
					};

					dispatch(toggleMarkAsUnread(data));
					dispatch(toggleChatMarkAsUnread(data));
					break;
				}

				case 'CLEAR_HISTORY':
					dispatch(clearHistory(response));
					dispatch(getLastMessage({ code: response }));
					break;

				case 'DELETE_CHAT':
					dispatch(deleteChat(response));
					dispatch(deleteMessengerChat(response));
					break;

				default:
			}
		},
		[miniUserData.id, dispatch]
	);

	useEffect(() => {
		const socket = new SockJS(`${API_URL}/ws`);
		const client = over(socket, { reconnect_delay: 5000 });
		client.debug = false;

		const onConnected = () => {
			client.subscribe('/user/' + miniUserData.id + '/message', onMessageReceived);
			setStompClient(client);
		};

		client.connect({}, onConnected, err => console.log(err));

		const disconnect = () => {
			if (client !== null) client.disconnect();

			setStompClient(null);
		};

		return () => disconnect();
	}, [API_URL, miniUserData, dispatch, onMessageReceived]);

	return (
		<StompClientContext.Provider value={stompClient}>
			<Outlet />
		</StompClientContext.Provider>
	);
};
