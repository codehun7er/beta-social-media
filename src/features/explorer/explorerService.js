import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const getRandomUsers = async () => {
	const response = await api({ url: `${API_URL}/users/random` });

	return response.data;
};

const searchUsers = async value => {
	const response = await api({ url: `${API_URL}/search/users?request=${value}` });

	return response.data;
};

const searchUsersPage = async data => {
	const response = await api({
		url: `${API_URL}/search/users?request=${data.request}&page=${data.page}`,
	});

	return response.data;
};

const followUser = async id => {
	const response = await api({ url: `${API_URL}/search/users/follow/${id}`, type: 'PUT' });

	return response.data;
};

const unfollowUser = async id => {
	const response = await api({ url: `${API_URL}/search/users/unfollow/${id}`, type: 'DELETE' });

	return response.data;
};

const getRandomPosts = async () => {
	const response = await api({ url: `${API_URL}/posts/random` });

	return response.data;
};

const searchPosts = async value => {
	const response = await api({ url: `${API_URL}/search/posts?request=${value}` });

	return response.data;
};

const explorerService = {
	getRandomUsers,
	searchUsers,
	followUser,
	unfollowUser,
	searchUsersPage,
	getRandomPosts,
	searchPosts,
};

export default explorerService;
