import { useDispatch, useSelector } from 'react-redux';

import { deleteActions } from '../../../../features/chat/chatSlice';
import { ReactComponent as EditIcon } from '../../../../images/edit.svg';
import { ReactComponent as ReplyIcon } from '../../../../images/reply.svg';

export const ChatInputActions = () => {
	const { currentChatInputActions } = useSelector(state => state.chat);

	const dispatch = useDispatch();

	const IconComponent = () => {
		switch (currentChatInputActions[0].type) {
			case 'REPLY':
				return (
					<ReplyIcon
						className='messenger__chat-footer-action-img'
						alt={currentChatInputActions[0].type.toLowerCase()}
					/>
				);
			case 'EDIT':
				return (
					<EditIcon
						className='messenger__chat-footer-action-img'
						alt={currentChatInputActions[0].type.toLowerCase()}
					/>
				);
			default:
		}
	};

	return (
		<div className='messenger__chat-footer-action'>
			<div className='messenger__chat-footer-action-message'>
				{IconComponent()}
				<div className='messenger__chat-footer-action-info'>
					<p className='messenger__chat-footer-action-name'>{currentChatInputActions[0].name}</p>
					<p className='messenger__chat-footer-action-text'>
						{currentChatInputActions[0].message.text.replace(/<[^>]*>/g, '').trim()}
					</p>
				</div>
			</div>
			<div
				className='messenger__chat-footer-action-close'
				onClick={() => dispatch(deleteActions('ONE'))}
			/>
		</div>
	);
};
