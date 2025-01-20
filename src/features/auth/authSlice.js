import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from './authService';
import { thunk } from '../thunk';

import { setMiniUserDataUsername } from '../profile/profileSlice';

const initialState = {
	securityData: null,
	isError: false,
	isSuccess: false,
	isVerifySuccess: false,
	isDeleteSuccess: false,
	isLoading: false,
	isLoggedOut: false,
	isPasswordCorrect: false,
	message: null,
	codeMessage: null,
};

export const registerUser = createAsyncThunk('auth/registration', (user, thunkAPI) => {
	return thunk({ method: authService.register, data: user, thunkAPI });
});

export const activateUser = createAsyncThunk('auth/activate', (code, thunkAPI) => {
	return thunk({ method: authService.activate, data: code, thunkAPI });
});

export const loginUser = createAsyncThunk('auth/login', (user, thunkAPI) => {
	return thunk({ method: authService.login, data: user, thunkAPI });
});

export const changeUserEmail = createAsyncThunk('security/update-email', (data, thunkAPI) => {
	return thunk({ method: authService.changeEmail, data, thunkAPI });
});

export const verifyNewUserEmail = createAsyncThunk(
	'security/activate-new-email/:code',
	(data, thunkAPI) => {
		return thunk({ method: authService.verifyEmail, data, thunkAPI });
	}
);

export const changeUserUsername = createAsyncThunk(
	'security/update-username',
	async (data, thunkAPI) => {
		const responseData = await authService.changeUsername(data);
		if (!responseData.error) {
			thunkAPI.dispatch(setMiniUserDataUsername(responseData));
			return responseData;
		} else {
			return thunkAPI.rejectWithValue(responseData?.type);
		}
	}
);

export const getSecurityData = createAsyncThunk('api/update-user-data/security', thunkAPI => {
	return thunk({ method: authService.getSecurityData, thunkAPI });
});

export const changePassword = createAsyncThunk('security/reset-password', (data, thunkAPI) => {
	return thunk({ method: authService.resetProfilePassword, data, thunkAPI });
});

export const verifyPassword = createAsyncThunk('security/verify-password', (data, thunkAPI) => {
	return thunk({ method: authService.verifyPassword, data, thunkAPI });
});

export const userForgotPassword = createAsyncThunk(
	'auth/forgot-password',
	async (email, thunkAPI) => {
		return thunk({ method: authService.forgotPassword, data: email, thunkAPI });
	}
);

export const userResetPassword = createAsyncThunk('auth/reset-password', (data, thunkAPI) => {
	return thunk({ method: authService.resetPassword, data, thunkAPI });
});

export const logoutUser = createAsyncThunk('auth/logout', (jwt, thunkAPI) => {
	return thunk({ method: authService.logout, data: jwt, thunkAPI });
});

export const deleteAccount = createAsyncThunk('security/delete-forever', thunkAPI => {
	return thunk({ method: authService.deleteAccount, thunkAPI });
});

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		resetAuthData: state => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.isLoggedOut = false;
		},
		resetAuthError: state => {
			state.isError = false;
		},
		fullAuthReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(registerUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(registerUser.fulfilled, state => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})

			.addCase(activateUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(activateUser.fulfilled, state => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(activateUser.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(loginUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(getSecurityData.fulfilled, (state, action) => {
				state.securityData = action.payload;
			})

			.addCase(changeUserEmail.fulfilled, state => {
				state.isSuccess = true;
			})
			.addCase(changeUserEmail.rejected, state => {
				state.isError = true;
			})

			.addCase(verifyNewUserEmail.fulfilled, (state, action) => {
				state.securityData = { ...state.securityData, email: action.payload };
				state.isVerifySuccess = true;
			})
			.addCase(verifyNewUserEmail.rejected, state => {
				state.isError = true;
			})

			.addCase(changeUserUsername.fulfilled, (state, action) => {
				state.securityData = { ...state.securityData, username: action.payload };
				state.isSuccess = true;
			})
			.addCase(changeUserUsername.rejected, state => {
				state.isError = true;
			})

			.addCase(changePassword.fulfilled, (state, action) => {
				state.securityData = {
					...state.securityData,
					passwordHasBeenChanged: true,
					lastPasswordUpdate: action.payload,
				};
				state.isSuccess = true;
			})
			.addCase(changePassword.rejected, state => {
				state.isError = true;
			})

			.addCase(verifyPassword.fulfilled, state => {
				state.isSuccess = true;
				state.isPasswordCorrect = true;
			})
			.addCase(verifyPassword.rejected, (state, action) => {
				state.isError = true;
			})

			.addCase(userForgotPassword.pending, state => {
				state.isLoading = true;
			})
			.addCase(userForgotPassword.fulfilled, state => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(userForgotPassword.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(userResetPassword.pending, state => {
				state.isLoading = true;
			})
			.addCase(userResetPassword.fulfilled, state => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(userResetPassword.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(deleteAccount.fulfilled, state => {
				state.isDeleteSuccess = true;
			})

			.addCase(logoutUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(logoutUser.fulfilled, state => {
				state.isSuccess = true;
				state.isLoading = false;
				state.isLoggedOut = true;
			})
			.addCase(logoutUser.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	},
});

export const { resetAuthData, resetAuthError, fullAuthReset } = authSlice.actions;

export default authSlice.reducer;
