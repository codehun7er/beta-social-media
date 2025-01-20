import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const getUser = async () => {
	const response = await api({ url: `${API_URL}/users/current-user` });

	return response.data;
};

const getProfile = async id => {
	const response = await api({ url: `${API_URL}/users/${id}` });

	return response.data;
};

const uploadAvatar = async img => {
	const response = await api({
		url: `${API_URL}/users/avatar`,
		type: 'PUT',
		body: img,
		file: true,
	});

	return response.data;
};

const uploadCover = async img => {
	const response = await api({
		url: `${API_URL}/users/cover`,
		type: 'PUT',
		body: img,
		file: true,
	});

	return response.data;
};

const deleteAvatar = async () => {
	const response = await api({
		url: `${API_URL}/users/avatar`,
		type: 'DELETE',
	});

	return response.data;
};

const deleteCover = async () => {
	const response = await api({
		url: `${API_URL}/users/cover`,
		type: 'DELETE',
	});

	return response.data;
};

const saveInfo = async data => {
	const response = await api({
		url: `${API_URL}/users`,
		body: data,
		type: 'PUT',
	});

	return response.data;
};

const follow = async data => {
	const response = await api({
		url: `${API_URL}/users/follow/${data}`,
		type: 'PUT',
	});

	return response.data;
};

const unfollow = async data => {
	const response = await api({
		url: `${API_URL}/users/unfollow/${data}`,
		type: 'DELETE',
	});

	return response.data;
};

const getFollowers = async data => {
	const response = await api({ url: `${API_URL}/users/${data.id}/followers?page=${data.page}` });

	return response.data;
};

const getFollowing = async data => {
	const response = await api({ url: `${API_URL}/users/${data.id}/following?page=${data.page}` });

	return response.data;
};

const getPostsPage = async data => {
	const response = await api({ url: `${API_URL}/users/${data.id}/posts?page=${data.page}` });

	return response.data;
};

const uploadCV = async data => {
	const response = await api({ url: `${API_URL}/users/cv`, type: 'PUT', file: true, body: data });

	return response.data;
};

export const downloadCV = async data => {
	const response = await api({
		url: `${process.env.REACT_APP_API_URL}/files/download?filename=${data}`,
		blob: true,
	});

	return response.data;
};

const deleteCV = async () => {
	const response = await api({ url: `${API_URL}/users/cv`, type: 'DELETE' });

	return response.data;
};

const profileService = {
	getUser,
	getProfile,
	uploadAvatar,
	uploadCover,
	deleteAvatar,
	deleteCover,
	saveInfo,
	follow,
	unfollow,
	getFollowers,
	getFollowing,
	getPostsPage,
	uploadCV,
	deleteCV,
};

export default profileService;
