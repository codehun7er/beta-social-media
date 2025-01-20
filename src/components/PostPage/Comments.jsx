import { useState, useEffect, useRef, useMemo, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createComment, getCommentsPage } from '../../features/posts/postsSlice';
import { useParams } from 'react-router-dom';
import { Comment } from './Comment';
import ReactQuill from 'react-quill';

import { ReactComponent as SendIcon } from '../../images/send.svg';

export const Comments = forwardRef((props, ref) => {
	const [inputValue, setInputValue] = useState('');
	const [inputHTML, setInputHTML] = useState('');
	const miniUserData = useSelector(state => state.profile.miniUserData);
	const { postData, comments, isPageLoading } = useSelector(state => state.posts);
	const observerRef = useRef(null);
	const lastCommentRef = useRef(null);
	const dispatch = useDispatch();
	const { id } = useParams();

	const modules = useMemo(
		() => ({
			toolbar: false,
			clipboard: {
				matchers: [
					[
						'img',
						(node, delta) => {
							return delta;
						},
					],
				],
			},
		}),
		[]
	);

	const handleSubmit = () => {
		if (inputValue.trim()) {
			const data = {
				text: inputValue,
				chatId: postData.postCommentChatId,
			};

			const formData = new FormData();
			const blob = new Blob([JSON.stringify(data)], {
				type: 'application/json',
			});

			formData.append('newComment', blob);
			setInputValue('');
			setInputHTML('');
			dispatch(createComment(formData));
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleSubmit();
		}
	};

	const handleChange = (content, delta, source, editor) => {
		setInputHTML(content);
		setInputValue(editor.getText());
	};

	useEffect(() => {
		const handleObserver = entries => {
			const entry = entries[0];

			if (entry.isIntersecting && !isPageLoading && comments.currentPage + 1 < comments.totalPage) {
				dispatch(getCommentsPage({ id, page: comments.currentPage + 1 }));
			}
		};

		observerRef.current = new IntersectionObserver(handleObserver, { threshold: 1.0 });

		if (comments.content.length >= 5) {
			observerRef.current.observe(lastCommentRef.current);
		}

		return () => observerRef.current.disconnect();
	}, [comments, id, isPageLoading, dispatch]);

	return (
		<div className='post-page__comments'>
			<div className='post-page__comments-form'>
				<div className='post-page__comments-form-info'>
					<span className='post-page__comments-avatar-wrapper'>
						<img className='post-page__post-avatar' src={miniUserData.avatar} alt='avatar' />
					</span>

					<ReactQuill
						ref={ref}
						value={inputHTML}
						onKeyDown={handleKeyDown}
						onChange={handleChange}
						placeholder='Comment...'
						theme='snow'
						formats={[]}
						modules={modules}
					/>
				</div>

				<button onClick={handleSubmit} className='post-page__comments-form-button'>
					<SendIcon className='post-page__comments-form-icon' />
				</button>
			</div>

			<div className='post-page__comments-main'>
				<h2 className='post-page__comments-count'>{postData.countOfComments} comments</h2>
				{comments.content.map(comment => {
					if (
						comments.content.length >= 5 &&
						comments.content[comments.content.length - 3].id === comment.id
					) {
						return <Comment ref={lastCommentRef} key={comment.id} comment={comment} />;
					}

					return <Comment key={comment.id} comment={comment} />;
				})}
			</div>
		</div>
	);
});
