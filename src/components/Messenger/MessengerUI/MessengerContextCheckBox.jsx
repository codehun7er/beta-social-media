import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStompClient } from '../../../features/hooks/';
import { setMessengerModal } from '../../../features/messenger/messengerSlice';
import { Modal } from '../../../UI/Modal/Modal';
import { CheckBox } from '../../../UI/CheckBox/CheckBox';

export const MessengerContextCheckBox = () => {
	const [isChecked, setIsChecked] = useState(true);
	const modal = useSelector(state => state.messenger.messengerModal);

	const stompClient = useStompClient();
	const dispatch = useDispatch();

	const setModal = payload => {
		dispatch(setMessengerModal(payload));
	};

	const handleClose = () => {
		setModal({ isShow: false, modalType: 'isShow' });
	};

	const setIsShow = payload => {
		setModal({ isShow: payload, modalType: 'isShow' });
	};

	const handleDelete = () => {
		if (modal.type === 'CLEAR' && stompClient) {
			stompClient.send(
				'/app/clear',
				{},
				JSON.stringify({ code: modal.chat.code, forEveryone: isChecked })
			);
		}

		if (modal.type === 'DELETE' && stompClient) {
			stompClient.send(
				'/app/chat/delete',
				{},
				JSON.stringify({ code: modal.chat.code, forEveryone: isChecked })
			);
		}

		setModal({ isShow: false, modalType: 'isShow' });
		setIsChecked(true);
	};

	useEffect(() => {
		if (modal.isShow) setIsChecked(true);
	}, [modal.isShow]);

	return (
		<Modal isShow={modal.isShow} setIsShow={setIsShow}>
			<div className='messenger__delete-modal'>
				<p className='messenger__delete-modal-title'>
					{modal.type === 'DELETE'
						? 'Are you sure you want to delete this chat with all message history?'
						: 'Are you sure you want to delete all message history?'}
				</p>

				{modal.chat.type !== 'SM' && (
					<CheckBox isChecked={isChecked} setIsChecked={setIsChecked}>
						{modal.chat.type === 'DC'
							? `Also ${modal.type === 'CLEAR' ? 'clear' : 'delete'} this chat for ${
									modal.chat.chatName
							  }`
							: `${modal.type === 'CLEAR' ? 'Clear' : 'Delete'} for everyone`}
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
	);
};
