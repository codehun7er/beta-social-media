import { toast } from 'react-toastify';

export const thunk = async ({ method, data, thunkAPI }) => {
	const responseData = await method(data);
	if (!responseData.error) {
		return responseData;
	} else {
		toast.error(responseData.error);
		return thunkAPI.rejectWithValue(responseData?.type);
	}
};
