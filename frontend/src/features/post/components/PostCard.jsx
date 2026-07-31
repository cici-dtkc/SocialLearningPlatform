import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../../auth/authSlice.js";
import { createComment, deletePost, toggleLike, updatePost } from "../postSlice.js";
import CommentSection from "./CommentSection.jsx";
import Avatar from "../../../components/ui/Avatar.jsx";

dayjs.extend(relativeTime);

const HeartIcon = ({ filled }) => (
	<svg
		style={{ width: 24, height: 24 }}
		fill={filled ? "#ff3040" : "none"}
		viewBox="0 0 24 24"
		stroke={filled ? "#ff3040" : "currentColor"}
		strokeWidth={1.8}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
		/>
	</svg>
);

const CommentIcon = () => (
	<svg style={{ width: 24, height: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
		/>
	</svg>
);

const ShareIcon = () => (
	<svg style={{ width: 24, height: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
		/>
	</svg>
);

const DotsIcon = () => (
	<svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 20 20">
		<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
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
	const [quickComment, setQuickComment] = useState("");
	const [submittingComment, setSubmittingComment] = useState(false);
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

	const handleQuickComment = async (e) => {
		e.preventDefault();
		if (!quickComment.trim() || !currentUser) return;
		setSubmittingComment(true);
		const res = await dispatch(createComment({
			postId: post.id,
			content: quickComment.trim(),
			parentComment: null,
		}));
		setSubmittingComment(false);
		if (createComment.fulfilled.match(res)) {
			setQuickComment("");
		} else {
			toast.error(res.payload || "Failed to comment");
		}
	};

	const timeAgo = dayjs(post.createdAt).fromNow().toUpperCase();

	return (
		<article
			style={{
				borderBottom: "1px solid rgba(255,255,255,0.1)",
				paddingBottom: "16px",
				marginBottom: "4px",
				background: "transparent",
			}}
		>
			<div
				className="flex items-center justify-between"
				style={{ paddingTop: "12px", paddingBottom: "12px" }}
			>
				<div className="flex items-center gap-3">
					{post.author?.avatar ? (
						<img
							src={post.author.avatar}
							alt={post.author?.username}
							style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
						/>
					) : (
						<div
							className="flex items-center justify-center font-semibold text-black"
							style={{
								width: 32,
								height: 32,
								borderRadius: "50%",
								background: "linear-gradient(135deg, #38bdf8, #a855f7)",
								fontSize: "12px",
								flexShrink: 0,
							}}
						>
							{post.author?.username?.[0]?.toUpperCase() ?? "?"}
						</div>
					)}
					<div className="flex items-center gap-2">
						<span className="font-semibold text-white" style={{ fontSize: "14px" }}>
							{post.author?.username ?? "unknown"}
						</span>
						{post.author?.role === "mentor" && (
							<span
								style={{
									fontSize: "10px",
									background: "rgba(168,85,247,0.2)",
									color: "#c084fc",
									borderRadius: "20px",
									padding: "2px 8px",
								}}
							>
								mentor
							</span>
						)}
						{post.visibility === "private" && (
							<span style={{ fontSize: "12px", color: "#f59e0b" }}>• private</span>
						)}
					</div>
				</div>

			 
				{isOwner && (
					<div className="relative" ref={menuRef}>
						<button
							onClick={() => setMenuOpen((v) => !v)}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								color: "rgba(255,255,255,0.8)",
								padding: "4px",
								borderRadius: "4px",
								display: "flex",
								alignItems: "center",
							}}
						>
							<DotsIcon />
						</button>
						{menuOpen && (
							<div
								style={{
									position: "absolute",
									right: 0,
									top: "calc(100% + 4px)",
									width: 140,
									background: "#262626",
									border: "1px solid rgba(255,255,255,0.1)",
									borderRadius: "8px",
									overflow: "hidden",
									zIndex: 50,
									boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
								}}
							>
								<button
									onClick={() => { setEditing(true); setMenuOpen(false); }}
									style={{
										width: "100%",
										textAlign: "left",
										padding: "10px 16px",
										fontSize: "13px",
										color: "#ffffff",
										background: "none",
										border: "none",
										cursor: "pointer",
									}}
									className="hover:bg-white/5"
								>
									Edit
								</button>
								<button
									onClick={handleDelete}
									style={{
										width: "100%",
										textAlign: "left",
										padding: "10px 16px",
										fontSize: "13px",
										color: "#ed4956",
										background: "none",
										border: "none",
										cursor: "pointer",
									}}
									className="hover:bg-white/5"
								>
									Delete
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			{editing ? (
				<div style={{ marginBottom: "12px" }} className="space-y-2">
					<textarea
						autoFocus
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
						style={{
							width: "100%",
							minHeight: "80px",
							resize: "none",
							background: "#262626",
							border: "1px solid rgba(255,255,255,0.1)",
							borderRadius: "8px",
							padding: "10px 12px",
							fontSize: "14px",
							color: "#ffffff",
							outline: "none",
							boxSizing: "border-box",
						}}
					/>
					<input
						value={editTags}
						onChange={(e) => setEditTags(e.target.value)}
						placeholder="Tags (comma separated)"
						style={{
							width: "100%",
							background: "#262626",
							border: "1px solid rgba(255,255,255,0.1)",
							borderRadius: "8px",
							padding: "8px 12px",
							fontSize: "14px",
							color: "#ffffff",
							outline: "none",
							boxSizing: "border-box",
						}}
					/>
					<div className="flex gap-2">
						<button
							onClick={handleUpdate}
							style={{
								background: "#0095f6",
								border: "none",
								borderRadius: "8px",
								padding: "6px 14px",
								fontSize: "13px",
								fontWeight: 600,
								color: "#ffffff",
								cursor: "pointer",
							}}
						>
							Save
						</button>
						<button
							onClick={() => { setEditing(false); setEditContent(post.content); setEditTags(post.tags?.join(", ") ?? ""); }}
							style={{
								background: "none",
								border: "none",
								borderRadius: "8px",
								padding: "6px 14px",
								fontSize: "13px",
								color: "#a8a8a8",
								cursor: "pointer",
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<p
					style={{
						fontSize: "14px",
						color: "rgba(255,255,255,0.9)",
						lineHeight: "1.6",
						whiteSpace: "pre-wrap",
						marginBottom: post.images?.length > 0 ? "0" : "4px",
					}}
				>
					{post.content}
				</p>
			)}

			{post.images?.length > 0 && (
				<div
					style={{
						marginTop: editing ? "0" : "8px",
						display: "grid",
						gap: "2px",
						gridTemplateColumns: post.images.length === 1 ? "1fr" : "1fr 1fr",
					}}
				>
					{post.images.map((src, i) => (
						<img
							key={i}
							src={src}
							alt=""
							style={{
								width: "100%",
								maxHeight: post.images.length === 1 ? "585px" : "293px",
								objectFit: "cover",
								display: "block",
							}}
						/>
					))}
				</div>
			)}

			{post.tags?.length > 0 && !editing && (
				<div className="flex flex-wrap gap-1.5" style={{ marginTop: "8px" }}>
					{post.tags.map((tag) => (
						<span
							key={tag}
							style={{
								fontSize: "12px",
								color: "#0095f6",
								background: "rgba(0,149,246,0.1)",
								borderRadius: "20px",
								padding: "2px 10px",
							}}
						>
							#{tag}
						</span>
					))}
				</div>
			)}

			<div
				className="flex items-center gap-4"
				style={{ paddingTop: "12px", paddingBottom: "8px" }}
			>
				<button
					onClick={handleLike}
					className="transition-transform active:scale-90"
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: 0,
						color: liked ? "#ff3040" : "rgba(255,255,255,0.8)",
						display: "flex",
						alignItems: "center",
					}}
				>
					<HeartIcon filled={liked} />
				</button>

				<button
					onClick={() => setShowComments((v) => !v)}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: 0,
						color: showComments ? "#0095f6" : "rgba(255,255,255,0.8)",
						display: "flex",
						alignItems: "center",
					}}
				>
					<CommentIcon />
				</button>

				<button
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: 0,
						color: "rgba(255,255,255,0.8)",
						display: "flex",
						alignItems: "center",
					}}
					onClick={() => toast("Share coming soon")}
				>
					<ShareIcon />
				</button>
			</div>

			{post.likesCount > 0 && (
				<p style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>
					{post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
				</p>
			)}

			{!editing && (
				<p style={{ fontSize: "14px", color: "#ffffff", lineHeight: "1.5" }}>
					<span style={{ fontWeight: 600 }}>{post.author?.username ?? "unknown"}</span>{" "}
					<span style={{ color: "rgba(255,255,255,0.85)" }}>{post.content}</span>
				</p>
			)}

			{post.commentsCount > 0 && (
				<button
					onClick={() => setShowComments((v) => !v)}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: "2px 0",
						fontSize: "14px",
						color: "#a8a8a8",
						display: "block",
						marginTop: "2px",
					}}
				>
					{showComments ? "Hide comments" : `View all ${post.commentsCount} comment${post.commentsCount !== 1 ? "s" : ""}`}
				</button>
			)}

			{showComments && <CommentSection postId={post.id} />}

			{currentUser && (
				<form
					onSubmit={handleQuickComment}
					className="flex items-center gap-3"
					style={{
						borderTop: "1px solid rgba(255,255,255,0.08)",
						paddingTop: "10px",
						marginTop: "8px",
					}}
				>
					{currentUser.avatar ? (
						<img
							src={currentUser.avatar}
							alt={currentUser.username}
							style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
						/>
					) : (
						<div
							className="flex items-center justify-center font-semibold text-black"
							style={{
								width: 24,
								height: 24,
								borderRadius: "50%",
								background: "linear-gradient(135deg, #38bdf8, #a855f7)",
								fontSize: "10px",
								flexShrink: 0,
							}}
						>
							{currentUser.username?.[0]?.toUpperCase()}
						</div>
					)}
					<input
						type="text"
						value={quickComment}
						onChange={(e) => setQuickComment(e.target.value)}
						placeholder="Add a comment…"
						style={{
							flex: 1,
							background: "transparent",
							border: "none",
							outline: "none",
							fontSize: "14px",
							color: "#ffffff",
							caretColor: "#ffffff",
						}}
					/>
					{quickComment.trim() && (
						<button
							type="submit"
							disabled={submittingComment}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: "14px",
								fontWeight: 600,
								color: submittingComment ? "rgba(0,149,246,0.5)" : "#0095f6",
								padding: 0,
								flexShrink: 0,
							}}
						>
							Post
						</button>
					)}
				</form>
			)}

			<p
				style={{
					fontSize: "10px",
					color: "#737373",
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					marginTop: "6px",
				}}
			>
				{timeAgo}
			</p>
		</article>
	);
}
