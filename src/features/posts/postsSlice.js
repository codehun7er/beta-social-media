import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postsService from './postsService';
import { thunk } from '../thunk';
import { deleteUserComment } from '../admin/adminSlice';

const initialState = {
	postData: null,
	comments: null,
	isLoading: false,
	isSuccess: false,
	isError: false,
	isPageLoading: false,
};

export const createPost = createAsyncThunk('create/posts', (data, thunkAPI) => {
	return thunk({ method: postsService.createPost, data, thunkAPI });
});

export const getPost = createAsyncThunk('posts/:id', (data, thunkAPI) => {
	return thunk({ method: postsService.getPost, data, thunkAPI });
});

export const likePost = createAsyncThunk('posts/:id/like', (data, thunkAPI) => {
	return thunk({ method: postsService.likePost, data, thunkAPI });
});

export const updatePost = createAsyncThunk('update/posts/:id', (data, thunkAPI) => {
	return thunk({ method: postsService.updatePost, data, thunkAPI });
});

export const deletePost = createAsyncThunk('delete/posts/:id', (data, thunkAPI) => {
	return thunk({ method: postsService.deletePost, data, thunkAPI });
});

export const createComment = createAsyncThunk('create/comments', (data, thunkAPI) => {
	return thunk({ method: postsService.createComment, data, thunkAPI });
});

export const likeComment = createAsyncThunk('comments/like/:id', (data, thunkAPI) => {
	return thunk({ method: postsService.likeComment, data, thunkAPI });
});

export const updateComment = createAsyncThunk('comments/:id', (data, thunkAPI) => {
	return thunk({ method: postsService.updateComment, data, thunkAPI });
});

export const getCommentsPage = createAsyncThunk('comments/:id?page', (data, thunkAPI) => {
	return thunk({ method: postsService.getCommentsPage, data, thunkAPI });
});

export const deleteComment = createAsyncThunk('delete/comments/:id', (data, thunkAPI) => {
	return thunk({ method: postsService.deleteComment, data, thunkAPI });
});

export const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		fullPostsReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(getPost.pending, state => {
				state.isLoading = true;
			})
			.addCase(getPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.postData = action.payload.postData;
				state.comments = action.payload.comments;
			})
			.addCase(getPost.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(likePost.fulfilled, (state, action) => {
				if (state.postData?.id === action.payload.id) {
					state.postData = {
						...state.postData,
						countOfLikes: action.payload.countOfLikes,
						liked: action.payload.liked,
					};
				}
			})

			.addCase(updatePost.fulfilled, (state, action) => {
				if (state.postData) {
					state.postData.text = action.payload.text;
				}
			})

			.addCase(createComment.fulfilled, (state, action) => {
				state.postData.countOfComments = state.postData.countOfComments + 1;
				state.comments.content = [action.payload, ...state.comments.content];
			})

			.addCase(likeComment.fulfilled, (state, action) => {
				state.comments.content = state.comments.content.map(comment => {
					if (comment.id === action.payload.id) {
						return {
							...comment,
							countOfLikes: action.payload.countOfLikes,
							liked: action.payload.liked,
						};
					}

					return comment;
				});
			})

			.addCase(updateComment.fulfilled, (state, action) => {
				state.comments.content = state.comments.content.map(comment => {
					if (comment.id === action.payload.id) {
						return action.payload;
					}

					return comment;
				});
			})

			.addCase(getCommentsPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getCommentsPage.fulfilled, (state, action) => {
				state.isPageLoading = false;
				state.comments.content = [...state.comments.content, ...action.payload.content];
				state.comments.currentPage = action.payload.currentPage;
				state.comments.totalPage = action.payload.totalPage;
			})

			.addCase(deleteComment.fulfilled, (state, action) => {
				state.postData.countOfComments = state.postData.countOfComments - 1;
				state.comments.content = state.comments.content.filter(
					comment => comment.id !== action.payload
				);
			})

			.addCase(deleteUserComment.fulfilled, (state, action) => {
				state.postData.countOfComments = state.postData.countOfComments - 1;
				state.comments.content = state.comments.content.filter(
					comment => comment.id !== action.payload
				);
			});
	},
});

export const { fullPostsReset } = postsSlice.actions;

export default postsSlice.reducer;
