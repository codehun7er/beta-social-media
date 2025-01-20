import { useDispatch } from 'react-redux';
import { setReportModalData } from '../../../features/report/reportSlice';
import { ReactComponent as ReportIcon } from '../../../images/warning.svg';

export const ProfileMore = ({ id, setIsShow }) => {
	const dispatch = useDispatch();

	const handleReport = () => {
		dispatch(setReportModalData({ id, show: true, type: 'USER' }));
		setIsShow(false);
	};

	return (
		<>
			<li onClick={handleReport} className='profile__more-report'>
				<ReportIcon className='profile__more-report-icon' />
				<span className='profile__more-report-text'>Report</span>
			</li>
		</>
	);
};
