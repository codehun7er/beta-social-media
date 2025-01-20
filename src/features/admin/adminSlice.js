import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { thunk } from '../thunk';
import adminService from './adminService';

const initialState = {
	reportsData: [],
};

export const getAdminReports = createAsyncThunk('admin/reports', thunkAPI => {
	return thunk({ method: adminService.getReports, thunkAPI });
});

export const deleteReport = createAsyncThunk('admin/report/delete', (data, thunkAPI) => {
	return thunk({ method: adminService.deleteReport, data, thunkAPI });
});

export const deleteUserComment = createAsyncThunk('admin/comment/delete', (data, thunkAPI) => {
	return thunk({ method: adminService.deleteUserComment, data, thunkAPI });
});

export const deleteUserPost = createAsyncThunk('admin/post/delete', (data, thunkAPI) => {
	return thunk({ method: adminService.deleteUserPost, data, thunkAPI });
});

export const deleteUserByAdmin = createAsyncThunk('admin/user/delete', (data, thunkAPI) => {
	return thunk({ method: adminService.deleteUserByAdmin, data, thunkAPI });
});

export const deleteUserAvatarByAdmin = createAsyncThunk('admin/avatar/delete', (data, thunkAPI) => {
	return thunk({ method: adminService.deleteUserAvatarByAdmin, data, thunkAPI });
});

export const deleteUserCoverByAdmin = createAsyncThunk('admin/cover/delete', (data, thunkAPI) => {
	return thunk({ method: adminService.deleteUserCoverByAdmin, data, thunkAPI });
});

export const adminSlice = createSlice({
	name: 'admin',
	initialState,
	reducers: {
		fullAdminReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(getAdminReports.fulfilled, (state, actions) => {
				state.reportsData = actions.payload;
			})
			.addCase(deleteReport.fulfilled, (state, action) => {
				state.reportsData.content = state.reportsData.content.filter(
					report => report.id !== action.payload
				);
			});
	},
});

export const { fullAdminReset } = adminSlice.actions;

export default adminSlice.reducer;
