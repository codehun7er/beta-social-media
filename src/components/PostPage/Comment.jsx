import { useState, useEffect, useRef, useMemo, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutsideClick, useDebounce } from '../../features/hooks';
import { Link } from 'react-router-dom';
import { format } from 'fecha';
import { motion, AnimatePresence } from 'framer-motion';
import { CommentContext } from './CommentContext';
import { deleteComment, likeComment, updateComment } from '../../features/posts/postsSlice';
import ReactQuill from 'react-quill';

import { ReactComponent as LikeIcon } from '../../images/like.svg';
import { ReactComponent as MoreIcon } from '../../images/more.svg';

export const Comment = forwardRef(({ comment }, ref) => {
	const [isCommentHovered, setIsCommentHovered] = useState(false);
	const [isLiked, setIsLiked] = useState(comment.liked);
	const [isEditing, setIsEditing] = useState(false);
	const [editingInputHTML, setEditingInputHTML] = useState(comment.text);
	const [editingInputValue, setEditingInputValue] = useState('');
	const { miniUserData } = useSelector(state => state.profile);
	const { debouncedValue } = useDebounce(isLiked, 300);
	const { isShow, setIsShow, targetRef, btnRef } = useOutsideClick();
	const isCurrentUserComment = comment.user.id === miniUserData.id;
	const inputRef = useRef(null);
	const firstEffectRef = useRef(true);
	const dispatch = useDispatch();

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

	const onMouseLeave = () => {
		setIsShow(false);
		setIsCommentHovered(false);
	};

	const handleChange = (content, delta, source, editor) => {
		setEditingInputHTML(content);
		setEditingInputValue(editor.getText());
	};

	const handleCancelEditing = () => {
		setIsEditing(false);
		setEditingInputHTML(comment.text);
		setEditingInputValue('');
	};

	const handleSubmitEditing = () => {
		if (editingInputValue.trim()) {
			const data = {
				text: editingInputValue,
			};

			const formData = new FormData();
			const blob = new Blob([JSON.stringify(data)], {
				type: 'application/json',
			});

			setIsEditing(false);
			setEditingInputValue('');
			setEditingInputHTML(editingInputValue);
			formData.append('newComment', blob);
			dispatch(updateComment({ content: formData, id: comment.id }));
		} else {
			dispatch(deleteComment(comment.id));
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleSubmitEditing();
		}
	};

	useEffect(() => {
		if (isEditing) {
			inputRef.current.editor.setSelection(inputRef.current.editor.getLength());
		}
	}, [isEditing]);

	useEffect(() => {
		if (debouncedValue !== null) {
			if (!firstEffectRef.current) {
				dispatch(likeComment(comment.id));
			} else {
				firstEffectRef.current = false;
			}
		}
	}, [debouncedValue, comment.id, dispatch]);

	return (
		<div
			ref={ref}
			onMouseEnter={() => setIsCommentHovered(true)}
			onMouseLeave={onMouseLeave}
			className='post-page__comment-wrapper'
		>
			<div className={`post-page__comment ${isEditing ? '' : 'hover'}`}>
				<Link to={`/users/${comment.user.username}`} className='post-page__comment-avatar-wrapper'>
					<img className='post-page__post-avatar' src={comment.user.avatar} alt='avatar' />
				</Link>

				<div className='post-page__comment-info'>
					<div className='post-page__comment-info-header'>
						<div className='post-page__comment-info-header-left'>
							<Link to={`/users/${comment.user.username}`} className='post-page__comment-username'>
								{comment.user.username}
							</Link>

							<p className='post-page__comment-time'>
								{format(comment.sendingTime, 'hh:mm A, MMMM Do')}
							</p>
						</div>

						{isCommentHovered && !isEditing && (
							<MoreIcon
								ref={btnRef}
								onClick={() => setIsShow(prev => !prev)}
								className='post-page__post-header-more'
							/>
						)}
					</div>

					{isEditing ? (
						<div className='post-page__comment-main-editing'>
							<div className='post-page__comment-editing-input'>
								<ReactQuill
									ref={inputRef}
									value={editingInputHTML}
									onKeyDown={handleKeyDown}
									onChange={handleChange}
									placeholder='Edit your comment'
									theme='snow'
									formats={[]}
									modules={modules}
								/>
							</div>

							<div className='post-page__comment-editing-buttons'>
								<button className='post-page__comment-editing-button' onClick={handleCancelEditing}>
									Cancel
								</button>

								<button className='post-page__comment-editing-button' onClick={handleSubmitEditing}>
									Save
								</button>
							</div>
						</div>
					) : (
						<>
							<div className='post-page__comment-main'>
								<div className='post-page__comment-text'>{comment.text}</div>
							</div>

							<motion.button
								whileTap={{ scale: 0.9, duration: 0.1 }}
								transition={{ duration: 0.01 }}
								onClick={() => setIsLiked(prev => !prev)}
								className={`post-page__comment-like ${isLiked ? 'active' : ''}`}
							>
								<LikeIcon className='post-page__comment-icon' />
								<span className='post-page__comment-like-count'>{comment.countOfLikes}</span>
							</motion.button>
						</>
					)}
				</div>

				<AnimatePresence>
					{isShow && !isEditing && (
						<motion.ul
							ref={targetRef}
							variants={variants}
							initial='hidden'
							animate='show'
							exit='exit'
							className='post-page__comment-context'
						>
							<CommentContext
								id={comment.id}
								isMyComment={isCurrentUserComment}
								setIsShow={setIsShow}
								setIsEditing={setIsEditing}
							/>
						</motion.ul>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
});
