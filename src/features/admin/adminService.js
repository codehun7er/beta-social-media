import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin`;

const getReports = async () => {
	const response = await api({ url: `${API_URL}/reports` });

	return response.data;
};

const deleteReport = async id => {
	const response = await api({ url: `${API_URL}/reports/${id}`, type: 'DELETE' });

	return response.data;
};

const deleteUserComment = async id => {
	const response = await api({ url: `${API_URL}/comments/${id}`, type: 'DELETE' });

	return response.data;
};

const deleteUserPost = async id => {
	const response = await api({ url: `${API_URL}/posts/${id}`, type: 'DELETE' });

	return response.data;
};

const deleteUserByAdmin = async id => {
	const response = await api({ url: `${API_URL}/users/${id}`, type: 'DELETE' });

	return response.data;
};

const deleteUserAvatarByAdmin = async id => {
	const response = await api({ url: `${API_URL}/users/${id}/avatar`, type: 'DELETE' });

	return response.data;
};

const deleteUserCoverByAdmin = async id => {
	const response = await api({ url: `${API_URL}/users/${id}/cover`, type: 'DELETE' });

	return response.data;
};

const adminService = {
	getReports,
	deleteReport,
	deleteUserComment,
	deleteUserPost,
	deleteUserByAdmin,
	deleteUserAvatarByAdmin,
	deleteUserCoverByAdmin,
};

export default adminService;
