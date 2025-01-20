import { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChatMessage } from './ChatMessage';

export const ChatMessageCollection = forwardRef(({ collection }, ref) => {
	const { currentChat } = useSelector(state => state.chat);
	const { messages, user } = collection;

	return (
		<div className='messenger__chat-main-collection'>
			<div className='messenger__chat-messages'>
				{messages.map(message => {
					if (messages.length >= 5 && message.id === messages[1].id) {
						return <ChatMessage ref={ref} message={message} key={message.id} />;
					}

					return <ChatMessage message={message} key={message.id} />;
				})}
			</div>
			{currentChat.type !== 'DC' || currentChat.deleted ? (
				<div className='messenger__chat-message-img-wrapper' style={{ height: '34px' }}>
					<img className='messenger__chat-message-img' src={user.avatar} alt='avatar' />
				</div>
			) : (
				<Link
					className='messenger__chat-message-img-wrapper'
					style={{ height: '34px' }}
					to={`/users/${user.username}`}
				>
					<img className='messenger__chat-message-img' src={user.avatar} alt='avatar' />
				</Link>
			)}
		</div>
	);
});
