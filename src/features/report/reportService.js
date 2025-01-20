import { api } from '../api';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const report = async data => {
	const response = await api({ url: `${API_URL}/report`, type: 'POST', body: data });

	return response.data;
};

const reportService = {
	report,
};

export default reportService;
