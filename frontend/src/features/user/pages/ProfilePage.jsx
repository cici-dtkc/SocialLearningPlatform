import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
	clearAuthError,
	selectCurrentUser,
	updateAvatar,
	updateMe,
} from "../../auth/authSlice.js";
import { fetchUserPosts } from "../../post/postSlice.js";
import { fetchFollowCounts } from "../userSlice.js";
import PostCard from "../../post/components/PostCard.jsx";
import Sidebar from "../../../components/layout/Sidebar.jsx";

function AvatarUploader({ user }) {
	const dispatch = useDispatch();
	const fileRef = useRef(null);
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleFile = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Only image files allowed");
			return;
		}
		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
		setLoading(true);
		const res = await dispatch(updateAvatar(file));
		setLoading(false);
		URL.revokeObjectURL(objectUrl);
		setPreview(null);
		if (updateAvatar.fulfilled.match(res)) toast.success("Avatar updated!");
		else toast.error(res.payload || "Upload failed");
	};

	const avatarSrc = preview || user.avatar;

	return (
		<div className="relative group w-fit">
			<div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-white/10">
				{avatarSrc ? (
					<img src={avatarSrc} alt={user.username} className="h-full w-full object-cover" />
				) : (
					<div className="h-full w-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-3xl font-bold text-slate-900">
						{user.username?.[0]?.toUpperCase()}
					</div>
				)}
			</div>
			<button
				type="button"
				onClick={() => fileRef.current?.click()}
				disabled={loading}
				className="absolute inset-0 rounded-full bg-black/55 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
			>
				{loading ? (
					<span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
				) : (
					<>
						<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
						</svg>
						<span className="text-[10px] text-white font-medium">Change</span>
					</>
				)}
			</button>
			<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
		</div>
	);
}

function EditProfileForm({ user, onDone }) {
	const dispatch = useDispatch();
	const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
		defaultValues: {
			username: user.username ?? "",
			email: user.email ?? "",
			fullName: user.fullName ?? "",
		},
	});

	const onSubmit = async (values) => {
		const payload = {};
		if (values.username !== user.username) payload.username = values.username;
		if (values.email !== user.email) payload.email = values.email;
		if (values.fullName !== user.fullName) payload.fullName = values.fullName;

		if (Object.keys(payload).length === 0) {
			toast("No changes to save", { icon: "ℹ️" });
			return;
		}
		const res = await dispatch(updateMe(payload));
		if (updateMe.fulfilled.match(res)) {
			toast.success("Profile updated!");
			dispatch(clearAuthError());
			onDone?.();
		} else {
			toast.error(res.payload || "Update failed");
		}
	};

	const inputCls = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400";

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<label className="block text-xs text-neutral-400 mb-1">Full name</label>
				<input {...register("fullName", { maxLength: { value: 100, message: "Max 100 characters" } })}
					placeholder="Your full name" className={inputCls} />
				{errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>}
			</div>
			<div>
				<label className="block text-xs text-neutral-400 mb-1">Username</label>
				<input {...register("username", {
					required: "Required",
					minLength: { value: 3, message: "Min 3 characters" },
					maxLength: { value: 30, message: "Max 30 characters" },
					pattern: { value: /^[a-zA-Z0-9_.-]+$/, message: "Letters, numbers, dots, underscores, hyphens only" },
				})} className={inputCls} />
				{errors.username && <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>}
			</div>
			<div>
				<label className="block text-xs text-neutral-400 mb-1">Email</label>
				<input {...register("email", {
					required: "Required",
					pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
				})} type="email" className={inputCls} />
				{errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
			</div>
			<div className="flex gap-2 pt-1">
				<button type="submit" disabled={!isDirty}
					className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
					Save changes
				</button>
				<button type="button" onClick={onDone}
					className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
					Cancel
				</button>
			</div>
		</form>
	);
}

function UserPostsTab({ userId }) {
	const dispatch = useDispatch();
	const posts = useSelector((s) => s.post.userPosts);
	const meta = useSelector((s) => s.post.userPostsMeta);
	const status = useSelector((s) => s.post.userPostsStatus);

	useEffect(() => {
		if (userId) {
			dispatch(fetchUserPosts({ authorId: userId, page: 1, limit: 10 }));
		}
	}, [userId, dispatch]);

	const handleLoadMore = () => {
		dispatch(fetchUserPosts({ authorId: userId, page: meta.page + 1, limit: meta.limit }));
	};

	if (status === "loading" && posts.length === 0) {
		return (
			<div className="space-y-3">
				{[1, 2].map((i) => (
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
							<div className="h-3 w-3/4 rounded bg-white/8" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (status === "succeeded" && posts.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
				<p className="text-sm text-neutral-500">No posts yet.</p>
				<p className="text-xs text-neutral-600 mt-1">Posts you publish will appear here.</p>
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
					disabled={status === "loading"}
					className="w-full rounded-xl border border-white/8 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white disabled:opacity-50 transition-colors"
				>
					{status === "loading" ? "Loading…" : "Load more"}
				</button>
			)}
		</div>
	);
}

export default function ProfilePage() {
	const dispatch = useDispatch();
	const user = useSelector(selectCurrentUser);
	const counts = useSelector((s) => user ? s.user.counts[user.id] : null);
	const postTotal = useSelector((s) => s.post.userPostsMeta.total);
	const [editing, setEditing] = useState(false);
	const [activeTab, setActiveTab] = useState("posts");

	useEffect(() => {
		if (user?.id) dispatch(fetchFollowCounts(user.id));
	}, [user?.id, dispatch]);

	if (!user) {
		return (
			<div className="flex min-h-screen items-center justify-center"
				style={{ background: "#000", color: "#a8a8a8", fontSize: "14px" }}>
				You are not logged in.
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
						<AvatarUploader user={user} />

						<div className="flex-1 min-w-0">							<div className="flex items-center gap-2 flex-wrap">
								<h1 className="text-xl font-semibold">{user.fullName || user.username}</h1>
								<span className={`rounded-full px-2 py-0.5 text-xs ${
									user.role === "mentor" ? "bg-violet-500/20 text-violet-300" :
									user.role === "admin" ? "bg-red-500/20 text-red-300" :
									"bg-sky-500/20 text-sky-300"
								}`}>
									{user.role}
								</span>
							</div>
							<p className="mt-0.5 text-sm text-neutral-400">@{user.username}</p>
							<p className="mt-0.5 text-sm text-neutral-500">{user.email}</p>
							<p className="mt-2 text-xs text-neutral-600">
								Member since{" "}
								{new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
							</p>
						</div>

						{!editing && (
							<button
								onClick={() => setEditing(true)}
								className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-neutral-400 hover:border-sky-400/40 hover:text-white transition-colors"
							>
								Edit
							</button>
						)}
					</div>

					{/* Stats */}
					<div className="mt-5 flex gap-6 border-t border-white/8 pt-4">
						{[
							["Posts", postTotal, null],
							["Followers", counts?.followersCount ?? 0, "followers"],
							["Following", counts?.followingCount ?? 0, "following"],
						].map(([label, val, modal]) => (
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

				{/* Edit form */}
				{editing && (
					<div className="rounded-xl border border-white/8 bg-white/3 p-6">
						<h2 className="text-sm font-semibold mb-4">Edit profile</h2>
						<EditProfileForm user={user} onDone={() => setEditing(false)} />
					</div>
				)}

				{/* Tabs */}
				<div className="flex border-b border-white/8">
					{[["posts", "Posts"], ["likes", "Liked"]].map(([key, label]) => (
						<button
							key={key}
							onClick={() => setActiveTab(key)}
							className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
								activeTab === key
									? "border-sky-400 text-white"
									: "border-transparent text-neutral-500 hover:text-neutral-300"
							}`}
						>
							{label}
						</button>
					))}
				</div>

				{/* Tab content */}
				{activeTab === "posts" && <UserPostsTab userId={user.id} />}
				{activeTab === "likes" && (
					<div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
						<p className="text-sm text-neutral-500">Liked posts coming soon.</p>
					</div>
				)}

				<p className="text-center text-xs text-neutral-700 pb-4">
					Hover your avatar to change it · Max 5MB
				</p>
			</div>
			</div>
		</div>
	);
}
