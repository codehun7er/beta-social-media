import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearMessageSelection, setDeleteModal } from '../../../../features/chat/chatSlice';
import { useStompClient } from '../../../../features/hooks';
import { CheckBox } from '../../../../UI/CheckBox/CheckBox';
import { Modal } from '../../../../UI/Modal/Modal';

export const ChatContextCheckBox = () => {
	const [isChecked, setIsChecked] = useState(true);

	const stompClient = useStompClient();
	const dispatch = useDispatch();

	const { selectedMessages, deleteModal, currentChatCode, currentChat } = useSelector(
		state => state.chat
	);

	const handleClose = () => {
		dispatch(setDeleteModal({ show: false }));
	};

	const setIsShow = payload => {
		dispatch(setDeleteModal({ show: payload }));
	};

	const handleDelete = () => {
		let deletedMessage = {
			code: currentChatCode,
			deleteForEveryone: isChecked,
		};

		if (selectedMessages[0]) {
			deletedMessage = {
				...deletedMessage,
				ids: selectedMessages,
			};
		} else {
			deletedMessage = {
				...deletedMessage,
				ids: [deleteModal.message.id],
			};
		}

		if (stompClient) stompClient.send('/app/delete', {}, JSON.stringify(deletedMessage));
		dispatch(clearMessageSelection());
		handleClose();
	};

	useEffect(() => {
		if (deleteModal.show) setIsChecked(true);
	}, [deleteModal.show]);

	return (
		currentChat && (
			<Modal isShow={deleteModal.show} setIsShow={setIsShow}>
				<div className='messenger__delete-modal'>
					<p className='messenger__delete-modal-title'>
						{selectedMessages.length > 1
							? `Are you sure you want to delete ${selectedMessages.length} messages?`
							: 'Are you sure you want to delete this message?'}
					</p>

					{currentChat.type !== 'SM' && (
						<CheckBox isChecked={isChecked} setIsChecked={setIsChecked}>
							{currentChat.type === 'DC'
								? `Also delete for ${currentChat.chatName}`
								: 'Delete for Everyone'}
						</CheckBox>
					)}

					<div className='messenger__delete-modal-buttons'>
						<button onClick={handleClose} className='messenger__delete-modal-button'>
							Cancel
						</button>

						<button onClick={handleDelete} className='messenger__delete-modal-button delete'>
							Delete
						</button>
					</div>
				</div>
			</Modal>
		)
	);
};
