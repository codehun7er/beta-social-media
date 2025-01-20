import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../images/edit.svg';
import { ReactComponent as DeleteIcon } from '../../images/delete.svg';
import { ReactComponent as ReportIcon } from '../../images/warning.svg';
import { deletePost } from '../../features/posts/postsSlice';
import { setReportModalData } from '../../features/report/reportSlice';
import { deleteUserPost } from '../../features/admin/adminSlice';

export const PostContextMenu = ({ id, isMyPost, setIsShow, isPostPage = false, setIsEditing }) => {
	const isAdmin = useSelector(state => state.profile.isAdmin);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleEdit = () => {
		setIsShow(false);
		setIsEditing(true);
	};

	const handleDeletePost = () => {
		if (isAdmin && !isMyPost) {
			dispatch(deleteUserPost(id));
		} else {
			dispatch(deletePost(id));
		}

		if (isPostPage) navigate('/feed');
		setIsShow(false);
	};

	const handleReportPost = () => {
		dispatch(setReportModalData({ id, show: true, type: 'POST' }));
		setIsShow(false);
	};

	return (
		<>
			{isMyPost ? (
				<>
					<li onClick={handleEdit} className='post__context-item'>
						<EditIcon className='post__context-item-icon' />
						<span className='post__context-text'>Edit</span>
					</li>

					<li onClick={handleDeletePost} className='post__context-item delete'>
						<DeleteIcon className='post__context-item-icon' />
						<span className='post__context-text'>Delete</span>
					</li>
				</>
			) : (
				<>
					<li onClick={handleReportPost} className='post__context-item delete'>
						<ReportIcon className='post__context-item-icon' />
						<span className='post__context-text'>Report</span>
					</li>

					{isAdmin && (
						<li onClick={handleDeletePost} className='post__context-item delete'>
							<DeleteIcon className='post__context-item-icon' />
							<span className='post__context-text'>Delete</span>
						</li>
					)}
				</>
			)}
		</>
	);
};
