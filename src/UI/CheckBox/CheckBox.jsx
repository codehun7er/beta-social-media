import './CheckBox.scss';

export const CheckBox = ({ isChecked, setIsChecked, children }) => {
	return (
		<div className='checkbox'>
			<input
				className='checkbox-input'
				type='checkbox'
				checked={isChecked}
				onChange={() => setIsChecked(prev => !prev)}
			/>

			<label onClick={() => setIsChecked(prev => !prev)} className='checkbox-input-label'>
				<span>
					<svg width='12px' height='10px'>
						<use href='#check'></use>
					</svg>
				</span>

				<svg className='checkbox-svg'>
					<symbol id='check' viewBox='0 0 12 10'>
						<polyline points='1.5 6 4.5 9 10.5 1'></polyline>
					</symbol>
				</svg>

				<span>{children}</span>
			</label>
		</div>
	);
};
