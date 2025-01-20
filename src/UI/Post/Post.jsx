import { useState, useEffect, useRef, useMemo, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useOutsideClick, useDebounce } from '../../features/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'fecha';
import { PostContextMenu } from './PostContextMenu';
import { deletePost, likePost, updatePost } from '../../features/posts/postsSlice';
import ReactQuill from 'react-quill';
import hljs from 'highlight.js';

import { ReactComponent as HeaderButtonIcon } from '../../images/more.svg';
import { ReactComponent as LikeIcon } from '../../images/like.svg';
import { ReactComponent as CommentsIcon } from '../../images/comments.svg';
import './Post.scss';
import 'highlight.js/styles/monokai-sublime.css';

export const Post = forwardRef(({ post }, ref) => {
	const [isLiked, setIsLiked] = useState(post.liked);
	const [isEditing, setIsEditing] = useState(false);
	const [editingInputHTML, setEditingInputHTML] = useState(post.text);
	const [editingInputValue, setEditingInputValue] = useState('');
	const { debouncedValue } = useDebounce(isLiked, 300);
	const miniUserData = useSelector(state => state.profile.miniUserData);
	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick();
	const dispatch = useDispatch();
	const postRef = useRef(null);
	const editorRef = useRef(null);
	const firstEffectRef = useRef(true);
	const location = useLocation();
	const isProfile = location.pathname.includes('users');
	const isCurrentUserPost = miniUserData.id === post.user.id;

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

	const handleChange = (content, delta, source, editor) => {
		setEditingInputHTML(content);
		setEditingInputValue(editor.getText());
	};

	const handleCancelEditing = () => {
		setIsEditing(false);
		setEditingInputHTML(post.text);
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
			dispatch(updatePost({ content: formData, id: post.id }));
		} else {
			dispatch(deletePost(post.id));
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleSubmitEditing();
		}
	};

	useEffect(() => {
		if (!isEditing) postRef.current.innerHTML = post.text;
	}, [isEditing, post.text]);

	useEffect(() => {
		if (debouncedValue !== null) {
			if (!firstEffectRef.current) {
				dispatch(likePost(post.id));
			} else {
				firstEffectRef.current = false;
			}
		}
	}, [debouncedValue, post.id, dispatch]);

	return (
		<div ref={ref} className='post-wrapper'>
			<div className='post'>
				<div className='post__header'>
					{isProfile ? (
						<div className='post__header-info'>
							<img
								className='post__avatar'
								src={isCurrentUserPost ? miniUserData.avatar : post.user.avatar}
								alt='avatar'
							/>

							<div className='post__info'>
								<p className='post__username'>
									{isCurrentUserPost ? miniUserData.username : post.user.username}
								</p>
								<p className='post__time'>{format(post.sendingTime, 'hh:mm A, MMMM Do')}</p>
							</div>
						</div>
					) : (
						<Link to={`/users/${post.user.username}`} className='post__header-info link'>
							<img
								className='post__avatar'
								src={isCurrentUserPost ? miniUserData.avatar : post.user.avatar}
								alt='avatar'
							/>

							<div className='post__info'>
								<p className='post__username'>{post.user.username}</p>
								<p className='post__time'>{format(post.sendingTime, 'hh:mm A, MMMM Do')}</p>
							</div>
						</Link>
					)}

					<HeaderButtonIcon
						ref={btnRef}
						onClick={() => setIsShow(prev => !prev)}
						className='post__header-more'
					/>
				</div>

				{isEditing ? (
					<div className='post__main-editing'>
						<div className='post__editing-input'>
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

						<div className='post__editing-buttons'>
							<button className='post__editing-button' onClick={handleCancelEditing}>
								Cancel
							</button>

							<button className='post__editing-button' onClick={handleSubmitEditing}>
								Save
							</button>
						</div>
					</div>
				) : (
					<>
						<div className='post__main'>
							{post.text && <div className='post__text' ref={postRef} />}
						</div>

						<div className='post__footer'>
							<motion.button
								whileTap={{ scale: 0.9, duration: 0.1 }}
								transition={{ duration: 0.01 }}
								onClick={() => setIsLiked(prev => !prev)}
								className={`post__footer-button ${isLiked ? 'active' : ''}`}
							>
								<LikeIcon className='post__footer-icon like' />
								<span className='post__footer-likes'>{post.countOfLikes}</span>
							</motion.button>

							<Link to={`/posts/${post.id}`} className='post__footer-button'>
								<CommentsIcon className='post__footer-icon' />
								<span className='post__footer-comments'>{post.countOfComments}</span>
							</Link>
						</div>
					</>
				)}
			</div>

			<AnimatePresence>
				{isShow && (
					<motion.ul
						ref={targetRef}
						variants={variants}
						initial='hidden'
						animate='show'
						exit='exit'
						className='post__context'
					>
						<PostContextMenu
							id={post.id}
							isMyPost={isCurrentUserPost}
							setIsShow={setIsShow}
							setIsEditing={setIsEditing}
						/>
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
});
