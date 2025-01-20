import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const createPost = async data => {
	const response = await api({ url: `${API_URL}/posts`, type: 'POST', body: data, file: true });

	return response.data;
};

const getPost = async id => {
	const response = await api({ url: `${API_URL}/posts/${id}` });

	return response.data;
};

const likePost = async id => {
	const response = await api({ url: `${API_URL}/posts/${id}/like`, type: 'PUT' });

	return response.data;
};

const updatePost = async data => {
	const response = await api({
		url: `${API_URL}/posts/${data.id}`,
		type: 'PUT',
		body: data.content,
		file: true,
	});

	return response.data;
};

const deletePost = async id => {
	const response = await api({ url: `${API_URL}/posts/${id}`, type: 'DELETE' });

	return response.data;
};

const createComment = async data => {
	const response = await api({ url: `${API_URL}/comments`, type: 'POST', body: data, file: true });

	return response.data;
};

const likeComment = async id => {
	const response = await api({ url: `${API_URL}/comments/like/${id}`, type: 'PUT' });

	return response.data;
};

const updateComment = async data => {
	const response = await api({
		url: `${API_URL}/comments/${data.id}`,
		type: 'PUT',
		body: data.content,
		file: true,
	});

	return response.data;
};

const getCommentsPage = async data => {
	const response = await api({ url: `${API_URL}/comments/${data.id}?page=${data.page}` });

	return response.data;
};

const deleteComment = async id => {
	const response = await api({ url: `${API_URL}/comments/${id}`, type: 'DELETE' });

	return response.data;
};

const postsService = {
	createPost,
	getPost,
	likePost,
	updatePost,
	deletePost,
	createComment,
	likeComment,
	updateComment,
	getCommentsPage,
	deleteComment,
};

export default postsService;
