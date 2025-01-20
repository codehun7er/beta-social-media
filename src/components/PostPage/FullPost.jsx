import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutsideClick, useDebounce } from '../../features/hooks';
import { Link } from 'react-router-dom';
import { format } from 'fecha';
import { motion, AnimatePresence } from 'framer-motion';
import { PostContextMenu } from '../../UI/Post/PostContextMenu';
import { deletePost, likePost, updatePost } from '../../features/posts/postsSlice';
import { Comments } from './Comments';
import hljs from 'highlight.js';

import { ReactComponent as HeaderButtonIcon } from '../../images/more.svg';
import { ReactComponent as LikeIcon } from '../../images/like.svg';
import { ReactComponent as CommentsIcon } from '../../images/comments.svg';
import ReactQuill from 'react-quill';

export const FullPost = () => {
	const { postData } = useSelector(state => state.posts);
	const { miniUserData } = useSelector(state => state.profile);
	const [isEditing, setIsEditing] = useState(false);
	const [editingInputHTML, setEditingInputHTML] = useState(postData.text);
	const [editingInputValue, setEditingInputValue] = useState('');
	const [isLiked, setIsLiked] = useState(postData.liked);
	const { debouncedValue } = useDebounce(isLiked, 300);
	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick();
	const dispatch = useDispatch();
	const postRef = useRef(null);
	const inputRef = useRef(null);
	const editorRef = useRef(null);
	const firstEffectRef = useRef(true);
	const isCurrentUserPost = postData.user.id === miniUserData.id;

	const variants = {
		hidden: {
			opacity: 0,
			y: '-15px',
		},

		show: {
			y: '0px',
			opacity: 1,
			transition: {
				bounce: 0,
				duration: 0.2,
			},
		},

		exit: {
			y: '-15px',
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	const formats = [
		'bold',
		'code',
		'italic',
		'link',
		'strike',
		'script',
		'underline',
		'list',
		'code-block',
		'formula',
	];

	const modules = useMemo(
		() => ({
			toolbar: [
				['bold', 'italic', 'underline', 'strike', 'link'],
				['code-block'],
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ script: 'sub' }, { script: 'super' }],
				['clean'],
			],
			syntax: {
				highlight: text => hljs.highlight(text, { language: 'javascript' }).value,
			},
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
			keyboard: {
				bindings: {
					enter: {
						key: 13,
						handler: () => {
							return false;
						},
					},
				},
			},
		}),
		[]
	);

	const handleCommentsClick = () => {
		inputRef.current.focus();
	};

	const handleChange = (content, delta, source, editor) => {
		setEditingInputHTML(content);
		setEditingInputValue(editor.getText());
	};

	const handleCancelEditing = () => {
		setIsEditing(false);
		setEditingInputHTML(postData.text);
		setEditingInputValue('');
	};

	const handleSubmitEditing = () => {
		if (editingInputValue.trim()) {
			const data = {
				text: editingInputHTML,
			};

			const formData = new FormData();
			const blob = new Blob([JSON.stringify(data)], {
				type: 'application/json',
			});

			setIsEditing(false);
			setEditingInputValue('');
			formData.append('newPost', blob);
			dispatch(updatePost({ content: formData, id: postData.id }));
		} else {
			dispatch(deletePost(postData.id));
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleSubmitEditing();
		}
	};

	useEffect(() => {
		if (!isEditing) postRef.current.innerHTML = postData.text;
	}, [isEditing, postData.text]);

	useEffect(() => {
		if (debouncedValue !== null) {
			if (!firstEffectRef.current) {
				dispatch(likePost(postData.id));
			} else {
				firstEffectRef.current = false;
			}
		}
	}, [debouncedValue, postData.id, dispatch]);

	return (
		postData && (
			<div className='post-page__post-wrapper'>
				<div className='post-page__post'>
					<div className='post-page__post-header'>
						<Link to={`/users/${postData.user.username}`} className='post__header-info link'>
							<img
								className='post-page__post-avatar'
								src={isCurrentUserPost ? miniUserData.avatar : postData.user.avatar}
								alt='avatar'
							/>

							<div className='post-page__post-info'>
								<p className='post-page__post-username'>{postData.user.username}</p>
								<p className='post-page__post-time'>
									{format(postData.sendingTime, 'hh:mm A, MMMM Do')}
								</p>
							</div>
						</Link>

						<HeaderButtonIcon
							ref={btnRef}
							onClick={() => setIsShow(prev => !prev)}
							className='post-page__post-header-more'
						/>
					</div>

					{isEditing ? (
						<div className='post-page__post-main-editing'>
							<div className='post-page__post-editing-input'>
								<ReactQuill
									ref={editorRef}
									value={editingInputHTML}
									onKeyDown={handleKeyDown}
									onChange={handleChange}
									placeholder='Edit your post'
									theme='snow'
									formats={formats}
									modules={modules}
								/>
							</div>

							<div className='post-page__post-editing-buttons'>
								<button className='post-page__post-editing-button' onClick={handleCancelEditing}>
									Cancel
								</button>

								<button className='post-page__post-editing-button' onClick={handleSubmitEditing}>
									Save
								</button>
							</div>
						</div>
					) : (
						<>
							<div className='post-page__post-main'>
								{postData.text && <div className='post-page__post-text' ref={postRef} />}
							</div>

							<div className='post-page__post-footer'>
								<motion.button
									whileTap={{ scale: 0.9, duration: 0.1 }}
									transition={{ duration: 0.01 }}
									onClick={() => setIsLiked(prev => !prev)}
									className={`post-page__post-footer-button ${isLiked ? 'active' : ''}`}
								>
									<LikeIcon className='post-page__post-footer-icon like' />
									<span className='post-page__post-footer-likes'>{postData.countOfLikes}</span>
								</motion.button>

								<button onClick={handleCommentsClick} className='post-page__post-footer-button'>
									<CommentsIcon className='post-page__post-footer-icon' />
									<span className='post-page__post-footer-comments'>
										{postData.countOfComments}
									</span>
								</button>
							</div>
						</>
					)}
				</div>

				<hr className='post-page__line' />

				<Comments ref={inputRef} />

				<AnimatePresence>
					{isShow && (
						<motion.ul
							ref={targetRef}
							variants={variants}
							initial='hidden'
							animate='show'
							exit='exit'
							className='post-page__post-context'
						>
							<PostContextMenu
								id={postData.id}
								isMyPost={isCurrentUserPost}
								setIsShow={setIsShow}
								isPostPage={true}
								setIsEditing={setIsEditing}
							/>
						</motion.ul>
					)}
				</AnimatePresence>
			</div>
		)
	);
};
