import { useEffect, useState } from 'react';

import { Select } from '../../../../../UI/Select';

export const ProfileModalSelect = ({ text, inputInfo, setInputInfo }) => {
	const currentGender = inputInfo[text.toLowerCase()];
	const [selectedItem, setSelectedItem] = useState({
		label:
			currentGender === 'NOT_SPECIFIED'
				? 'Not specified'
				: currentGender[0] + currentGender.slice(1).toLowerCase(),
		value: currentGender,
	});

	const options = [
		{ value: 'MALE', label: 'Male' },
		{ value: 'FEMALE', label: 'Female' },
		{ value: 'NOT_SPECIFIED', label: 'Not specified' },
	];

	useEffect(() => {
		setInputInfo(prev => ({ ...prev, [text.toLowerCase()]: selectedItem.value }));
	}, [selectedItem, text, setInputInfo]);

	return (
		<Select
			title='gender'
			options={options}
			selectedItem={selectedItem}
			setSelectedItem={setSelectedItem}
		/>
	);
};
