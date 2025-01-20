export const ProfileModalTextarea = ({ text, inputInfo, setInputInfo }) => {
	return (
		<div className='profile__modal-info-inputBox'>
			<textarea
				value={inputInfo[text.toLowerCase()] ? inputInfo[text.toLowerCase()] : ''}
				onChange={e => setInputInfo(prev => ({ ...prev, [text.toLowerCase()]: e.target.value }))}
				className='profile__modal-info-inputBox-input'
				required
				rows='4'
				maxLength='240'
			/>
			<label className='profile__modal-info-inputBox-label textarea'>{text}</label>
		</div>
	);
};
