import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const getAllFeedPosts = async () => {
	const response = await api({ url: `${API_URL}/feed/all/posts` });

	return response.data;
};

const getAllFeedPostsPage = async page => {
	const response = await api({ url: `${API_URL}/feed/all/posts?page=${page}` });

	return response.data;
};

const getNewsPosts = async () => {
	const response = await api({ url: `${API_URL}/feed/news/posts` });

	return response.data;
};

const getNewsPostsPage = async page => {
	const response = await api({ url: `${API_URL}/feed/news/posts?page${page}` });

	return response.data;
};

const feedService = {
	getAllFeedPosts,
	getAllFeedPostsPage,
	getNewsPosts,
	getNewsPostsPage,
};

export default feedService;
