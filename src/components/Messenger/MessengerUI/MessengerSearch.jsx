import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  resetMessengerSearchedChats,
  setSearchFocus,
  setSearchValue,
} from '../../../features/messenger/messengerSlice';
import Skeleton from 'react-loading-skeleton';

export const MessengerSearch = ({ chat }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	const dispatch = useDispatch();

	const handleLinkClick = () => {
		dispatch(setSearchValue(''));
		dispatch(resetMessengerSearchedChats(''));
		dispatch(setSearchFocus(false));
	};

	useEffect(() => {
		const img = new Image();
		img.src = chat.avatar;

		img.onload = () => {
			setIsLoaded(true);
		};
	}, [chat.avatar]);

	return (
		<li>
			<NavLink
				onClick={handleLinkClick}
				onMouseDown={e => e.preventDefault()}
				to={`/messenger/${chat.code}`}
				className='messenger__contacts-chat'
			>
				{isLoaded ? (
					<img className='messenger__contacts-chat-img' src={chat.avatar} alt='avatar' />
				) : (
					<Skeleton circle width={54} height={52} />
				)}
				<div className='messenger__contacts-chat-info'>
					<div className='messenger__contacts-chat-header'>
						<p className='messenger__contacts-chat-name'>{chat.chatName}</p>
					</div>

					<div className='messenger__contacts-chat-body'>
						<p className='messenger__contacts-chat-text'>last seen recently</p>
					</div>
				</div>
			</NavLink>
		</li>
	);
};
