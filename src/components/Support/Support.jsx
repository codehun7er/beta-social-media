import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowIcon } from '../../images/next.svg';
import { ReactComponent as QuestionIcon } from '../../images/question.svg';

import './Support.scss';

export const Support = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const originalTitle = document.title;
		document.title = 'Support';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return (
		<div className='support__wrapper'>
			<div className='support'>
				<button onClick={() => navigate(-1)} className='support__back'>
					<ArrowIcon className='support__back-icon' />
				</button>

				<div className='support__header'>
					<h2 className='support__title'>Help & Support</h2>
					<p className='support__subtitle'>itdependency.help@gmail.com</p>
				</div>

				<QuestionIcon className='support__icon' />
				<p className='support__description'>
					Write to us here if you encounter any problems related to our website.
				</p>
			</div>
		</div>
	);
};
