import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { likePost } from '../posts/postsSlice';

import { thunk } from '../thunk';
import explorerService from './explorerService';

const initialState = {
	randomUsersData: { currentPage: 0, totalPage: 0, content: [] },
	searchedUsers: { currentPage: 0, totalPage: 0, content: [] },
	randomPostsData: { currentPage: 0, totalPage: 0, content: [] },
	searchedPosts: { currentPage: 0, totalPage: 0, content: [] },
	searchValue: '',
	isDataLoaded: {
		users: false,
		posts: false,
	},
	currentScrollTop: {
		users: 0,
		posts: 0,
	},
	isPageLoading: false,
	isLoading: false,
};

export const explorerGetRandomUsers = createAsyncThunk('users/random', thunkAPI => {
	return thunk({ method: explorerService.getRandomUsers, thunkAPI });
});

export const explorerSearchUsers = createAsyncThunk('search/users', (data, thunkAPI) => {
	return thunk({ method: explorerService.searchUsers, data, thunkAPI });
});

export const explorerSearchUsersPage = createAsyncThunk('search/users?page', (data, thunkAPI) => {
	return thunk({ method: explorerService.searchUsersPage, data, thunkAPI });
});

export const explorerFollowUser = createAsyncThunk('search/users/follow/:id', (id, thunkAPI) => {
	return thunk({ method: explorerService.followUser, data: id, thunkAPI });
});

export const explorerUnfollowUser = createAsyncThunk(
	'search/users/unfollow/:id',
	(id, thunkAPI) => {
		return thunk({ method: explorerService.unfollowUser, data: id, thunkAPI });
	}
);

export const explorerGetRandomPosts = createAsyncThunk('posts/random', (data, thunkAPI) => {
	return thunk({ method: explorerService.getRandomPosts, data, thunkAPI });
});

export const explorerSearchPosts = createAsyncThunk('search/posts', (data, thunkAPI) => {
	return thunk({ method: explorerService.searchPosts, data, thunkAPI });
});

export const explorerSlice = createSlice({
	name: 'explorer',
	initialState,
	reducers: {
		setSearchValue: (state, action) => {
			state.searchValue = action.payload;
		},
		setIsDataLoaded: (state, action) => {
			if (action.payload === 'ALL') {
				state.isDataLoaded = {
					users: false,
					posts: false,
					articles: false,
					collabs: false,
				};
			} else {
				state.isDataLoaded = { ...state.isDataLoaded, [action.payload]: true };
			}
		},
		setScrollTop: (state, action) => {
			state.currentScrollTop = {
				...state.currentScrollTop,
				[action.payload.type]: action.payload.value,
			};
		},
		fullExplorerReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(explorerGetRandomUsers.fulfilled, (state, action) => {
				state.randomUsersData = action.payload;
			})
			.addCase(explorerSearchUsers.fulfilled, (state, action) => {
				state.searchedUsers = action.payload;
			})
			.addCase(explorerSearchUsersPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(explorerSearchUsersPage.fulfilled, (state, action) => {
				state.searchedUsers = {
					content: [...state.searchedUsers.content, ...action.payload.content],
					currentPage: action.payload.currentPage,
					totalPage: action.payload.totalPage,
				};
				state.isPageLoading = false;
			})
			.addCase(explorerSearchUsersPage.rejected, state => {
				state.isPageLoading = false;
			})
			.addCase(explorerFollowUser.fulfilled, (state, action) => {
				const { randomUsersData, searchedUsers } = state;

				state.randomUsersData.content = randomUsersData.content.map(user => {
					if (user.id === action.payload) {
						return { ...user, following: true };
					}

					return user;
				});

				state.searchedUsers.content = searchedUsers.content.map(user => {
					if (user.id === action.payload) {
						return { ...user, following: true };
					}

					return user;
				});
			})
			.addCase(explorerUnfollowUser.fulfilled, (state, action) => {
				const { randomUsersData, searchedUsers } = state;

				state.randomUsersData.content = randomUsersData.content.map(user => {
					if (user.id === action.payload) {
						return { ...user, following: false };
					}

					return user;
				});

				state.searchedUsers.content = searchedUsers.content.map(user => {
					if (user.id === action.payload) {
						return { ...user, following: false };
					}

					return user;
				});
			})

			.addCase(explorerGetRandomPosts.fulfilled, (state, action) => {
				state.randomPostsData = action.payload;
			})

			.addCase(explorerSearchPosts.fulfilled, (state, action) => {
				state.searchedPosts = action.payload;
			})

			.addCase(likePost.fulfilled, (state, action) => {
				state.randomPostsData.content = state.randomPostsData.content.map(post => {
					if (post.id === action.payload.id) {
						return {
							...post,
							liked: action.payload.liked,
							countOfLikes: action.payload.countOfLikes,
						};
					}

					return post;
				});

				state.searchedPosts.content = state.searchedPosts.content.map(post => {
					if (post.id === action.payload.id) {
						return {
							...post,
							liked: action.payload.liked,
							countOfLikes: action.payload.countOfLikes,
						};
					}

					return post;
				});
			});
	},
});

export const { setIsDataLoaded, setSearchValue, setScrollTop, fullExplorerReset } =
	explorerSlice.actions;

export default explorerSlice.reducer;
