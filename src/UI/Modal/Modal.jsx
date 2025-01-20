import './Modal.scss';
import { useEffect, useRef } from 'react';

export const Modal = ({ isShow, setIsShow, children }) => {
	const modalRef = useRef(null);

	useEffect(() => {
		modalRef.current.focus();
	}, [isShow]);

	useEffect(() => {
		const handleEsc = e => {
			if (e.keyCode === 27) {
				setIsShow(false);
			}
		};

		document.addEventListener('keydown', handleEsc);

		return () => document.removeEventListener('keydown', handleEsc);
	}, [setIsShow]);

	return (
		<div
			ref={modalRef}
			onMouseDown={() => setIsShow(false)}
			className={isShow ? 'modal active' : 'modal'}
		>
			<div className='modal__body'>
				<div onMouseDown={e => e.stopPropagation()} className='modal__content'>
					{children}
				</div>
			</div>
		</div>
	);
};
