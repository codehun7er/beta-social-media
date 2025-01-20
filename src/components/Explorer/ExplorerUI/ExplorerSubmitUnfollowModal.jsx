import { useDispatch } from 'react-redux';
import { Modal } from '../../../UI/Modal';
import { explorerUnfollowUser } from '../../../features/explorer/explorerSlice';

export const ExplorerSubmitUnfollowModal = ({ isShow, setIsShow, user }) => {
	const dispatch = useDispatch();

	const handleUnfollow = () => {
		dispatch(explorerUnfollowUser(user.id));
		setIsShow(false);
	};

	return (
		<Modal isShow={isShow} setIsShow={setIsShow}>
			<div className='profile__modal-submit'>
				<div className='profile__modal-submit-text'>
					Are you sure you want to unfollow {user.username}?
				</div>

				<div className='profile__modal-submit-buttons'>
					<button className='profile__modal-submit-button' onClick={() => setIsShow(false)}>
						Cancel
					</button>

					<button className='profile__modal-submit-button unfollow' onClick={handleUnfollow}>
						Unfollow
					</button>
				</div>
			</div>
		</Modal>
	);
};
