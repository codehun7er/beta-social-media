import { useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPost } from '../../../../features/posts/postsSlice';

import ReactQuill from 'react-quill';
import hljs from 'highlight.js';
import './Quill.scss';

export const ProfilePostsInput = () => {
	const { miniUserData } = useSelector(state => state.profile);
	const [postInput, setPostInput] = useState('');
	const [postInputHTML, setPostInputHTML] = useState('');
	const editorRef = useRef(null);
	const dispatch = useDispatch();

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

	const handleClick = () => {
		if (postInput.trim()) {
			const formData = new FormData();
			const blob = new Blob([JSON.stringify({ text: postInputHTML.trim() })], {
				type: 'application/json',
			});

			setPostInput('');
			setPostInputHTML('');
			formData.append('newPost', blob);
			dispatch(createPost(formData));
		}
	};

	const handleChange = (content, delta, source, editor) => {
		setPostInputHTML(content);
		setPostInput(editor.getText());
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleClick();
		}
	};

	return (
		<div className='profile__posts-input'>
			<div className='profile__posts-input-main'>
				<div className='profile__posts-input-avatar-wrapper'>
					<img className='profile__posts-input-avatar' src={miniUserData.avatar} alt='avatar' />
				</div>

				<ReactQuill
					ref={editorRef}
					value={postInputHTML}
					onKeyDown={handleKeyDown}
					onChange={handleChange}
					placeholder='Tell the world about IT'
					theme='snow'
					modules={modules}
					formats={formats}
				/>
			</div>

			<button className='profile__posts-input-submit' onClick={handleClick}>
				Post
			</button>
		</div>
	);
};
