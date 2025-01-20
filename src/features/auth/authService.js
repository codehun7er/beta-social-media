import { toast } from 'react-toastify';

import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const register = async userData => {
	const response = await api({ url: `${API_URL}/auth/registration`, type: 'POST', body: userData });

	if (!response.data.error) {
		toast.warn('Activate your account! You have only 15 minutes!');
		toast.success('You have successfully registered');
	}

	return response.data;
};

const login = async userData => {
	const response = await api({
		url: `${API_URL}/auth/login`,
		type: 'POST',
		body: userData,
	});

	if (!response.data.error) localStorage.setItem('lo_uuid', response.data);

	return response.data;
};

const activate = async code => {
	const response = await api({ url: `${API_URL}/auth/activate?code=${code}` });

	if (!response.data.error) toast.success('You have successfully activated your account.');

	return response.data;
};

const changeEmail = async email => {
	const response = await api({
		url: `${API_URL}/api/security/update-email`,
		type: 'PUT',
		body: email,
	});

	return response.data;
};

const verifyEmail = async code => {
	const response = await api({
		url: `${API_URL}/api/security/activate-new-email?code=${code}`,
	});

	return response.data;
};

const changeUsername = async username => {
	const response = await api({
		url: `${API_URL}/security/update-username`,
		type: 'PUT',
		body: username,
	});

	return response.data;
};

const getSecurityData = async () => {
	const response = await api({ url: `${API_URL}/update-user-data/security` });

	return response.data;
};

const forgotPassword = async email => {
	const response = await api({ url: `${API_URL}/auth/forgot-password`, type: 'POST', body: email });

	if (!response.data.error) toast.warn('Link has been sent to your email');

	return response.data;
};

const resetProfilePassword = async data => {
	const response = await api({
		url: `${API_URL}/security/reset-password`,
		type: 'PUT',
		body: data,
	});

	return response.data;
};

const verifyPassword = async data => {
	const response = await api({
		url: `${API_URL}/security/verify-password`,
		type: 'POST',
		body: data,
	});

	return response.data;
};

const resetPassword = async data => {
	const response = await api({ url: `${API_URL}/auth/forgot-password`, type: 'PUT', body: data });

	if (!response.data.error) toast.success('Your password has been successfully changed');

	return response.data;
};

const logout = async () => {
	const response = await api({ url: `${API_URL}/auth/logout`, type: 'POST' });

	if (!response.data.error) localStorage.removeItem('lo_uuid');

	return response.data;
};

const getNewTokens = async () => {
	await api({ url: `${API_URL}/auth/refresh-token`, type: 'POST' });
};

const deleteAccount = async () => {
	const response = await api({ url: `${API_URL}/security/delete-forever`, type: 'DELETE' });

	return response.data;
};

const authService = {
	register,
	activate,
	login,
	changeEmail,
	verifyPassword,
	verifyEmail,
	changeUsername,
	getSecurityData,
	resetProfilePassword,
	forgotPassword,
	resetPassword,
	logout,
	getNewTokens,
	deleteAccount,
};

export default authService;
