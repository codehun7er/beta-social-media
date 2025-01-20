import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPost } from '../../features/posts/postsSlice';
import { FullPost } from './FullPost';

import './PostPage.scss';

export const PostPage = () => {
	const { postData } = useSelector(state => state.posts);
	const { id } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getPost(id));
	}, [id, dispatch]);

	return (
		postData && (
			<div className='post-page-wrapper container'>
				<div className='post-page'>
					<FullPost />
				</div>
			</div>
		)
	);
};
