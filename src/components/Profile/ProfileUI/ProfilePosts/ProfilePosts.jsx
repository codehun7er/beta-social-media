import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../../../../UI/Post/Post';
import { getUserPostsPage } from '../../../../features/profile/profileSlice';

export const ProfilePosts = () => {
	const { postsData, isPageLoading, userData } = useSelector(state => state.profile);
	const dispatch = useDispatch();
	const lastPostRef = useRef(null);
	const observerRef = useRef(null);

	useEffect(() => {
		const handleObserver = entries => {
			const entry = entries[0];

			if (
				entry.isIntersecting &&
				!isPageLoading &&
				postsData.currentPage + 1 < postsData.totalPage
			) {
				dispatch(getUserPostsPage({ id: userData.id, page: postsData.currentPage + 1 }));
			}
		};

		observerRef.current = new IntersectionObserver(handleObserver, { threshold: 1.0 });

		if (postsData.content.length > 5) {
			observerRef.current.observe(lastPostRef.current);
		}

		return () => observerRef.current.disconnect();
	}, [userData.id, isPageLoading, postsData, dispatch]);

	return postsData.content.map(post => {
		if (
			postsData.content.length > 5 &&
			postsData.content[postsData.content.length - 3].id === post.id
		) {
			return <Post ref={lastPostRef} key={post.id} post={post} />;
		}

		return <Post key={post.id} post={post} />;
	});
};
