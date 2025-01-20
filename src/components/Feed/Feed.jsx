import { useEffect } from 'react';
import { FeedPosts } from './FeedPosts';

import './Feed.scss';
import { FeedInput } from './FeedInput';

export const Feed = () => {
	useEffect(() => {
		const originalTitle = document.title;
		document.title = 'Feed';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return (
		<div className='feed container'>
			<FeedInput />
			<FeedPosts />
		</div>
	);
};
