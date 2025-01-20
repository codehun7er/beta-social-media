import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../features/hooks';
import { ExplorerUserListItem } from '../ExplorerUI';
import {
	explorerGetRandomUsers,
	explorerSearchUsersPage,
	setScrollTop,
} from '../../../features/explorer/explorerSlice';

export const ExplorerUsersSearch = () => {
	const { randomUsersData, searchedUsers, searchValue, currentScrollTop, isPageLoading } =
		useSelector(state => state.explorer);
	const [scrollPosition, setScrollPosition] = useState();
	const { debouncedValue } = useDebounce(scrollPosition, 100);
	const dispatch = useDispatch();
	const listRef = useRef(null);

	useEffect(() => {
		listRef.current.scrollTop = currentScrollTop.users;
	}, [currentScrollTop.users]);

	useEffect(() => {
		if (debouncedValue) dispatch(setScrollTop({ type: 'users', value: debouncedValue }));
	}, [debouncedValue, dispatch]);

	useEffect(() => {
		if (randomUsersData.content.length < 1) dispatch(explorerGetRandomUsers());
	}, [randomUsersData.content.length, dispatch]);

	useEffect(() => {
		const list = listRef.current;

		const handleScroll = e => {
			if (e.target.scrollHeight - (e.target.scrollTop + window.innerHeight) < 0 && !isPageLoading) {
				if (searchValue && searchedUsers.currentPage + 1 < searchedUsers.totalPage) {
					const encodedString = searchValue.replace(/</g, '&lt;').replace(/>/g, '&gt;');
					const data = {
						request: encodedString,
						page: searchedUsers.currentPage + 1,
					};

					dispatch(explorerSearchUsersPage(data));
				}
			}

			setScrollPosition(e.target.scrollTop);
		};

		list.addEventListener('scroll', handleScroll);

		return () => list.removeEventListener('scroll', handleScroll);
	}, [isPageLoading, searchValue, searchedUsers, dispatch]);

	return (
		<ul ref={listRef} className='explorer__users-list'>
			{searchValue
				? searchedUsers.content.map(user => <ExplorerUserListItem key={user.id} user={user} />)
				: randomUsersData.content.map(user => <ExplorerUserListItem key={user.id} user={user} />)}
		</ul>
	);
};
