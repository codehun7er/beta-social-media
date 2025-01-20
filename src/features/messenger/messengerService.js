import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

export const getChats = async () => {
	const response = await api({ url: `${API_URL}/messenger` });

	return response.data;
};

export const getChatsPage = async data => {
	const response = await api({ url: `${API_URL}/messenger?page=${data}` });

	return response.data;
};

export const getSingleChat = async data => {
	const response = await api({ url: `${API_URL}/messenger/chat-data/${data.originalCode}` });

	return response.data;
};

export const searchForChats = async data => {
	const response = await api({
		url: `${API_URL}/search/messenger/chats?request=${data}`,
	});

	return response.data;
};

export const getSearchForChatsPage = async data => {
	const response = await api({
		url: `${API_URL}/search/messenger/chats?request=${data.request}&page=${data.page}`,
	});

	return response.data;
};
