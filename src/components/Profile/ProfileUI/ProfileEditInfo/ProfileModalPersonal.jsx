import { ProfileModalInput, ProfileModalSelect, ProfileModalTextarea } from './ProfileEditUI';

export const ProfileModalPersonal = ({ inputInfo, setInputInfo }) => {
	return (
		<>
			<ProfileModalInput text='Firstname' inputInfo={inputInfo} setInputInfo={setInputInfo} />
			<ProfileModalInput text='Lastname' inputInfo={inputInfo} setInputInfo={setInputInfo} />
			<ProfileModalTextarea text='Bio' inputInfo={inputInfo} setInputInfo={setInputInfo} />
			<ProfileModalSelect text='Gender' inputInfo={inputInfo} setInputInfo={setInputInfo} />
		</>
	);
};
