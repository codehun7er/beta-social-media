import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce, useOutsideClick } from '../../../features/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
	messengerSearchForChats,
	resetMessengerSearchedChats,
	setSearchFocus,
	setSearchValue,
} from '../../../features/messenger/messengerSlice';
import { ReactComponent as SearchIcon } from '../../../images/search.svg';
import { ReactComponent as SavedMessagesIcon } from '../../../images/saved-messages.svg';

export const MessengerHeader = () => {
	const searchValue = useSelector(state => state.messenger.searchValue);
	const focused = useSelector(state => state.messenger.searchFocus);
	const userData = useSelector(state => state.profile.miniUserData);

	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick();

	const dispatch = useDispatch();
	const searchRef = useRef(null);

	const { debouncedValue } = useDebounce(searchValue, 500);

	const variants = {
		hidden: {
			clipPath: 'inset(0% 50% 50% 0%)',
			opacity: 0,
		},

		show: {
			clipPath: 'inset(0% 0% 0% 0%)',
			opacity: 1,
			transition: {
				bounce: 0,
				duration: 0.2,
			},
		},

		exit: {
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	useEffect(() => {
		if (!focused) searchRef.current.blur();
	}, [focused]);

	useEffect(() => {
		if (debouncedValue) {
			dispatch(messengerSearchForChats(debouncedValue));
		} else if (debouncedValue === '') {
			dispatch(resetMessengerSearchedChats());
		}
	}, [debouncedValue, dispatch]);

	return (
		<div className='messenger__contacts-header'>
			<div className='messenger__contacts-header-menu'>
				<div
					ref={btnRef}
					onClick={() => setIsShow(prev => !prev)}
					className={`messenger__contacts-header-burger-wrapper ${isShow ? 'active' : ''}`}
				>
					<div className='messenger__contacts-header-burger'>
						<span></span>
					</div>
				</div>

				<AnimatePresence>
					{isShow && (
						<motion.ul
							ref={targetRef}
							variants={variants}
							initial='hidden'
							animate='show'
							exit='exit'
							className='messenger__contacts-header-list'
						>
							<NavLink
								to={`/messenger/${userData.id}`}
								onClick={() => setIsShow(false)}
								className='messenger__contacts-header-list-item'
							>
								<SavedMessagesIcon className='messenger__contacts-header-list-icon' />
								<span>Saved Messages</span>
							</NavLink>
						</motion.ul>
					)}
				</AnimatePresence>
			</div>

			<div
				className={
					focused || searchValue
						? 'messenger__contacts-search focused'
						: 'messenger__contacts-search'
				}
			>
				<SearchIcon className='messenger__contacts-search-icon' />
				<input
					ref={searchRef}
					value={searchValue}
					onBlur={() => dispatch(setSearchFocus(false))}
					onFocus={() => dispatch(setSearchFocus(true))}
					onChange={e => dispatch(setSearchValue(e.target.value))}
					className='messenger__contacts-search-input'
					placeholder='Search'
				/>
			</div>
		</div>
	);
};
