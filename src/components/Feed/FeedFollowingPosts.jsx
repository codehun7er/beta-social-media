import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFollowingPosts } from '../../features/feed/feedSlice';
import { Post } from '../../UI/Post/Post';
import { getFollowingPostsPage } from '../../features/feed/feedSlice';

export const FeedFollowingPosts = () => {
	const { followingPostsData, followingPostsDataPage, isPageLoading } = useSelector(
		state => state.feed
	);
	const dispatch = useDispatch();
	const lastPostRef = useRef(null);
	const observerRef = useRef(null);

	useEffect(() => {
		if (followingPostsData.length < 1 && !followingPostsDataPage) dispatch(getFollowingPosts());
	}, [followingPostsData, followingPostsDataPage, dispatch]);

	useEffect(() => {
		const handleObserver = entries => {
			const entry = entries[0];

			if (
				entry.isIntersecting &&
				!isPageLoading &&
				followingPostsDataPage.currentPage + 1 < followingPostsDataPage.totalPage
			) {
				dispatch(getFollowingPostsPage(followingPostsDataPage.currentPage + 1));
			}
		};

		observerRef.current = new IntersectionObserver(handleObserver, { threshold: 1.0 });

		if (followingPostsData.length >= 5) {
			observerRef.current.observe(lastPostRef.current);
		}

		return () => observerRef.current.disconnect();
	}, [isPageLoading, followingPostsData, followingPostsDataPage, dispatch]);

	return (
		followingPostsData && (
			<div className='feed__posts-main'>
				{followingPostsData.map(post => {
					if (
						followingPostsData.length >= 5 &&
						followingPostsData[followingPostsData.length - 2].id === post.id
					) {
						return <Post ref={lastPostRef} key={post.id} post={post} />;
					}

					return <Post key={post.id} post={post} />;
				})}
			</div>
		)
	);
};
