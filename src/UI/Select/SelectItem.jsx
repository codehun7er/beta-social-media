export const SelectItem = ({ option, handleClick }) => {
	return (
		<div className='select__item' onClick={() => handleClick(option)}>
			{option.label}
		</div>
	);
};
