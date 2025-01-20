import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useStompClient } from '../../../features/hooks';
import { setMessengerModal } from '../../../features/messenger/messengerSlice';
import { ChatContextMenu } from '../Chat/ChatUI/ChatContextMenu';

import { ReactComponent as MarkUnReadIcon } from '../../../images/unread-message.svg';
import { ReactComponent as MarkReadIcon } from '../../../images/read-message.svg';
import { ReactComponent as MuteIcon } from '../../../images/muted.svg';
import { ReactComponent as UnmuteIcon } from '../../../images/volume.svg';
import { ReactComponent as ClearIcon } from '../../../images/clear.svg';
import { ReactComponent as DeleteIcon } from '../../../images/delete.svg';

export const MessengerContextMenu = ({ x, y, chat, setContextMenu }) => {
	const { currentChatCode } = useSelector(state => state.chat);
	const stompClient = useStompClient();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const setModal = payload => {
		dispatch(setMessengerModal(payload));
	};

	const handleAction = type => {
		if (stompClient) {
			switch (type) {
				case 'MUTE':
					stompClient.send('/app/mute', {}, JSON.stringify({ code: chat.code, muteForever: true }));
					break;
				case 'UNMUTE':
					stompClient.send('/app/unmute', {}, JSON.stringify(chat.code));
					break;
				case 'MARK':
					stompClient.send('/app/unread', {}, JSON.stringify(chat.code));

					if (chat.code === currentChatCode && !chat.markedAsUnread) {
						navigate('/messenger');
					}
					break;
				case 'CLEAR':
					setModal({ isShow: true, chat, type: 'CLEAR', modalType: 'all' });
					break;
				case 'DELETE':
					setModal({ isShow: true, chat, type: 'DELETE', modalType: 'all' });
					if (chat.code === currentChatCode) navigate('/messenger');
					break;
				default:
			}

			setContextMenu(prev => ({ ...prev, show: false }));
		}
	};

	return (
		<ChatContextMenu x={x} y={y} setContextMenu={setContextMenu}>
			{chat.type === 'DC' &&
				(chat.muted ? (
					<li onClick={() => handleAction('UNMUTE')} className='messenger__chat-message-menuItem'>
						<UnmuteIcon className='messenger__chat-message-menuItem-icon' alt='unmute' />
						<span>Unmute</span>
					</li>
				) : (
					<li onClick={() => handleAction('MUTE')} className='messenger__chat-message-menuItem'>
						<MuteIcon className='messenger__chat-message-menuItem-icon' alt='mute' />
						<span>Mute</span>
					</li>
				))}

			{chat.markedAsUnread ? (
				<li onClick={() => handleAction('MARK')} className='messenger__chat-message-menuItem'>
					<MarkReadIcon className='messenger__chat-message-menuItem-icon' alt='mark' />
					<span>Mark as read</span>
				</li>
			) : (
				<li onClick={() => handleAction('MARK')} className='messenger__chat-message-menuItem'>
					<MarkUnReadIcon className='messenger__chat-message-menuItem-icon' alt='mark' />
					<span>Mark as unread </span>
				</li>
			)}

			<li onClick={() => handleAction('CLEAR')} className='messenger__chat-message-menuItem'>
				<ClearIcon className='messenger__chat-message-menuItem-icon' alt='clear' />
				<span>Clear history</span>
			</li>

			<li
				onClick={() => handleAction('DELETE')}
				className='messenger__chat-message-menuItem delete'
			>
				<DeleteIcon className='messenger__chat-message-menuItem-icon' alt='delete' />
				<span>Delete chat</span>
			</li>
		</ChatContextMenu>
	);
};
