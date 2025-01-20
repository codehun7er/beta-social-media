import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { v4 as uuid } from 'uuid';

import chatService from './chatService';
import { thunk } from '../thunk';

const initialState = {
	messagesData: {},
	chatsMessages: {},
	chatData: {},
	chatDrafts: {},
	chatSendTypes: {},
	selectedMessages: [],
	currentSelectedMessages: [],
	currentChatCode: null,
	lastChatCode: null,
	currentChat: null,
	currentChatMessages: [],
	currentChatDraft: '',
	currentChatEditDraft: '',
	currentChatInputActions: [],
	currentChatSendType: 'SEND',
	deleteModal: { show: false, message: {} },
	isPageLoading: false,
	lastMessage: {},
};

export const getChatData = createAsyncThunk('messenger/chat/:code', (code, thunkAPI) => {
	const state = thunkAPI.getState();
	const { chat } = state;

	let lastChatCode = null;
	if (chat.currentChatCode) lastChatCode = chat.currentChatCode;

	let currentChatDraft = '';
	const currentChatCode = code;
	const currentChat = chat.chatData[code];
	const currentChatMessages = chat.chatsMessages[code];

	if (chat.chatDrafts[code]) currentChatDraft = chat.chatDrafts[code];

	if (currentChatMessages && currentChat) {
		return thunkAPI.rejectWithValue({
			currentChat,
			currentChatMessages,
			currentChatDraft,
			currentChatCode,
			lastChatCode,
		});
	}

	return thunk({ method: chatService.getData, data: code, thunkAPI });
});

export const getChatPage = createAsyncThunk(
	'messenger/:code?page=:currentPage',
	(data, thunkAPI) => {
		return thunk({ method: chatService.getPage, data, thunkAPI });
	}
);

export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setNewMessage: (state, action) => {
			const { chatsMessages, currentChatCode } = state;
			const { payload } = action;
			let lastCollection, lastMsgOfColl, diffMins;

			state.lastMessage = { ...payload };

			if (!chatsMessages[payload.code]) {
				state.chatsMessages = { ...state.chatsMessages, [payload.code]: [] };
			}

			const currentChatMessages = state.chatsMessages[payload.code];

			if (currentChatMessages[0]) {
				lastCollection = currentChatMessages[currentChatMessages.length - 1];
				lastMsgOfColl = lastCollection.messages[lastCollection.messages.length - 1];

				const payloadDate = new Date(payload.sendingTime);
				const messageDate = new Date(lastMsgOfColl.sendingTime);
				const diffMs = payloadDate - messageDate;
				diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
			}

			if (
				currentChatMessages[0] &&
				lastCollection?.user?.id === payload?.user.id &&
				diffMins < 10
			) {
				const message = {
					...lastCollection.messages.pop(),
					lastInCollection: false,
				};

				const chatMessages = [
					...currentChatMessages.slice(0, currentChatMessages.length - 1),
					{
						...lastCollection,
						messages: [...lastCollection.messages, message, { ...payload, lastInCollection: true }],
					},
				];

				state.chatsMessages = {
					...state.chatsMessages,
					[payload.code]: chatMessages,
				};
				state.currentChatMessages = state.chatsMessages[currentChatCode];
			} else {
				const messageCollectionId = uuid();

				const lastMessage = { ...payload, firstInCollection: true, lastInCollection: true };

				const chatMessages = [
					...currentChatMessages,
					{
						id: messageCollectionId,
						originalCode: lastMessage.originalCode,
						user: lastMessage.user,
						messages: [lastMessage],
					},
				];

				state.chatsMessages = {
					...state.chatsMessages,
					[payload.code]: chatMessages,
				};
				state.currentChatMessages = state.chatsMessages[currentChatCode];
			}
		},
		setNewDraft: (state, action) => {
			const { payload } = action;

			state.chatDrafts = { ...state.chatDrafts, [payload.code]: payload.draft };
			state.currentChatDraft = payload.draft;
		},
		setNewWSDraft: (state, action) => {
			const { currentChat, chatData } = state;
			const { payload } = action;

			state.currentChat = {
				...currentChat,
				draft: payload,
			};

			state.chatData = {
				...chatData,
				[payload.code]: {
					...chatData[payload.code],
					draft: payload,
				},
			};
		},
		editMessage: (state, action) => {
			const { currentChatInputActions } = state;

			if (currentChatInputActions[0]) {
				let isIncluded = false;

				const inputActions = currentChatInputActions.map(inputAction => {
					if (inputAction.type === action.payload.type) {
						isIncluded = true;
						return action.payload;
					}

					return inputAction;
				});

				if (isIncluded) {
					state.currentChatInputActions = inputActions;
				} else {
					state.currentChatInputActions = [action.payload, ...inputActions];
				}
			} else {
				state.currentChatInputActions = [action.payload];
			}

			state.currentChatEditDraft = action.payload.message.text;
			state.currentChatSendType = action.payload.type;
		},
		setNewEditedMessage: (state, action) => {
			const { chatsMessages, currentChatCode } = state;

			const newCurrentChatMessages = chatsMessages[action.payload.code].map(collection => {
				return {
					...collection,
					messages: collection.messages.map(message => {
						if (message.id === action.payload.id) {
							return { ...message, text: action.payload.text, edited: true };
						}

						return message;
					}),
				};
			});

			state.chatsMessages = {
				...state.chatsMessages,
				[action.payload.code]: newCurrentChatMessages,
			};
			state.currentChatMessages = state.chatsMessages[currentChatCode];
		},
		setNewEditDraft: (state, action) => {
			state.currentChatEditDraft = action.payload;
		},
		deleteActions: (state, action) => {
			const { currentChatInputActions } = state;

			if (action.payload === 'ALL') {
				state.currentChatInputActions = [];
				return;
			}

			state.currentChatInputActions = currentChatInputActions.filter(
				inputAction => inputAction.type !== currentChatInputActions[0].type
			);

			state.currentChatEditDraft = '';
			state.currentChatSendType = 'SEND';
		},
		selectMessage: (state, action) => {
			const { selectedMessages } = state;

			if (selectedMessages.find(id => id === action.payload)) {
				state.selectedMessages = selectedMessages.filter(id => id !== action.payload);
			} else {
				state.selectedMessages = [...selectedMessages, action.payload];
			}
		},
		toggleMessageSelection: (state, action) => {
			const { selectedMessages, currentSelectedMessages } = state;
			const { payload } = action;

			const isInSelected = selectedMessages.find(id => id === payload.id);
			const isInCurrent = currentSelectedMessages.find(id => id === payload.id);

			if (!isInSelected) {
				if (isInCurrent && payload.type !== 'ADD') {
					state.currentSelectedMessages = currentSelectedMessages.filter(id => id !== payload.id);
				} else {
					state.currentSelectedMessages = [...state.currentSelectedMessages, payload.id];
				}
			}

			if (state.currentSelectedMessages.length < 1) {
				state.selectedMessages = selectedMessages.filter(id => id !== payload.id);
			}
		},
		setSelectedMessages: state => {
			state.selectedMessages = [...state.selectedMessages, ...state.currentSelectedMessages];
			state.currentSelectedMessages = [];
		},
		clearMessageSelection: state => {
			state.selectedMessages = [];
			state.currentSelectedMessages = [];
		},
		setDeleteModal: (state, action) => {
			state.deleteModal = { show: action.payload.show, message: action.payload.message };
		},
		deleteMessage: (state, action) => {
			const { chatsMessages, currentChatCode } = state;
			const { payload } = action;

			const newCurrentChatMessages = chatsMessages[payload.code].map(collection => {
				let filteredMessages = [];

				for (let i = 0; i < payload.ids.length; i++) {
					if (i === 0) {
						filteredMessages = collection.messages.filter(message => message.id !== payload.ids[i]);
					} else {
						filteredMessages = filteredMessages.filter(message => message.id !== payload.ids[i]);
					}
				}

				return {
					...collection,
					messages: [...filteredMessages],
				};
			});

			const newCurrentChatMessagesWithFirstAndLast = newCurrentChatMessages.map(collection => {
				if (collection.messages.length > 2) {
					const firstInCollection = { ...collection.messages[0], firstInCollection: true };
					const lastInCollection = {
						...collection.messages[collection.messages.length - 1],
						lastInCollection: true,
					};

					const withOutFitst = collection.messages.filter(
						message => message.id !== firstInCollection.id
					);

					const withOutLast = withOutFitst.filter(message => message.id !== lastInCollection.id);

					return {
						...collection,
						messages: [firstInCollection, ...withOutLast, lastInCollection],
					};
				}

				if (collection.messages.length === 1) {
					const messageInCollection = {
						...collection.messages[0],
						firstInCollection: true,
						lastInCollection: true,
					};

					return {
						...collection,
						messages: [messageInCollection],
					};
				}

				return collection;
			});

			const filteredNewCurrentChatMessagesWithFirstAndLast =
				newCurrentChatMessagesWithFirstAndLast.filter(
					collection => collection?.messages.length !== 0
				);

			state.chatsMessages = {
				...state.chatsMessages,
				[action.payload.code]: filteredNewCurrentChatMessagesWithFirstAndLast,
			};

			state.currentChatMessages = state.chatsMessages[currentChatCode];
		},
		toggleChatMute: (state, action) => {
			const { chatData, currentChatCode } = state;
			const { payload } = action;

			state.chatData = {
				...chatData,
				[payload.code]: {
					...chatData[payload.code],
					muted: payload.type === 'MUTE' ? true : false,
				},
			};

			state.currentChat = state.chatData[currentChatCode];
		},
		toggleChatMarkAsUnread: (state, action) => {
			const { chatData, currentChatCode } = state;
			const { payload } = action;

			state.chatData = {
				...chatData,
				[payload.code]: {
					...chatData[payload.code],
					markedAsUnread: payload.type === 'MARK_AS_UNREAD' ? true : false,
				},
			};

			state.selectedMessages = [];
			state.currentChat = state.chatData[currentChatCode];
		},
		clearHistory: (state, action) => {
			state.chatsMessages = { ...state.chatsMessages, [action.payload]: [] };
			state.messagesData = { ...state.messagesData, [action.payload]: {} };
			state.currentChatMessages = state.chatsMessages[state.currentChatCode];
			state.selectedMessages = [];
		},
		deleteChat: (state, action) => {
			const { currentChatCode } = state;

			state.selectedMessages = [];

			if (action.payload === currentChatCode) {
				state.currentChatCode = null;
				state.lastChatCode = null;
			}

			delete state.messagesData[action.payload];

			delete state.chatsMessages[action.payload];
			state.currentChatMessages = state.chatsMessages[currentChatCode]
				? state.chatsMessages[currentChatCode]
				: null;

			delete state.chatData[action.payload];
			state.currentChat = state.chatData[currentChatCode] ? state.chatData[currentChatCode] : null;

			delete state.chatDrafts[action.payload];
			state.currentChatDraft = state.chatDrafts[currentChatCode]
				? state.chatDrafts[currentChatCode]
				: '';

			delete state.chatSendTypes[action.payload];
			state.currentChatSendType = state.chatSendTypes[currentChatCode]
				? state.chatSendTypes[currentChatCode]
				: 'SEND';
		},
		fullChatReset: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addCase(getChatData.fulfilled, (state, action) => {
				const { payload } = action;
				const { messagePageResponse, chat } = payload;
				const { messages, currentPage, totalPage, originalCode, code } = messagePageResponse;

				state.chatData = { ...state.chatData, [code]: chat };
				state.chatSendTypes = { [code]: 'SEND' };
				state.currentChat = chat;
				state.lastChatCode = state.currentChatCode;
				state.currentChatCode = code;
				state.currentChatDraft = chat.draft.text;

				state.messagesData = {
					...state.messagesData,
					[code]: {
						currentPage,
						totalPage,
					},
				};

				const messageCollections = chatService.collectionMaker(messages, originalCode);

				state.chatsMessages = {
					...state.chatsMessages,
					[code]: messageCollections,
				};
				state.chatDrafts = { ...state.chatDrafts, [code]: chat.draft.text };
				state.currentChatMessages = messageCollections;
				state.selectedMessages = [];
			})
			.addCase(getChatData.rejected, (state, action) => {
				const { payload } = action;

				state.currentChatDraft = payload ? payload.currentChatDraft : '';

				state.currentChatCode = payload?.currentChatCode;
				state.lastChatCode = payload?.lastChatCode;
				state.currentChat = payload?.currentChat;
				state.currentChatMessages = payload?.currentChatMessages;
				state.selectedMessages = [];
			})

			.addCase(getChatPage.pending, state => {
				state.isPageLoading = true;
			})
			.addCase(getChatPage.fulfilled, (state, action) => {
				const { chatsMessages, currentChatCode } = state;
				const { payload } = action;
				const { messages, currentPage, totalPage, originalCode, code } = payload;

				const responseCollections = chatService.collectionMaker(messages, originalCode);

				state.chatsMessages = {
					...chatsMessages,
					[currentChatCode]: [...responseCollections, ...chatsMessages[currentChatCode]],
				};

				state.currentChatMessages = [...responseCollections, ...chatsMessages[currentChatCode]];

				state.messagesData = {
					...state.messagesData,
					[code]: {
						currentPage,
						totalPage,
					},
				};

				state.isPageLoading = false;
			})
			.addCase(getChatPage.rejected, state => {
				state.isPageLoading = false;
			});
	},
});

export const {
	setNewMessage,
	setNewDraft,
	setNewWSDraft,
	editMessage,
	setNewEditDraft,
	setNewEditedMessage,
	deleteActions,
	selectMessage,
	setSelectedMessages,
	setSelectionMode,
	toggleMessageSelection,
	clearMessageSelection,
	setDeleteModal,
	deleteMessage,
	toggleChatMute,
	toggleChatMarkAsUnread,
	clearHistory,
	deleteChat,
	fullChatReset,
} = chatSlice.actions;

export default chatSlice.reducer;
