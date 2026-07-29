import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../../auth/authSlice.js";
import { deletePost, toggleLike, updatePost } from "../postSlice.js";
import CommentSection from "./CommentSection.jsx";
import Avatar from "../../../components/ui/Avatar.jsx";

dayjs.extend(relativeTime);

const HeartIcon = ({ filled }) => (
	<svg className="h-4 w-4" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
	</svg>
);

const CommentIcon = () => (
	<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
	</svg>
);

const sameId = (a, b) => a && b && String(a) === String(b);

export default function PostCard({ post }) {
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const liked = useSelector((s) => !!s.post.likedPostIds[post.id]);
	const [showComments, setShowComments] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editContent, setEditContent] = useState(post.content);
	const [editTags, setEditTags] = useState(post.tags?.join(", ") ?? "");
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);

	// Close menu on outside click
	useEffect(() => {
		const handler = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// author can be populated object OR raw id string
	const authorId = post.author?.id ?? post.author?._id ?? post.author;
	const currentUserId = currentUser?.id ?? currentUser?._id;
	const isOwner = !!currentUser && sameId(authorId, currentUserId);

	const handleLike = () => {
		if (!currentUser) { toast.error("Sign in to like posts"); return; }
		dispatch(toggleLike({ id: post.id, liked }));
	};

	const handleUpdate = async () => {
		if (!editContent.trim()) return;
		const tagsArray = editTags
			.split(",")
			.map((t) => t.trim().replace(/^#/, ""))
			.filter(Boolean);
		const res = await dispatch(updatePost({ id: post.id, payload: { content: editContent.trim(), tags: tagsArray } }));
		if (updatePost.fulfilled.match(res)) {
			setEditing(false);
			toast.success("Post updated");
		} else {
			toast.error(res.payload || "Failed to update");
		}
	};

	const handleDelete = async () => {
		setMenuOpen(false);
		if (!confirm("Delete this post?")) return;
		const res = await dispatch(deletePost(post.id));
		if (deletePost.fulfilled.match(res)) toast.success("Post deleted");
		else toast.error(res.payload || "Failed to delete");
	};

	return (
		<article className="rounded-xl border border-white/8 bg-white/3 p-4 hover:bg-white/[0.04] transition-colors">
			{/* Header */}
			<div className="flex items-start justify-between gap-2 mb-3">
				<div className="flex items-center gap-2.5">
					<Avatar user={post.author} size="md" />
					<div>
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-medium text-white">
								{post.author?.username ?? "unknown"}
							</span>
							{post.author?.role === "mentor" && (
								<span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-xs text-violet-300">
									mentor
								</span>
							)}
						</div>
						<span className="text-xs text-neutral-500">
							{dayjs(post.createdAt).fromNow()}
							{post.visibility === "private" && (
								<span className="ml-1.5 text-yellow-500/70">• private</span>
							)}
						</span>
					</div>
				</div>

				{/* Post menu */}
				{isOwner && (
					<div className="relative" ref={menuRef}>
						<button
							onClick={() => setMenuOpen((v) => !v)}
							className="rounded-md p-1 text-neutral-500 hover:bg-white/8 hover:text-white transition-colors"
						>
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
							</svg>
						</button>
						{menuOpen && (
							<div className="absolute right-0 mt-1 w-32 rounded-lg border border-white/10 bg-[#0d1525] py-1 shadow-xl z-10">
								<button
									onClick={() => { setEditing(true); setMenuOpen(false); }}
									className="w-full px-3 py-1.5 text-left text-xs text-neutral-300 hover:bg-white/5 hover:text-white"
								>
									Edit
								</button>
								<button
									onClick={handleDelete}
									className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10"
								>
									Delete
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Content */}
			{editing ? (
				<div className="space-y-2 mb-3">
					<textarea
						autoFocus
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
						className="w-full min-h-[80px] resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
					/>
					<input
						value={editTags}
						onChange={(e) => setEditTags(e.target.value)}
						placeholder="Tags (comma separated)"
						className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
					/>
					<div className="flex gap-2">
						<button onClick={handleUpdate} className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400 transition-colors">
							Save
						</button>
						<button onClick={() => { setEditing(false); setEditContent(post.content); setEditTags(post.tags?.join(", ") ?? ""); }} className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
							Cancel
						</button>
					</div>
				</div>
			) : (
				<p className="text-sm leading-6 text-neutral-200 whitespace-pre-wrap">{post.content}</p>
			)}

			{/* Images */}
			{post.images?.length > 0 && (
				<div className={`mt-3 grid gap-2 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
					{post.images.map((src, i) => (
						<img key={i} src={src} alt="" className="w-full rounded-lg object-cover max-h-64" />
					))}
				</div>
			)}

			{/* Tags */}
			{post.tags?.length > 0 && !editing && (
				<div className="mt-3 flex flex-wrap gap-1.5">
					{post.tags.map((tag) => (
						<span key={tag} className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-400">
							#{tag}
						</span>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="mt-3 flex items-center gap-4 border-t border-white/6 pt-3">
				<button
					onClick={handleLike}
					className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? "text-red-400" : "text-neutral-400 hover:text-red-400"}`}
				>
					<HeartIcon filled={liked} />
					{post.likesCount}
				</button>
				<button
					onClick={() => setShowComments((v) => !v)}
					className={`flex items-center gap-1.5 text-xs transition-colors ${showComments ? "text-sky-400" : "text-neutral-400 hover:text-sky-400"}`}
				>
					<CommentIcon />
					{post.commentsCount}
				</button>
			</div>

			{/* Comments */}
			{showComments && <CommentSection postId={post.id} />}
		</article>
	);
}
