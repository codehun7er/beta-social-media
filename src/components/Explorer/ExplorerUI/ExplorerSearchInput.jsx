import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../features/hooks';
import {
	explorerSearchUsers,
	setSearchValue,
	setIsDataLoaded,
	explorerSearchPosts,
} from '../../../features/explorer/explorerSlice';

import { ReactComponent as SearchIcon } from '../../../images/search.svg';

export const ExplorerSearchInput = () => {
	const [focused, setFocused] = useState(false);
	const { searchValue, isDataLoaded } = useSelector(state => state.explorer);
	const { debouncedValue } = useDebounce(searchValue, 500);

	const dispatch = useDispatch();

	const location = useLocation();
	const currentLocation = location.pathname.split('/')[2];
	const searchLocation = currentLocation ? currentLocation : '';

	const handleInputChange = e => {
		if (isDataLoaded.users || isDataLoaded.posts) {
			dispatch(setIsDataLoaded('ALL'));
		}

		dispatch(setSearchValue(e.target.value));
	};

	useEffect(() => {
		const specialAction = value => {
			const encodedString = value.replace(/</g, '%26lt;').replace(/>/g, '%26gt;');

			switch (searchLocation) {
				case '':
					if (!isDataLoaded.users) {
						dispatch(setIsDataLoaded('users'));
						return dispatch(explorerSearchUsers(value));
					}
					break;
				case 'posts':
					if (!isDataLoaded.posts) {
						dispatch(setIsDataLoaded('posts'));
						return dispatch(explorerSearchPosts(encodedString));
					}
					break;
				default:
			}
		};

		if (debouncedValue === searchValue && debouncedValue) {
			specialAction(debouncedValue);
		}
	}, [searchLocation, searchValue, isDataLoaded, debouncedValue, dispatch]);

	return (
		<div className={focused || searchValue ? 'explorer__search focused' : 'explorer__search'}>
			<SearchIcon className='explorer__search-icon' />
			<input
				value={searchValue}
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)}
				onChange={handleInputChange}
				className='explorer__search-input'
				placeholder='Search'
			/>
		</div>
	);
};
