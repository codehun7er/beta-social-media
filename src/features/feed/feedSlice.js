import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feedService from './feedService';
import { thunk } from '../thunk';
import { createPost, deletePost, likePost, updatePost } from '../posts/postsSlice';
import { deleteUserPost } from '../admin/adminSlice';

const initialState = {
	allPostsData: [],
	allPostsDataPage: null,
	followingPostsData: [],
	followingPostsDataPage: null,
	isLoading: false,
	isSuccess: false,
	isError: false,
	isPageLoading: false,
};

export const getAllFeedPosts = createAsyncThunk('feed/all/posts', thunkAPI => {
	return thunk({ method: feedService.getAllFeedPosts, thunkAPI });
});

export const getAllFeedPostsPage = createAsyncThunk('feed/all/posts?page', (data, thunkAPI) => {
	return thunk({ method: feedService.getAllFeedPostsPage, data, thunkAPI });
});

export const getFollowingPosts = createAsyncThunk('feed/news/posts', thunkAPI => {
	return thunk({ method: feedService.getNewsPosts, thunkAPI });
});

export const getFollowingPostsPage = createAsyncThunk('feed/news/posts?page', (data, thunkAPI) => {
	return thunk({ method: feedService.getNewsPostsPage, data, thunkAPI });
});

export const feedSlice = createSlice({
	name: 'feed',
	initialState,
	reducers: {
		fullFeedReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(getAllFeedPosts.pending, state => {
				state.isLoading = true;
			})
			.addCase(getAllFeedPosts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.allPostsData = action.payload.content;
				state.allPostsDataPage = {
					currentPage: action.payload.currentPage,
					totalPage: action.payload.totalPage,
				};
			})
			.addCase(getAllFeedPosts.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(getAllFeedPostsPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getAllFeedPostsPage.fulfilled, (state, action) => {
				state.isPageLoading = false;
				state.allPostsData = [...state.allPostsData, ...action.payload.content];
				state.allPostsDataPage = {
					currentPage: action.payload.currentPage,
					totalPage: action.payload.totalPage,
				};
			})
			.addCase(getAllFeedPostsPage.rejected, state => {
				state.isPageLoading = false;
			})

			.addCase(getFollowingPosts.pending, state => {
				state.isLoading = true;
			})
			.addCase(getFollowingPosts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.followingPostsData = action.payload.content;
				state.followingPostsDataPage = {
					currentPage: action.payload.currentPage,
					totalPage: action.payload.totalPage,
				};
			})
			.addCase(getFollowingPosts.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(getFollowingPostsPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getFollowingPostsPage.fulfilled, (state, action) => {
				state.isPageLoading = false;
				state.followingPostsData = [...state.followingPostsData, ...action.payload.content];
				state.followingPostsDataPage = {
					currentPage: action.payload.currentPage,
					totalPage: action.payload.totalPage,
				};
			})
			.addCase(getFollowingPostsPage.rejected, state => {
				state.isPageLoading = false;
			})

			.addCase(createPost.fulfilled, (state, action) => {
				state.allPostsData = [action.payload, ...state.allPostsData];
				state.followingPostsData = [action.payload, ...state.followingPostsData];
			})

			.addCase(likePost.fulfilled, (state, action) => {
				state.allPostsData = state.allPostsData.map(post => {
					if (post.id === action.payload.id) {
						return {
							...post,
							liked: action.payload.liked,
							countOfLikes: action.payload.countOfLikes,
						};
					}

					return post;
				});

				state.followingPostsData = state.followingPostsData.map(post => {
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

			.addCase(updatePost.fulfilled, (state, action) => {
				state.allPostsData = state.allPostsData.map(post => {
					if (post.id === action.payload.id) {
						return {
							...post,
							text: action.payload.text,
						};
					}

					return post;
				});

				state.followingPostsData = state.followingPostsData.map(post => {
					if (post.id === action.payload) {
						return {
							...post,
							text: action.payload.text,
						};
					}

					return post;
				});
			})

			.addCase(deletePost.fulfilled, (state, action) => {
				state.allPostsData = state.allPostsData.filter(post => post.id !== action.payload);
			})

			.addCase(deleteUserPost.fulfilled, (state, action) => {
				state.allPostsData = state.allPostsData.filter(post => post.id !== action.payload);
			});
	},
});

export const { fullFeedReset } = feedSlice.actions;

export default feedSlice.reducer;
