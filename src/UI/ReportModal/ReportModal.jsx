import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { report, fullReportReset, setReportModalDataShow } from '../../features/report/reportSlice';
import { Modal } from '../../UI/Modal';

export const ReportModal = () => {
	const [inputValue, setInputValue] = useState('');
	const { reportModalData } = useSelector(state => state.report);
	const dispatch = useDispatch();

	const handleSave = () => {
		const data = {
			id: reportModalData.id,
			type: reportModalData.type,
			text: inputValue,
		};

		dispatch(report(data));
		dispatch(setReportModalDataShow(false));
		setInputValue('');
	};

	const setIsShow = payload => {
		dispatch(setReportModalDataShow(payload));
	};

	useEffect(() => {
		if (!reportModalData.show) {
			setInputValue('');
			dispatch(fullReportReset());
		}
	}, [dispatch, reportModalData.show]);

	return (
		<Modal isShow={reportModalData.show} setIsShow={setIsShow}>
			<div className='post-page__comment-report'>
				<h2 className='post-page__comment-report-text'>
					Report {reportModalData.type?.toLowerCase()}
				</h2>

				<textarea
					placeholder="What's the problem"
					className='post-page__comment-report-input'
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					rows={4}
					maxLength='150'
				/>
				<div className='post-page__comment-report-buttons'>
					<button
						onClick={() => dispatch(setReportModalDataShow(false))}
						className='post-page__comment-report-button'
					>
						Cancel
					</button>

					<button onClick={handleSave} className='post-page__comment-report-button'>
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
};
