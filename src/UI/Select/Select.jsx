import { useOutsideClick } from '../../features/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectItem } from './SelectItem';

import { ReactComponent as ArrowIcon } from '../../images/arrow.svg';
import './Select.scss';

export const Select = ({ title, selectedItem, setSelectedItem, options }) => {
	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick(false);

	const variants = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				duration: 0.1,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				duration: 0.1,
			},
		},
	};

	const handleClick = payload => {
		setSelectedItem(payload);
		setIsShow(false);
	};

	return (
		<div className='select'>
			<div className='selectBox'>
				<div ref={btnRef} className='selectBox__value' onClick={() => setIsShow(prev => !prev)}>
					<span>{selectedItem.label ? selectedItem.label : 'Not selected'}</span>
					<ArrowIcon className={`selectBox__icon ${isShow ? 'active' : ''}`} />
				</div>
				<span className='selectBox__label gender'>{title}</span>
			</div>
			<AnimatePresence>
				{isShow && (
					<motion.span
						ref={targetRef}
						className='select__dropdown'
						variants={variants}
						initial='hidden'
						animate='show'
						exit='exit'
					>
						{options.map(option => (
							<SelectItem key={option.value} option={option} handleClick={handleClick} />
						))}
					</motion.span>
				)}
			</AnimatePresence>
		</div>
	);
};
