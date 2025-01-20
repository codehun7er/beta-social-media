import './Chat.scss';
import { useParams } from 'react-router-dom';

import { ChatFooter, ChatHeader, ChatMain } from './ChatComponents';

export const Chat = () => {
	const { code } = useParams();

	return (
		<div className='messenger__chat'>
			<ChatHeader />
			<ChatMain code={code} />
			<ChatFooter code={code} />
		</div>
	);
};
