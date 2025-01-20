import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllFeedPosts, getAllFeedPostsPage } from '../../features/feed/feedSlice';
import { Post } from '../../UI/Post/Post';

export const FeedAllPosts = () => {
	const { allPostsData, allPostsDataPage, isPageLoading } = useSelector(state => state.feed);
	const lastPostRef = useRef(null);
	const observerRef = useRef(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (allPostsData.length < 1 && !allPostsDataPage) dispatch(getAllFeedPosts());
	}, [allPostsData, allPostsDataPage, dispatch]);

	useEffect(() => {
		const handleObserver = entries => {
			const entry = entries[0];

			if (
				entry.isIntersecting &&
				!isPageLoading &&
				allPostsDataPage.currentPage + 1 < allPostsDataPage.totalPage
			) {
				dispatch(getAllFeedPostsPage(allPostsDataPage.currentPage + 1));
			}
		};

		observerRef.current = new IntersectionObserver(handleObserver, { threshold: 1.0 });

		if (allPostsData.length >= 5) {
			observerRef.current.observe(lastPostRef.current);
		}

		return () => observerRef.current.disconnect();
	}, [allPostsData, allPostsDataPage, isPageLoading, dispatch]);

	return (
		allPostsData && (
			<div className='feed__posts-main'>
				{allPostsData.map(post => {
					if (allPostsData.length >= 5 && allPostsData[allPostsData.length - 2].id === post.id) {
						return <Post ref={lastPostRef} key={post.id} post={post} />;
					}

					return <Post key={post.id} post={post} />;
				})}
			</div>
		)
	);
};
