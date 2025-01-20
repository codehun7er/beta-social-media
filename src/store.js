import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice';
import chatReducer from './features/chat/chatSlice';
import messengerReducer from './features/messenger/messengerSlice';
import profileReducer from './features/profile/profileSlice';
import explorerReducer from './features/explorer/explorerSlice';
import postsReducer from './features/posts/postsSlice';
import reportReducer from './features/report/reportSlice';
import feedReducer from './features/feed/feedSlice';
import adminReducer from './features/admin/adminSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		profile: profileReducer,
		explorer: explorerReducer,
		messenger: messengerReducer,
		chat: chatReducer,
		posts: postsReducer,
		report: reportReducer,
		feed: feedReducer,
		admin: adminReducer,
	},
	devTools: true,
});
