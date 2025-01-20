import axios from 'axios';
import Cookies from 'js-cookie';

import authService from './auth/authService';

const instance = axios.create({
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

instance.interceptors.response.use(async response => {
	const originalRequest = response.config;

	if (
		response.data.error === 'Full authentication is required to access this resource' &&
		response.data.status === 401 &&
		!originalRequest._isRetry
	) {
		originalRequest._isRetry = true;
		await authService.getNewTokens();
		const originalResponse = await instance.request(originalRequest);
		if (originalResponse.data.error && originalResponse.data.status === 401) {
			await authService.logout();
			return;
		}

		return originalResponse;
	}

	return response;
});

export const api = async ({ url, type = 'GET', file = false, body, blob = false }) => {
	let response;

	if (type !== 'GET') {
		instance.defaults.headers.common['X-CSRF-Token'] = Cookies.get('XSRF-TOKEN');
	}

	if (file) {
		instance.defaults.headers['Content-Type'] = 'multipart/form-data';
	} else {
		instance.defaults.headers['Content-Type'] = 'application/json';
	}

	if (blob) {
		instance.defaults.responseType = 'blob';
	} else {
		instance.defaults.responseType = undefined;
	}

	try {
		switch (type) {
			case 'GET':
			default:
				response = await instance.get(url);
				return response;
			case 'POST':
				response = await instance.post(url, body);
				return response;
			case 'PUT':
				response = await instance.put(url, body);
				return response;
			case 'DELETE':
				response = await instance.delete(url, body);
				return response;
		}
	} catch (error) {
		throw error.response.data;
	}
};

export default instance;
