export const ProfileModalInput = ({ text, inputInfo, setInputInfo }) => {
	const handleChange = e => {
		setInputInfo(prev => ({ ...prev, [text.toLowerCase()]: e.target.value }));
	};

	return (
		<div className='profile__modal-info-inputBox'>
			<input
				value={inputInfo[text.toLowerCase()]}
				onChange={handleChange}
				className='profile__modal-info-inputBox-input'
				required
				maxLength='20'
			/>
			<label className='profile__modal-info-inputBox-label'>{text}</label>
		</div>
	);
};
