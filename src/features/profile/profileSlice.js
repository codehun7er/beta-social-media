import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createPost, deletePost, likePost, updatePost } from '../posts/postsSlice';
import { thunk } from '../thunk';
import profileService from './profileService';

const initialState = {
	miniUserData: null,
	isAdmin: false,
	userData: null,
	postsData: { content: [] },
	articlesData: null,
	questionsData: null,
	followersData: null,
	followingData: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	isPageLoading: false,
};

export const getUserInitialProfile = createAsyncThunk('users/current-user', thunkAPI => {
	return thunk({ method: profileService.getUser, thunkAPI });
});

export const getUserProfile = createAsyncThunk('users/:id', (id, thunkAPI) => {
	return thunk({ method: profileService.getProfile, data: id, thunkAPI });
});

export const uploadProfileAvatar = createAsyncThunk('users/avatar', (img, thunkAPI) => {
	return thunk({ method: profileService.uploadAvatar, data: img, thunkAPI });
});

export const uploadProfileCover = createAsyncThunk('users/cover', (img, thunkAPI) => {
	return thunk({ method: profileService.uploadCover, data: img, thunkAPI });
});

export const deleteProfileAvatar = createAsyncThunk('users/avatar-delete', thunkAPI => {
	return thunk({ method: profileService.deleteAvatar, thunkAPI });
});

export const deleteProfileCover = createAsyncThunk('users/cover-delete', thunkAPI => {
	return thunk({ method: profileService.deleteCover, thunkAPI });
});

export const saveProfileInfo = createAsyncThunk('users', (data, thunkAPI) => {
	return thunk({ method: profileService.saveInfo, data, thunkAPI });
});

export const followProfile = createAsyncThunk('profile/users/follow/:id', (data, thunkAPI) => {
	return thunk({ method: profileService.follow, data, thunkAPI });
});

export const unfollowProfile = createAsyncThunk('profile/users/unfollow/:id', (data, thunkAPI) => {
	return thunk({ method: profileService.unfollow, data, thunkAPI });
});

export const getFollowersPage = createAsyncThunk(
	'users/:id/followers?page=:page',
	(data, thunkAPI) => {
		return thunk({ method: profileService.getFollowers, data, thunkAPI });
	}
);

export const getFollowingPage = createAsyncThunk(
	'users/:id/following?page=:page',
	(data, thunkAPI) => {
		return thunk({ method: profileService.getFollowing, data, thunkAPI });
	}
);

export const getUserPostsPage = createAsyncThunk('users/:id/posts?page=:page', (data, thunkAPI) => {
	return thunk({ method: profileService.getPostsPage, data, thunkAPI });
});

export const uploadUserCV = createAsyncThunk('upload/users/CV', (data, thunkAPI) => {
	return thunk({ method: profileService.uploadCV, data, thunkAPI });
});

export const deleteUserCV = createAsyncThunk('delete/user/CV', thunkAPI => {
	return thunk({ method: profileService.deleteCV, thunkAPI });
});

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setMiniUserDataUsername: (state, action) => {
			state.miniUserData = { ...state.miniUserData, username: action.payload };
		},
		resetProfileData: state => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
		},
		hardProfileDataReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(getUserInitialProfile.pending, state => {
				state.isLoading = true;
			})
			.addCase(getUserInitialProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.miniUserData = action.payload;
				state.isAdmin = !!action.payload.roles.find(role => role.name === 'ROLE_ADMIN');
			})
			.addCase(getUserInitialProfile.rejected, state => {
				state.isLoading = false;
				state.isError = false;
				state.miniUserData = null;
			})

			.addCase(getUserProfile.pending, state => {
				state.isLoading = true;
			})
			.addCase(getUserProfile.fulfilled, (state, action) => {
				const { payload } = action;
				const { userData, posts, articles, questions, followers, following } = payload;

				state.isLoading = false;
				state.isSuccess = true;
				state.userData = userData;
				state.postsData = posts;
				state.articlesData = articles;
				state.questionsData = questions;
				state.followersData = followers;
				state.followingData = following;
			})
			.addCase(getUserProfile.rejected, state => {
				state.isLoading = false;
				state.isError = true;
				state.userData = null;
				state.postsData = null;
				state.articlesData = null;
				state.questionsData = null;
				state.followersData = null;
				state.followingData = null;
			})

			.addCase(uploadProfileAvatar.pending, state => {
				state.isLoading = true;
			})
			.addCase(uploadProfileAvatar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.userData.hasAvatar = true;
				state.userData.avatar = action.payload;
				state.miniUserData.avatar = action.payload;
			})
			.addCase(uploadProfileAvatar.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(uploadProfileCover.pending, state => {
				state.isLoading = true;
			})
			.addCase(uploadProfileCover.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.userData.hasCover = true;
				state.userData.cover = action.payload;
			})
			.addCase(uploadProfileCover.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(deleteProfileAvatar.pending, state => {
				state.isLoading = true;
			})
			.addCase(deleteProfileAvatar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.userData.hasAvatar = false;
				state.userData.avatar = action.payload;
				state.miniUserData.avatar = action.payload;
			})
			.addCase(deleteProfileAvatar.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(deleteProfileCover.pending, state => {
				state.isLoading = true;
			})
			.addCase(deleteProfileCover.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.userData.hasCover = false;
				state.userData.cover = action.payload;
			})
			.addCase(deleteProfileCover.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(saveProfileInfo.fulfilled, (state, action) => {
				state.userData = action.payload;
			})

			.addCase(followProfile.fulfilled, (state, action) => {
				const { userData } = state;

				state.userData = {
					...userData,
					countOfFollowers: userData.countOfFollowers + 1,
					following: true,
				};
				state.followersData = action.payload;
			})

			.addCase(unfollowProfile.fulfilled, (state, action) => {
				const { userData } = state;

				state.userData = {
					...userData,
					countOfFollowers: userData.countOfFollowers - 1,
					following: false,
				};
				state.followersData = action.payload;
			})

			.addCase(getFollowersPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getFollowersPage.fulfilled, (state, action) => {
				state.followersData.content = [...state.followersData.content, ...action.payload.content];
				state.followersData.currentPage = action.payload.currentPage;
				state.isPageLoading = false;
			})
			.addCase(getFollowersPage.rejected, state => {
				state.isPageLoading = false;
			})

			.addCase(getFollowingPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getFollowingPage.fulfilled, (state, action) => {
				state.followingData.content = [...state.followingData.content, ...action.payload.content];
				state.followingData.currentPage = action.payload.currentPage;
				state.isPageLoading = false;
			})
			.addCase(getFollowingPage.rejected, state => {
				state.isPageLoading = false;
			})

			.addCase(createPost.fulfilled, (state, action) => {
				state.postsData.content = [action.payload, ...state.postsData.content];
			})

			.addCase(updatePost.fulfilled, (state, action) => {
				state.postsData.content = state.postsData.content.map(post => {
					if (post.id === action.payload.id) {
						return { ...post, text: action.payload.text };
					}

					return post;
				});
			})

			.addCase(likePost.fulfilled, (state, action) => {
				state.postsData.content = state.postsData.content.map(post => {
					if (post.id === action.payload.id) {
						return {
							...post,
							liked: action.payload.liked,
							countOfLikes: action.payload.countOfLikes,
						};
					}

					return post;
				});
			})

			.addCase(deletePost.fulfilled, (state, action) => {
				state.postsData.content = state.postsData.content.filter(
					post => post.id !== action.payload
				);
			})

			.addCase(getUserPostsPage.pending, state => {
				state.isPageLoading = false;
			})
			.addCase(getUserPostsPage.fulfilled, (state, action) => {
				state.postsData.content = [...state.postsData.content, ...action.payload.content];
				state.postsData.currentPage = action.payload.currentPage;
				state.postsData.totalPage = action.payload.totalPage;
			})

			.addCase(uploadUserCV.fulfilled, (state, action) => {
				state.userData.hasCV = true;
				state.userData.cv = action.payload;
			})

			.addCase(deleteUserCV.fulfilled, state => {
				state.userData.hasCV = false;
				state.userData.cv = null;
			});
	},
});

export const {
	setMiniUserDataUsername,
	resetProfileData,
	increaseCountOfPostLikes,
	decreaseCountOfPostLikes,
	hardProfileDataReset,
} = profileSlice.actions;

export default profileSlice.reducer;
