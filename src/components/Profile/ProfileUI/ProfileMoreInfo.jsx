import { useSelector } from 'react-redux';
import { format } from 'fecha';
import { Modal } from '../../../UI/Modal';

export const ProfileMoreInfo = ({ isShow, setIsShow }) => {
	const { email, bio, registrationTime, gender } = useSelector(state => state.profile.userData);

	return (
		<Modal isShow={isShow} setIsShow={setIsShow}>
			<div className='modal__header'>
				<h3>Detailed information</h3>
				<div onClick={() => setIsShow(false)} className='modal__close' />
			</div>
			<hr />
			<div className='profile__modal-info-main'>
				<p className='profile__modal-info-main-text'>
					<span>Registration time:</span> {format(registrationTime, 'DD MMMM, YYYY')}
				</p>

				<p className='profile__modal-info-main-text'>
					<span>Email:</span> {email}
				</p>

				{bio && (
					<p className='profile__modal-info-main-text'>
						<span>Bio:</span> {bio}
					</p>
				)}

				{gender && (
					<p className='profile__modal-info-main-text'>
						<span>Gender:</span> {gender[0] + gender.slice(1).toLowerCase()}
					</p>
				)}
			</div>
		</Modal>
	);
};
