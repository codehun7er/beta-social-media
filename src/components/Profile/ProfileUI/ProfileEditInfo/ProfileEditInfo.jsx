import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Modal } from '../../../../UI/Modal/Modal';
import { ProfileModalPersonal } from './ProfileModalPersonal';
import { saveProfileInfo } from '../../../../features/profile/profileSlice';

export const ProfileEditInfo = ({ isShow, setIsShow }) => {
	const { userData } = useSelector(state => state.profile);
	const dispatch = useDispatch();

	const [inputInfo, setInputInfo] = useState({
		firstname: userData.firstname,
		lastname: userData.lastname,
		bio: userData.bio,
		gender: userData.gender,
		birthDate: '',
		country: '',
		city: '',

		createProfessionRequests: [],
		updateProfessionRequests: [],
		professionsIdsToDelete: [],

		createJobRequests: [],
		updateJobRequests: [],
		jobsIdsToDelete: [],

		createEducationRequests: [],
		updateEducationRequests: [],
		educationsIdsToDelete: [],

		createSkillRequests: [],
		updateSkillRequests: [],
		skillsIdsToDelete: [],
	});

	const handleSave = () => {
		dispatch(saveProfileInfo(inputInfo));
		setIsShow(false);
	};

	const handleReset = () => {
		setInputInfo({
			firstname: userData.firstname,
			lastname: userData.lastname,
			bio: userData.bio,
			gender: userData.gender,
			birthDate: '',
			country: '',
			city: '',

			createProfessionRequests: [],
			updateProfessionRequests: [],
			professionsIdsToDelete: [],

			createJobRequests: [],
			updateJobRequests: [],
			jobsIdsToDelete: [],

			createEducationRequests: [],
			updateEducationRequests: [],
			educationsIdsToDelete: [],

			createSkillRequests: [],
			updateSkillRequests: [],
			skillsIdsToDelete: [],
		});
	};

	return (
		<Modal isShow={isShow} setIsShow={setIsShow}>
			<div className='modal__header'>
				<h3>Edit information</h3>
				<div onClick={() => setIsShow(false)} className='modal__close' />
			</div>
			<hr />
			<div className='profile__modal-info-main'>
				<div className='profile__modal-info-wrapper'>
					<div className='profile__modal-info-content'>
						<ProfileModalPersonal inputInfo={inputInfo} setInputInfo={setInputInfo} />
					</div>

					<div className='profile__modal-info-buttons'>
						<button onClick={handleReset} className='profile__modal-info-button reset'>
							Reset
						</button>
						<button onClick={handleSave} className='profile__modal-info-button'>
							Save
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};
