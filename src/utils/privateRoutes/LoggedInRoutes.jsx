import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
	getUserInitialProfile,
	hardProfileDataReset,
	resetProfileData,
} from '../../features/profile/profileSlice';
import { Loader } from '../../UI/Loader';
import { fullAuthReset } from '../../features/auth/authSlice';
import { fullChatReset } from '../../features/chat/chatSlice';
import { fullExplorerReset } from '../../features/explorer/explorerSlice';
import { fullMessengerReset } from '../../features/messenger/messengerSlice';
import { fullPostsReset } from '../../features/posts/postsSlice';
import { fullFeedReset } from '../../features/feed/feedSlice';
import { fullReportReset } from '../../features/report/reportSlice';
import { useStompClient } from '../../features/hooks/useStompClient';

export const LoggedInRoutes = () => {
	const login = localStorage.getItem('lo_uuid');

	const { isLoggedOut } = useSelector(state => state.auth);
	const { miniUserData } = useSelector(state => state.profile);
	const stompClient = useStompClient();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (login && !miniUserData) dispatch(getUserInitialProfile());
	}, [miniUserData, login, dispatch]);

	useEffect(() => {
		if (isLoggedOut) {
			dispatch(hardProfileDataReset());
			dispatch(fullAuthReset());
			dispatch(fullChatReset());
			dispatch(fullExplorerReset());
			dispatch(fullMessengerReset());
			dispatch(fullPostsReset());
			dispatch(fullFeedReset());
			dispatch(fullReportReset());
			navigate('/login');
		}
	}, [isLoggedOut, navigate, dispatch]);

	useEffect(() => {
		if (miniUserData) dispatch(resetProfileData());
	}, [miniUserData, dispatch]);

	return login ? miniUserData && stompClient ? <Outlet /> : <Loader /> : <Navigate to='/login' />;
};
