import { Route, Routes } from 'react-router-dom';

import {
	AdminRoutes,
	LoggedInRoutes,
	LoggedOutRoutes,
	WebSocketRoutes,
} from './utils/privateRoutes';

import {
	ActivateAccount,
	AdminPanel,
	AuthLayout,
	Chat,
	Explorer,
	ExplorerPostsSearch,
	ExplorerUsersSearch,
	Feed,
	PostPage,
	ForgotPassword,
	Layout,
	LoggedInLayout,
	Login,
	Main,
	Messenger,
	NotFoundPage,
	Profile,
	ResetPassword,
	Settings,
	Signup,
	Support,
	EmailSettings,
	UsernameSettings,
	PasswordSettings,
	DeleteAccount,
	SecuritySettingsMain,
} from './components';
import { FeedAllPosts } from './components/Feed/FeedAllPosts';
import { FeedFollowingPosts } from './components/Feed/FeedFollowingPosts';

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route element={<LoggedOutRoutes />}>
					<Route element={<AuthLayout />}>
						<Route index element={<Main />} />
						<Route path='signup' element={<Signup />} />
						<Route path='login' element={<Login />} />
						<Route path='auth/activate' element={<ActivateAccount />} />
						<Route path='forgot-password' element={<ForgotPassword />} />
						<Route path='reset-password' element={<ResetPassword />} />
						<Route path='help' element={<Support />} />
					</Route>
				</Route>

				<Route element={<LoggedInRoutes />}>
					<Route element={<LoggedInLayout />}>
						<Route element={<WebSocketRoutes />}>
							<Route path='users/:username' element={<Profile />} />

							<Route path='feed' element={<Feed />}>
								<Route index element={<FeedAllPosts />} />
								<Route path='following' element={<FeedFollowingPosts />} />
							</Route>

							<Route path='posts/:id' element={<PostPage />} />

							<Route path='messenger' element={<Messenger />}>
								<Route path=':code' element={<Chat />} />
							</Route>

							<Route path='explorer' element={<Explorer />}>
								<Route index element={<ExplorerUsersSearch />} />
								<Route path='posts' element={<ExplorerPostsSearch />} />
							</Route>

							<Route path='support' element={<Support />} />

							<Route path='settings' element={<Settings />}>
								<Route index element={<SecuritySettingsMain />} />
								<Route path='username' element={<UsernameSettings />} />
								<Route path='email' element={<EmailSettings />} />
								<Route path='password' element={<PasswordSettings />} />
								<Route path='delete-account' element={<DeleteAccount />} />
							</Route>

							<Route element={<AdminRoutes />}>
								<Route path='admin-panel' element={<AdminPanel />} />
							</Route>
						</Route>
					</Route>
				</Route>

				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default App;
