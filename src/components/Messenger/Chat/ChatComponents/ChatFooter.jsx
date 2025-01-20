import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStompClient } from '../../../../features/hooks/useStompClient';
import { deleteActions, setNewDraft, setNewEditDraft } from '../../../../features/chat/chatSlice';
import { setLastDraft } from '../../../../features/messenger/messengerSlice';
import { ChatInputActions } from '../ChatUI/ChatInputActions';

import ReactQuill from 'react-quill';
import hljs from 'highlight.js';

import { ReactComponent as SendIcon } from '../../../../images/send.svg';

export const ChatFooter = ({ code }) => {
	const {
		currentChatDraft,
		currentChatEditDraft,
		lastChatCode,
		currentChatCode,
		chatDrafts,
		chatData,
		currentChatInputActions,
		currentChatSendType,
		currentChat,
	} = useSelector(state => state.chat);

	const [postInput, setPostInput] = useState('');
	const dispatch = useDispatch();
	const inputRef = useRef(null);
	const stompClient = useStompClient();

	const editAction = currentChatInputActions.find(action => action.type === 'EDIT');

	const sendMessage = e => {
		if (e) e.preventDefault();

		if (stompClient) {
			switch (currentChatSendType) {
				case 'SEND':
					const chatMessage = {
						code,
						text: currentChatDraft,
					};

					if (currentChatDraft.replace(/<[^>]*>/g, '').trim()) {
						dispatch(setNewDraft({ code, draft: '' }));
						dispatch(setLastDraft({ code, text: '' }));
						stompClient.send('/app/send', {}, JSON.stringify(chatMessage));

						if (currentChat.draft.text) {
							stompClient.send('/app/draft', {}, JSON.stringify({ code, text: '' }));
						}
					}
					break;

				case 'EDIT':
					const editedMessage = {
						code,
						messageId: currentChatInputActions[0].message.id,
						text: currentChatEditDraft,
					};

					if (
						currentChatInputActions[0]?.message.text !== currentChatEditDraft &&
						currentChatEditDraft
					) {
						stompClient.send('/app/edit', {}, JSON.stringify(editedMessage));
					}

					dispatch(deleteActions('ONE'));
					dispatch(setNewEditDraft(''));
					break;

				default:
					break;
			}
		}
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
		if (editAction) {
			dispatch(setNewEditDraft(content));
			return;
		}

		setPostInput(editor.getText());
		dispatch(setNewDraft({ code, draft: content }));
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			sendMessage();
		}
	};

	useEffect(() => {
		const chatDraftsItem = chatDrafts[lastChatCode]?.replace(/<[^>]*>/g, '').trim();
		const chatDataDraft = chatData[lastChatCode]?.draft?.text.replace(/<[^>]*>/g, '').trim();

		if (
			lastChatCode &&
			chatDraftsItem !== chatDataDraft &&
			chatData[lastChatCode].id &&
			stompClient
		) {
			const draft = {
				code: lastChatCode,
				text: chatDraftsItem,
			};

			stompClient.send('/app/draft', {}, JSON.stringify(draft));
		}
	}, [currentChatCode]);

	useEffect(() => {
		const handleKeyPress = () => {
			if (currentChatCode) {
				inputRef.current.focus();
			}
		};

		document.addEventListener('keypress', handleKeyPress);

		return () => {
			document.removeEventListener('keypress', handleKeyPress);
		};
	}, [currentChatCode, dispatch]);

	return (
		currentChat &&
		!currentChat.deleted && (
			<div className='messenger__chat-footer-wrapper'>
				{currentChatInputActions[0] && <ChatInputActions />}
				<form onSubmit={sendMessage} className='messenger__chat-footer'>
					<div className='messenger__chat-input-wrapper'>
						<ReactQuill
							ref={inputRef}
							value={editAction ? currentChatEditDraft : currentChatDraft}
							onKeyDown={handleKeyDown}
							onChange={handleChange}
							placeholder='Message...'
							theme='snow'
							modules={modules}
							formats={formats}
						/>
					</div>
					<button className='messenger__chat-footer-submit' type='submit'>
						<SendIcon className='messenger__chat-footer-send' />
					</button>
				</form>
			</div>
		)
	);
};
