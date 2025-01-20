import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import { MessengerContact, MessengerContextCheckBox, MessengerSearch } from './';

export const MessengerContacts = () => {
	const { messengerChats, searchedChats, searchValue } = useSelector(state => state.messenger);

	const variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				duration: 0.4,
				ease: 'easeOut',
			},
		},
	};

	return (
		<>
			<motion.ul
				className='messenger__contacts-chats'
				variants={variants}
				initial='hidden'
				animate='show'
			>
				{searchValue
					? searchedChats.map(chat => <MessengerSearch key={chat.code} chat={chat} />)
					: messengerChats.map(chat => <MessengerContact key={chat.code} chat={chat} />)}
			</motion.ul>

			<MessengerContextCheckBox />
		</>
	);
};
