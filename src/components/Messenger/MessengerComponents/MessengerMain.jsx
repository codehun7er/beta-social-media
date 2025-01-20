import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MessengerContacts, MessengerContactSkeleton } from '../MessengerUI';
import {
	getMessengerChatsPage,
	getMessengerSearchPage,
} from '../../../features/messenger/messengerSlice';

export const MessengerMain = () => {
	const { isLoading, messengerChatsData, isPageLoading, searchValue, searchedChatsData } =
		useSelector(state => state.messenger);
	const dispatch = useDispatch();

	const messengerContactsRef = useRef(null);

	useEffect(() => {
		const messengerContacts = messengerContactsRef.current;

		const scrollHandler = e => {
			if (
				e.target.scrollHeight - (e.target.scrollTop + window.innerHeight) < 100 &&
				!isPageLoading
			) {
				if (
					searchedChatsData &&
					searchValue &&
					searchedChatsData.currentPage + 1 < searchedChatsData.totalPage
				) {
					const data = {
						request: searchValue,
						page: searchedChatsData.currentPage + 1,
					};

					dispatch(getMessengerSearchPage(data));
				} else if (
					messengerChatsData &&
					messengerChatsData.currentPage + 1 < messengerChatsData.totalPage
				) {
					dispatch(getMessengerChatsPage(messengerChatsData.currentPage + 1));
				}
			}
		};

		messengerContacts.addEventListener('scroll', scrollHandler);

		return () => {
			messengerContacts.removeEventListener('scroll', scrollHandler);
		};
	}, [messengerChatsData, isPageLoading, searchValue, searchedChatsData, dispatch]);

	return (
		<div
			ref={messengerContactsRef}
			className={`messenger__contacts-main ${isLoading ? 'locked' : ''}`}
		>
			{isLoading ? <MessengerContactSkeleton count={18} /> : <MessengerContacts />}
		</div>
	);
};
