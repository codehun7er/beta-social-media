import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../features/hooks';
import { explorerGetRandomPosts, setScrollTop } from '../../../features/explorer/explorerSlice';
import { Post } from '../../../UI/Post/Post';

export const ExplorerPostsSearch = () => {
	const { randomPostsData, searchedPosts, searchValue, currentScrollTop } = useSelector(
		state => state.explorer
	);
	const [scrollPosition, setScrollPosition] = useState();
	const { debouncedValue } = useDebounce(scrollPosition, 100);
	const dispatch = useDispatch();
	const listRef = useRef(null);

	useEffect(() => {
		listRef.current.scrollTop = currentScrollTop.posts;
	}, [currentScrollTop.posts]);

	useEffect(() => {
		if (debouncedValue) dispatch(setScrollTop({ type: 'posts', value: debouncedValue }));
	}, [debouncedValue, dispatch]);

	useEffect(() => {
		if (randomPostsData.content.length < 1) dispatch(explorerGetRandomPosts());
	}, [randomPostsData.content.length, dispatch]);

	return (
		<ul ref={listRef} className='explorer__posts-list'>
			{searchValue
				? searchedPosts.content.map(post => <Post key={post.id} post={post} />)
				: randomPostsData.content.map(post => <Post key={post.id} post={post} />)}
		</ul>
	);
};
