import React from 'react';
import ReactDOM from 'react-dom/client';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { ReportNotification } from './UI/ReportNotification';

import App from './App';
import { store } from './store';
import { NotificationProvider } from './utils/contexts/NotificationContext';

import './scss/index.scss';
import './scss/form.scss';
import './scss/notifications.scss';
import './scss/toastify.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import { ReportModal } from './UI/ReportModal/ReportModal';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<SkeletonTheme baseColor='#313131' highlightColor='#525252' duration={1.2}>
			<Router>
				<NotificationProvider>
					<App />
					<ReportModal />
					<ReportNotification />
					<ToastContainer theme='dark' />
				</NotificationProvider>
			</Router>
		</SkeletonTheme>
	</Provider>
);
