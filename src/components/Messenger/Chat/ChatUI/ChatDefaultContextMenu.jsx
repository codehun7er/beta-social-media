import { useDispatch, useSelector } from 'react-redux';

import { editMessage, selectMessage, setDeleteModal } from '../../../../features/chat/chatSlice';
import { ReactComponent as CopyIcon } from '../../../../images/copy.svg';
import { ReactComponent as DeleteIcon } from '../../../../images/delete.svg';
import { ReactComponent as EditIcon } from '../../../../images/edit.svg';
import { ReactComponent as SelectIcon } from '../../../../images/select.svg';

export const ChatDefaultContextMenu = ({ message, setContextMenu }) => {
	const { miniUserData } = useSelector(state => state.profile);
	const dispatch = useDispatch();

	const handleAction = type => {
		setContextMenu(prev => ({ ...prev, show: false }));

		switch (type) {
			case 'EDIT':
				const editObj = {
					name: 'Edit Message',
					type: 'EDIT',
					message,
				};

				dispatch(editMessage(editObj));
				break;

			case 'COPY':
				navigator.clipboard.writeText(message.text);
				break;

			case 'SELECT':
				dispatch(selectMessage(message.id));
				break;

			case 'DELETE':
				dispatch(setDeleteModal({ show: true, message }));
				break;

			default:
				break;
		}
	};

	return (
		<>
			{miniUserData.id === message.user.id && (
				<li onClick={() => handleAction('EDIT')} className='messenger__chat-message-menuItem'>
					<EditIcon className='messenger__chat-message-menuItem-icon' alt='edit' />
					<span>Edit</span>
				</li>
			)}

			<li onClick={() => handleAction('COPY')} className='messenger__chat-message-menuItem'>
				<CopyIcon className='messenger__chat-message-menuItem-icon' alt='copy' />
				<span>Copy</span>
			</li>

			<li onClick={() => handleAction('SELECT')} className='messenger__chat-message-menuItem'>
				<SelectIcon className='messenger__chat-message-menuItem-icon' alt='select' />
				<span>Select</span>
			</li>

			<li
				onClick={() => handleAction('DELETE')}
				className='messenger__chat-message-menuItem delete'
			>
				<DeleteIcon className='messenger__chat-message-menuItem-icon' alt='delete' />
				<span>Delete</span>
			</li>
		</>
	);
};
