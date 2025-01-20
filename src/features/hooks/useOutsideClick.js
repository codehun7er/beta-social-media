import { useEffect, useRef, useState } from 'react';

export const useOutsideClick = (initialState = false) => {
	const [isShow, setIsShow] = useState(initialState);
	const targetRef = useRef();
	const btnRef = useRef();

	useEffect(() => {
		const closeDropDown = event => {
			if (
				targetRef.current &&
				!targetRef.current.contains(event.target) &&
				event.target !== btnRef.current &&
				event.target.parentElement !== btnRef.current
			) {
				setIsShow(false);
			}
		};

		document.addEventListener('click', closeDropDown);

		return () => {
			document.removeEventListener('click', closeDropDown);
		};
	});

	return { isShow, setIsShow, targetRef, btnRef };
};
