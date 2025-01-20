import { api } from '../api';
import { v4 as uuid } from 'uuid';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const getData = async code => {
	const response = await api({ url: `${API_URL}/messenger/chat/${code}` });

	return response.data;
};

const getPage = async data => {
	const response = await api({
		url: `${API_URL}/messenger/${data.currentChatCode}?page=${data.currentPage}&lastMessageId=${data.lastMessageId}`,
	});

	return response.data;
};

const collectionMaker = (messages, originalCode) => {
	let messageCollections = [];
	let collection = {};

	if (messages.length > 1) {
		for (let i = 0; i < messages.length; i++) {
			if (i === 0) {
				const id = uuid();

				collection = {
					user: messages[i]?.user,
					originalCode: originalCode,
					id,
					messages: [{ ...messages[i], lastInCollection: true }],
				};

				continue;
			}

			const lastMsgOfColl = collection.messages[collection.messages.length - 1];
			const payloadDate = new Date(messages[i].sendingTime);
			const messageDate = new Date(lastMsgOfColl.sendingTime);
			const diffMs = messageDate - payloadDate;
			const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

			if (collection?.user.id === messages[i].user.id && diffMins < 10) {
				collection = { ...collection, messages: [...collection.messages, messages[i]] };
			} else {
				const id = uuid();

				collection.messages[collection.messages.length - 1].firstInCollection = true;

				messageCollections = [
					...messageCollections,
					{ ...collection, messages: [...collection.messages].reverse() },
				];
				collection = {
					...collection,
					messages: [{ ...messages[i], lastInCollection: true }],
					user: messages[i]?.user,
					id,
				};
			}

			if (i === messages.length - 1) {
				collection.messages[collection.messages.length - 1].firstInCollection = true;

				messageCollections = [
					...messageCollections,
					{ ...collection, messages: [...collection.messages].reverse() },
				];
			}
		}
	} else if (messages.length === 1) {
		const id = uuid();

		messageCollections = [
			{
				id,
				messages: [{ ...messages[0], firstInCollection: true, lastInCollection: true }],
				user: messages[0]?.user,
				originalCode,
			},
		];
	}

	return messageCollections.reverse();
};

const chatService = {
	getData,
	getPage,
	collectionMaker,
};

export default chatService;
