import { useDispatch } from 'react-redux';

import { clearMessageSelection, selectMessage, setDeleteModal, } from '../../../../features/chat/chatSlice';
import { ReactComponent as CopyIcon } from '../../../../images/copy.svg';
import { ReactComponent as DeleteIcon } from '../../../../images/delete.svg';
import { ReactComponent as SelectIcon } from '../../../../images/select.svg';

export const ChatSelectContextMenu = ({ message, isSelected, setContextMenu }) => {
	const dispatch = useDispatch();

	const handleAction = type => {
		setContextMenu(prev => ({ ...prev, show: false }));

		switch (type) {
			case 'COPY':
				break;

			case 'CLEAR':
				dispatch(clearMessageSelection());
				break;

			case 'DELETE':
				dispatch(setDeleteModal({ show: true }));
				break;

			case 'SELECT':
				dispatch(selectMessage(message.id));
				break;

			default:
				break;
		}
	};

	return isSelected ? (
		<>
			<li onClick={() => handleAction('COPY')} className='messenger__chat-message-menuItem'>
				<CopyIcon className='messenger__chat-message-menuItem-icon' alt='copy' />
				<span>Copy Selected</span>
			</li>

			<li onClick={() => handleAction('CLEAR')} className='messenger__chat-message-menuItem'>
				<SelectIcon className='messenger__chat-message-menuItem-icon' alt='select' />
				<span>Clear Selection</span>
			</li>

			<li
				onClick={() => handleAction('DELETE')}
				className='messenger__chat-message-menuItem delete'
			>
				<DeleteIcon className='messenger__chat-message-menuItem-icon' alt='delete' />
				<span>Delete Selected</span>
			</li>
		</>
	) : (
		<>
			<li onClick={() => handleAction('SELECT')} className='messenger__chat-message-menuItem'>
				<SelectIcon className='messenger__chat-message-menuItem-icon' alt='select' />
				<span>Select</span>
			</li>
		</>
	);
};
