import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchMorePosts } from "../postSlice.js";
import PostCard from "./PostCard.jsx";

export default function PostFeed({ groupId }) {
	const dispatch = useDispatch();
	const posts = useSelector((s) => s.post.posts);
	const status = useSelector((s) => s.post.status);
	const meta = useSelector((s) => s.post.meta);

	useEffect(() => {
		dispatch(fetchPosts({ page: 1, limit: 10, groupId }));
	}, [dispatch, groupId]);

	const handleLoadMore = () => {
		if (meta.page < meta.totalPages) {
			dispatch(fetchMorePosts({ page: meta.page + 1, limit: meta.limit, groupId }));
		}
	};

	if (status === "loading" && posts.length === 0) {
		return (
			<div className="space-y-3">
				{[1, 2, 3].map((i) => (
					<div key={i} className="rounded-xl border border-white/8 bg-white/3 p-4 animate-pulse space-y-3">
						<div className="flex items-center gap-2.5">
							<div className="h-9 w-9 rounded-full bg-white/10" />
							<div className="space-y-1.5">
								<div className="h-3 w-24 rounded bg-white/10" />
								<div className="h-2 w-16 rounded bg-white/8" />
							</div>
						</div>
						<div className="space-y-2">
							<div className="h-3 w-full rounded bg-white/8" />
							<div className="h-3 w-4/5 rounded bg-white/8" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (status === "failed") {
		return (
			<div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
				<p className="text-sm text-red-400">Failed to load posts.</p>
				<button
					onClick={() => dispatch(fetchPosts({ page: 1, limit: 10, groupId }))}
					className="mt-2 text-xs text-sky-400 hover:underline"
				>
					Try again
				</button>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="rounded-xl border border-white/8 bg-white/3 p-8 text-center">
				<p className="text-sm text-neutral-400">No posts yet. Be the first to share something!</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}

			{meta.page < meta.totalPages && (
				<button
					onClick={handleLoadMore}
					className="w-full rounded-xl border border-white/8 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
				>
					Load more
				</button>
			)}
		</div>
	);
}
