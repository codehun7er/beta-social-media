import { LayoutGroup, motion } from 'framer-motion';
import { createContext, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import notSound from '../../audio/notificationSound.mp3';

import { v4 as uuid } from 'uuid';

import { Notification } from '../Notification';

export const NotifyContext = createContext({});

const useCreateDomElement = () => {
	const [domElement, setDomElement] = useState(null);

	useEffect(() => {
		const element = document.createElement('div');
		document.body.appendChild(element);
		setDomElement(element);

		return () => document.body.removeChild(element);
	}, []);

	return domElement;
};

const useNotifications = () => {
	const notificationSound = new Audio(notSound);
	const location = useLocation();
	const [notifications, setNotifications] = useState([]);

	if (notifications.length > 3) {
		setNotifications(prev => prev.slice(1));
	}

	const notify = useCallback(
		notificationPayload => {
			const id = uuid();

			const removeNotification = (e, isTimedOut = false) => {
				if (!isTimedOut) {
					e.stopPropagation();
					e.preventDefault();
				}

				setNotifications(prev => prev.filter(item => item.id !== id));
			};

			const removeAllNotifications = () => {
				setNotifications([]);
			};

			if (!location.pathname.includes('/messenger')) {
				notificationSound.play().catch(err => {});

				setNotifications(prev => [
					...prev,
					{
						id,
						removeAllNotifications,
						onTimeOut: e => removeNotification(e, true),
						onClose: removeNotification,

						...notificationPayload,
					},
				]);
			}
		},
		[location.pathname]
	);

	return { notifications, notify };
};

export const NotificationProvider = ({ children }) => {
	const [isClosing, setIsClosing] = useState(false);
	const [closingType, setClosingType] = useState('firstClose');

	const { notify, notifications } = useNotifications();

	const notificationRoot = useCreateDomElement();

	useEffect(() => {
		setIsClosing(false);
	}, [notifications]);

	return (
		<>
			<NotifyContext.Provider value={notify}>{children}</NotifyContext.Provider>
			{notificationRoot &&
				createPortal(
					<LayoutGroup>
						<motion.div className='notifications__container'>
							{notifications.map(notification => (
								<Notification
									key={notification.id}
									{...notification}
									isClosing={isClosing}
									setIsClosing={setIsClosing}
									closingType={closingType}
									setClosingType={setClosingType}
								/>
							))}
						</motion.div>
					</LayoutGroup>,
					notificationRoot
				)}
		</>
	);
};
