import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { selectCurrentUser } from "../../auth/authSlice.js";
import { fetchUserPosts } from "../../post/postSlice.js";
import { fetchFollowCounts } from "../userSlice.js";
import { getUserByIdRequest } from "../services/followService.js";
import PostCard from "../../post/components/PostCard.jsx";
import FollowButton from "../components/FollowButton.jsx";
import FollowListModal from "../components/FollowListModal.jsx";
import Sidebar from "../../../components/layout/Sidebar.jsx";

dayjs.extend(relativeTime);

function AvatarDisplay({ user, size = 96 }) {
	if (user.avatar) {
		return (
			<img src={user.avatar} alt={user.username}
				style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover",
					border: "3px solid rgba(255,255,255,0.1)" }} />
		);
	}
	return (
		<div className="flex items-center justify-center font-bold"
			style={{ width: size, height: size, borderRadius: "50%",
				background: "linear-gradient(135deg, #38bdf8, #a855f7)",
				color: "#0a0a0a", fontSize: size * 0.35,
				border: "3px solid rgba(255,255,255,0.1)" }}>
			{user.username?.[0]?.toUpperCase()}
		</div>
	);
}

function UserPostsTab({ userId }) {
	const dispatch = useDispatch();
	const posts = useSelector((s) => s.post.userPosts);
	const meta = useSelector((s) => s.post.userPostsMeta);
	const status = useSelector((s) => s.post.userPostsStatus);

	useEffect(() => {
		if (userId) dispatch(fetchUserPosts({ authorId: userId, page: 1, limit: 10 }));
	}, [userId, dispatch]);

	if (status === "loading" && posts.length === 0) {
		return (
			<div className="space-y-3 mt-4">
				{[1, 2].map((i) => (
					<div key={i} className="rounded-xl border border-white/8 bg-white/3 p-4 animate-pulse space-y-3">
						<div className="flex items-center gap-2.5">
							<div className="h-9 w-9 rounded-full bg-white/10" />
							<div className="space-y-1.5">
								<div className="h-3 w-24 rounded bg-white/10" />
								<div className="h-2 w-16 rounded bg-white/8" />
							</div>
						</div>
						<div className="h-3 w-full rounded bg-white/8" />
					</div>
				))}
			</div>
		);
	}

	if (status === "succeeded" && posts.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-white/10 p-10 text-center mt-4">
				<p className="text-sm text-neutral-500">No posts yet.</p>
			</div>
		);
	}

	return (
		<div className="space-y-3 mt-4">
			{posts.map((post) => <PostCard key={post.id} post={post} />)}
			{meta.page < meta.totalPages && (
				<button
					onClick={() => dispatch(fetchUserPosts({ authorId: userId, page: meta.page + 1, limit: meta.limit }))}
					disabled={status === "loading"}
					className="w-full rounded-xl border border-white/8 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white disabled:opacity-50 transition-colors"
				>
					{status === "loading" ? "Loading…" : "Load more"}
				</button>
			)}
		</div>
	);
}

export default function PublicProfilePage() {
	const { userId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const currentUser = useSelector(selectCurrentUser);
	const counts = useSelector((s) => s.user.counts[userId]);
	const postTotal = useSelector((s) => s.post.userPostsMeta.total);

	// Merge loading/error/data into one state to avoid multiple setState in effect
	const [fetchState, setFetchState] = useState({ loading: true, error: null, user: null });
	const [followModal, setFollowModal] = useState(null);

	// If viewing own profile, redirect to /profile
	useEffect(() => {
		if (currentUser && String(currentUser.id) === String(userId)) {
			navigate("/profile", { replace: true });
		}
	}, [currentUser, userId, navigate]);

	useEffect(() => {
		if (!userId) return;

		let cancelled = false;

		getUserByIdRequest(userId)
			.then((res) => {
				if (!cancelled) {
					setFetchState({ loading: false, error: null, user: res.data });
				}
			})
			.catch(() => {
				if (!cancelled) {
					setFetchState({ loading: false, error: "User not found", user: null });
				}
			});

		dispatch(fetchFollowCounts(userId));

		return () => { cancelled = true; };
	}, [userId, dispatch]);

	const { loading, error, user: profileUser } = fetchState;

	if (loading) {
		return (
			<div className="flex min-h-screen" style={{ background: "#000" }}>
				<Sidebar />
				<div className="flex-1 flex items-center justify-center">
					<div className="h-8 w-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
				</div>
			</div>
		);
	}

	if (error || !profileUser) {
		return (
			<div className="flex min-h-screen" style={{ background: "#000" }}>
				<Sidebar />
				<div className="flex-1 flex items-center justify-center"
					style={{ color: "#a8a8a8", fontSize: "14px" }}>
					User not found.
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen" style={{ background: "#000", color: "#fff" }}>
			<Sidebar />

			<div className="flex-1 flex justify-center px-6 py-8">
				<div className="w-full" style={{ maxWidth: "600px" }}>

					{/* Profile card */}
					<div className="rounded-xl border border-white/8 bg-white/3 p-6">
						<div className="flex items-start gap-5">
							<AvatarDisplay user={profileUser} size={80} />

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<h1 className="text-xl font-semibold">
										{profileUser.fullName || profileUser.username}
									</h1>
									<span className={`rounded-full px-2 py-0.5 text-xs ${
										profileUser.role === "mentor"
											? "bg-violet-500/20 text-violet-300"
											: profileUser.role === "admin"
											? "bg-red-500/20 text-red-300"
											: "bg-sky-500/20 text-sky-300"
									}`}>
										{profileUser.role}
									</span>
								</div>
								<p className="mt-0.5 text-sm text-neutral-400">@{profileUser.username}</p>
								<p className="mt-2 text-xs text-neutral-600">
									Member since{" "}
									{new Date(profileUser.createdAt).toLocaleDateString("en-US", {
										month: "long", year: "numeric",
									})}
								</p>
							</div>

							{/* Follow button */}
							<div className="shrink-0">
								<FollowButton targetId={profileUser.id} size="md" />
							</div>
						</div>

						{/* Stats */}
						<div className="mt-5 flex gap-6 border-t border-white/8 pt-4">
							{[
								{ label: "Posts", val: postTotal, modal: null },
								{ label: "Followers", val: counts?.followersCount ?? 0, modal: "followers" },
								{ label: "Following", val: counts?.followingCount ?? 0, modal: "following" },
							].map(({ label, val, modal }) => (
								<div key={label}>
									{modal ? (
										<button
											onClick={() => setFollowModal(modal)}
											style={{ background: "none", border: "none", cursor: "pointer",
												textAlign: "left", padding: 0 }}
											className="hover:opacity-70 transition-opacity"
										>
											<p className="text-sm font-semibold text-white">{val}</p>
											<p className="text-xs text-neutral-500">{label}</p>
										</button>
									) : (
										<div>
											<p className="text-sm font-semibold text-white">{val}</p>
											<p className="text-xs text-neutral-500">{label}</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Posts */}
					<div className="mt-2 border-b border-white/8 pb-0.5">
						<span className="px-4 py-2.5 text-sm font-medium border-b-2 border-sky-400 text-white inline-block">
							Posts
						</span>
					</div>
					<UserPostsTab userId={profileUser.id} />
				</div>
			</div>

			{/* Follow list modal */}
			{followModal && (
				<FollowListModal
					userId={profileUser.id}
					tab={followModal}
					onClose={() => setFollowModal(null)}
				/>
			)}
		</div>
	);
}
