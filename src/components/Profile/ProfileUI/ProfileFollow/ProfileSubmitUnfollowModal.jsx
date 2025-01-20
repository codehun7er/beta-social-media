import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../../../UI/Modal';
import { unfollowProfile } from '../../../../features/profile/profileSlice';

export const ProfileSubmitUnfollowModal = ({ isShow, setIsShow }) => {
	const { id, username } = useSelector(state => state.profile.userData);
	const dispatch = useDispatch();

	const handleUnfollow = () => {
		dispatch(unfollowProfile(id));
		setIsShow(false);
	};

	return (
		<Modal isShow={isShow} setIsShow={setIsShow}>
			<div className='profile__modal-submit'>
				<div className='profile__modal-submit-text'>
					Are you sure you want to unfollow {username}?
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
