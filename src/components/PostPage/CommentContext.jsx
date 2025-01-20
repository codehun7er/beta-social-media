import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as EditIcon } from '../../images/edit.svg';
import { ReactComponent as DeleteIcon } from '../../images/delete.svg';
import { ReactComponent as ReportIcon } from '../../images/warning.svg';
import { setReportModalData } from '../../features/report/reportSlice';
import { deleteComment } from '../../features/posts/postsSlice';
import { deleteUserComment } from '../../features/admin/adminSlice';

export const CommentContext = ({ id, isMyComment, setIsShow, setIsEditing }) => {
	const isAdmin = useSelector(state => state.profile.isAdmin);
	const dispatch = useDispatch();

	const handleEdit = () => {
		setIsShow(false);
		setIsEditing(true);
	};

	const handleDeleteComment = () => {
		if (isAdmin && !isMyComment) {
			dispatch(deleteUserComment(id));
		} else {
			dispatch(deleteComment(id));
		}

		setIsShow(false);
	};

	const handleReport = () => {
		dispatch(setReportModalData({ id, show: true, type: 'COMMENT' }));
		setIsShow(false);
	};

	return (
		<>
			{isMyComment ? (
				<>
					<li onClick={handleEdit} className='post-page__comment-context-item'>
						<EditIcon className='post-page__comment-context-item-icon' />
						<span className='post-page__comment-context-text'>Edit</span>
					</li>
					<li onClick={handleDeleteComment} className='post-page__comment-context-item delete'>
						<DeleteIcon className='post-page__comment-context-item-icon' />
						<span className='post-page__comment-context-text'>Delete</span>
					</li>
				</>
			) : (
				<>
					<li onClick={handleReport} className='post-page__comment-context-item delete'>
						<ReportIcon className='post-page__comment-context-item-icon' />
						<span className='post-page__comment-context-text'>Report</span>
					</li>

					<li onClick={handleDeleteComment} className='post-page__comment-context-item delete'>
						<DeleteIcon className='post-page__comment-context-item-icon' />
						<span className='post-page__comment-context-text'>Delete</span>
					</li>
				</>
			)}
		</>
	);
};
