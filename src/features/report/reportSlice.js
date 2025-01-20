import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { thunk } from '../thunk';
import reportService from './reportService';

const initialState = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	reportModalData: { show: false, id: null, type: null },
};

export const report = createAsyncThunk('report', (data, thunkAPI) => {
	return thunk({ method: reportService.report, data, thunkAPI });
});

export const reportSlice = createSlice({
	name: 'report',
	initialState,
	reducers: {
		setReportModalData: (state, action) => {
			state.reportModalData = action.payload;
		},
		setReportModalDataShow: (state, action) => {
			state.reportModalData.show = action.payload;
		},
		fullReportReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(report.pending, state => {
				state.isLoading = true;
			})
			.addCase(report.fulfilled, state => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(report.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	},
});

export const { setReportModalData, setReportModalDataShow, fullReportReset } = reportSlice.actions;

export default reportSlice.reducer;
