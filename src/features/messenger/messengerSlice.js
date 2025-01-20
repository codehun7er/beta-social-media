import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
	getChats,
	getChatsPage,
	getSearchForChatsPage,
	getSingleChat,
	searchForChats,
} from './messengerService';
import { thunk } from '../thunk';

const initialState = {
	messengerChatsData: null,
	messengerChats: [],
	searchedChatsData: null,
	searchedChats: [],
	searchValue: '',
	searchFocus: false,
	messengerModal: { isShow: false, chat: {}, type: 'DELETE' },
	isError: false,
	isSuccess: false,
	isLoading: true,
	isPageLoading: false,
};

export const getMessengerChats = createAsyncThunk('messenger', thunkAPI => {
	return thunk({ method: getChats, thunkAPI });
});

export const getMessengerChat = createAsyncThunk('messenger/chat-data/:code', (data, thunkAPI) => {
	const state = thunkAPI.getState();
	const { messengerChats } = state.messenger;

	if (!messengerChats.find(chat => chat.originalCode === data.originalCode)) {
		if (state.chat.currentChat && state.chat.currentChat.originalCode === data.originalCode) {
			return { ...state.chat.currentChat, lastMessage: data };
		}

		return thunk({ method: getSingleChat, data, thunkAPI });
	}

	thunkAPI.rejected();
});

export const getMessengerChatsPage = createAsyncThunk('messenger?page=:page', (data, thunkAPI) => {
	return thunk({ method: getChatsPage, data, thunkAPI });
});

export const messengerSearchForChats = createAsyncThunk(
	'search/messenger/chats?request=:text',
	(data, thunkAPI) => {
		return thunk({ method: searchForChats, data, thunkAPI });
	}
);

export const getMessengerSearchPage = createAsyncThunk(
	'search/messenger/chats?request=:text&page=:page',
	(data, thunkAPI) => {
		return thunk({ method: getSearchForChatsPage, data, thunkAPI });
	}
);

export const getLastMessage = createAsyncThunk('messenger/lastMessage', (data, thunkAPI) => {
	const state = thunkAPI.getState();
	const { chatsMessages } = state.chat;
	const { messengerChats } = state.messenger;

	const mappedMessengerChats = messengerChats.map(chat => {
		if (chat.code === data.code) {
			const currentChatMessages = chatsMessages[data.code];
			const lastCollection = currentChatMessages[currentChatMessages.length - 1];

			if (!lastCollection) {
				return {
					...chat,
					lastMessage: { text: 'Cleared history', sendingTime: new Date().getTime() },
				};
			}

			return { ...chat, lastMessage: lastCollection.messages[lastCollection.messages.length - 1] };
		}

		return chat;
	});

	return thunkAPI.fulfillWithValue({ mappedMessengerChats });
});

export const messengerSlice = createSlice({
	name: 'messenger',
	initialState,
	reducers: {
		setLastMessage: (state, action) => {
			const { messengerChats } = state;
			const { payload } = action;
			let index;

			messengerChats.forEach(chat => {
				if (chat.originalCode === payload.originalCode) {
					index = messengerChats.indexOf(chat);
					const firstHalf = messengerChats.slice(0, index);
					const secondHalf = messengerChats.slice(index + 1);
					state.messengerChats = [{ ...chat, lastMessage: payload }, ...firstHalf, ...secondHalf];
				}
			});
		},
		setLastEditedMessage: (state, action) => {
			const { messengerChats } = state;
			const { payload } = action;

			state.messengerChats = messengerChats.map(chat => {
				if (chat.code === payload.code && chat.lastMessage.id === payload.id) {
					return { ...chat, lastMessage: { ...chat.lastMessage, text: payload.text } };
				}

				return chat;
			});
		},
		setLastDraft: (state, action) => {
			const { payload } = action;
			const { messengerChats } = state;

			state.messengerChats = messengerChats.map(chat => {
				if (chat.code === payload.code) {
					return { ...chat, draft: { editingTime: payload.editingTime, text: payload.text } };
				}

				return chat;
			});
		},
		toggleMute: (state, action) => {
			const { payload } = action;

			state.messengerChats = state.messengerChats.map(chat => {
				if (chat.code === payload.code) {
					return { ...chat, muted: payload.type === 'MUTE' ? true : false };
				}

				return chat;
			});
		},
		toggleMarkAsUnread: (state, action) => {
			const { payload } = action;

			state.messengerChats = state.messengerChats.map(chat => {
				if (chat.code === payload.code) {
					return { ...chat, markedAsUnread: payload.type === 'MARK_AS_UNREAD' ? true : false };
				}

				return chat;
			});
		},
		deleteMessengerChat: (state, action) => {
			state.messengerChats = state.messengerChats.filter(chat => chat.code !== action.payload);
		},
		resetMessengerSearchedChats: state => {
			state.searchedChats = [];
		},
		setSearchValue: (state, action) => {
			state.searchValue = action.payload;
		},
		setSearchFocus: (state, action) => {
			state.searchFocus = action.payload;
		},
		setMessengerModal: (state, action) => {
			const { payload } = action;

			if (payload.modalType === 'all') {
				state.messengerModal = {
					isShow: payload.isShow,
					chat: payload.chat,
					type: payload.type,
				};
			} else {
				state.messengerModal = {
					...state.messengerModal,
					isShow: payload.isShow,
				};
			}
		},
		fullMessengerReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(getMessengerChats.fulfilled, (state, action) => {
				const { payload } = action;

				state.isLoading = false;
				state.isSuccess = true;

				state.messengerChatsData = {
					currentPage: payload.currentPage,
					totalPage: payload.totalPage,
				};

				state.messengerChats = payload.content;
			})
			.addCase(getMessengerChats.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			})

			.addCase(getMessengerChat.fulfilled, (state, action) => {
				state.messengerChats = [action.payload, ...state.messengerChats];
			})

			.addCase(getLastMessage.fulfilled, (state, action) => {
				state.messengerChats = action.payload.mappedMessengerChats;
			})

			.addCase(getMessengerChatsPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getMessengerChatsPage.fulfilled, (state, action) => {
				const { payload } = action;

				state.messengerChatsData = {
					...state.messengerChatsData,
					currentPage: payload.currentPage,
				};

				state.isPageLoading = false;
				state.messengerChats = [...state.messengerChats, ...payload.content];
			})
			.addCase(getMessengerChatsPage.rejected, state => {
				state.isPageLoading = false;
			})

			.addCase(messengerSearchForChats.fulfilled, (state, action) => {
				const { payload } = action;

				state.searchedChatsData = {
					currentPage: payload.currentPage,
					totalPage: payload.totalPage,
				};

				state.searchedChats = [...payload.content];
			})

			.addCase(getMessengerSearchPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getMessengerSearchPage.fulfilled, (state, action) => {
				const { payload } = action;

				state.searchedChatsData = {
					currentPage: payload.currentPage,
					totalPage: payload.totalPage,
				};

				state.searchedChats = [...state.searchedChats, ...payload.content];

				state.isPageLoading = false;
			});
	},
});

export const {
	setLastMessage,
	setLastDraft,
	setLastEditedMessage,
	toggleMute,
	toggleMarkAsUnread,
	deleteMessengerChat,
	resetMessengerSearchedChats,
	setSearchFocus,
	setSearchValue,
	setMessengerModal,
	fullMessengerReset,
} = messengerSlice.actions;

export default messengerSlice.reducer;
