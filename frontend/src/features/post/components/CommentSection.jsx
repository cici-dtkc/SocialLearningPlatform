import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../../auth/authSlice.js";
import {
	createComment,
	deleteComment,
	fetchComments,
	toggleCommentLike,
	updateComment,
} from "../postSlice.js";
import Avatar from "../../../components/ui/Avatar.jsx";

dayjs.extend(relativeTime);

//  Heart icon  
const HeartIcon = ({ filled }) => (
	<svg className="h-3 w-3" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
	</svg>
);

function CommentItem({ comment, postId, currentUser, onReply }) {
	const dispatch = useDispatch();
	const liked = useSelector((s) => !!s.post.likedCommentIds[comment.id]);
	const [editing, setEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);

	const isOwner =
		currentUser &&
		(currentUser.id === comment.author?.id ||
			currentUser.id === comment.author?._id ||
			currentUser._id === comment.author?.id);

	const handleLike = () => {
		if (!currentUser) { toast.error("Sign in to like"); return; }
		dispatch(toggleCommentLike({ id: comment.id, postId, liked }));
	};

	const handleUpdate = async () => {
		if (!editContent.trim()) return;
		const res = await dispatch(updateComment({ id: comment.id, postId, content: editContent.trim() }));
		if (updateComment.fulfilled.match(res)) setEditing(false);
		else toast.error(res.payload || "Failed to update");
	};

	const handleDelete = async () => {
		if (!confirm("Delete this comment?")) return;
		const res = await dispatch(deleteComment({ id: comment.id, postId }));
		if (!deleteComment.fulfilled.match(res)) toast.error(res.payload || "Failed to delete");
	};

	const isReply = !!comment.parentComment;

	return (
		<div className={`flex gap-2.5 ${isReply ? "ml-8 mt-1.5" : ""}`}>
			<Avatar user={comment.author} size="sm" />
			<div className="flex-1 min-w-0">
				{/* Reply context badge */}
				{isReply && comment.parentComment?.author && (
					<p className="mb-1 text-[10px] text-neutral-500">
						↩ replying to{" "}
						<span className="text-neutral-400">@{comment.parentComment.author.username}</span>
					</p>
				)}

				<div className="rounded-lg bg-white/5 border border-white/6 px-3 py-2">
					{/* Header */}
					<div className="flex items-center gap-2 mb-1">
						<span className="text-xs font-medium text-white">
							{comment.author?.username ?? "unknown"}
						</span>
						{comment.author?.role === "mentor" && (
							<span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] text-violet-300">
								mentor
							</span>
						)}
						<span className="ml-auto text-[10px] text-neutral-500">
							{dayjs(comment.createdAt).fromNow()}
						</span>
					</div>

					{/* Body */}
					{editing ? (
						<div className="space-y-1.5">
							<textarea
								autoFocus
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								rows={2}
								className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
							/>
							<div className="flex gap-2">
								<button onClick={handleUpdate} className="text-xs text-sky-400 hover:text-sky-300">Save</button>
								<button onClick={() => { setEditing(false); setEditContent(comment.content); }} className="text-xs text-neutral-500 hover:text-white">Cancel</button>
							</div>
						</div>
					) : (
						<p className="text-xs leading-5 text-neutral-200 whitespace-pre-wrap">{comment.content}</p>
					)}
				</div>

				{!editing && (
					<div className="mt-1 flex items-center gap-3 pl-1">
						{/* Like */}
						<button
							onClick={handleLike}
							className={`flex items-center gap-1 text-[10px] transition-colors ${liked ? "text-red-400" : "text-neutral-500 hover:text-red-400"}`}
						>
							<HeartIcon filled={liked} />
							{comment.likesCount > 0 && <span>{comment.likesCount}</span>}
						</button>

						{/* Reply */}
						{currentUser && (
							<button
								onClick={() => onReply(comment)}
								className="text-[10px] text-neutral-500 hover:text-sky-400 transition-colors"
							>
								Reply
							</button>
						)}

						{/* Owner actions */}
						{isOwner && (
							<>
								<button
									onClick={() => setEditing(true)}
									className="text-[10px] text-neutral-500 hover:text-white transition-colors"
								>
									Edit
								</button>
								<button
									onClick={handleDelete}
									className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors"
								>
									Delete
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

//   Comment section  
export default function CommentSection({ postId }) {
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const comments = useSelector((s) => s.post.comments[postId] ?? []);
	const status = useSelector((s) => s.post.commentStatus[postId]);

	const [text, setText] = useState("");
	const [replyTo, setReplyTo] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!status) dispatch(fetchComments(postId));
	}, [postId, status, dispatch]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim()) return;
		setSubmitting(true);
		const res = await dispatch(createComment({
			postId,
			content: text.trim(),
			parentComment: replyTo?.id ?? null,
		}));
		setSubmitting(false);
		if (createComment.fulfilled.match(res)) {
			setText("");
			setReplyTo(null);
		} else {
			toast.error(res.payload || "Failed to comment");
		}
	};

	// Group: top-level + their replies
	const topLevel = comments.filter((c) => !c.parentComment);
	const getReplies = (id) =>
		comments.filter((c) => {
			if (!c.parentComment) return false;
			return c.parentComment === id ||
				c.parentComment?.id === id ||
				c.parentComment?._id === id;
		});

	return (
		<div className="mt-3 space-y-3 border-t border-white/6 pt-3">
			{status === "loading" && (
				<p className="text-xs text-neutral-500">Loading comments…</p>
			)}

			{topLevel.length === 0 && status === "succeeded" && (
				<p className="text-xs text-neutral-600">No comments yet. Be the first!</p>
			)}

			{topLevel.map((comment) => (
				<div key={comment.id}>
					<CommentItem comment={comment} postId={postId} currentUser={currentUser} onReply={setReplyTo} />
					{getReplies(comment.id).map((reply) => (
						<CommentItem key={reply.id} comment={reply} postId={postId} currentUser={currentUser} onReply={setReplyTo} />
					))}
				</div>
			))}

			{/* Compose */}
			{currentUser && (
				<form onSubmit={handleSubmit} className="flex items-start gap-2 pt-1">
					<Avatar user={currentUser} size="sm" />
					<div className="flex-1 space-y-1.5">
						{replyTo && (
							<div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
								↩ Replying to{" "}
								<span className="text-neutral-300">@{replyTo.author?.username}</span>
								<button type="button" onClick={() => setReplyTo(null)} className="ml-1 text-neutral-600 hover:text-white">✕</button>
							</div>
						)}
						<div className="flex gap-2">
							<input
								value={text}
								onChange={(e) => setText(e.target.value)}
								placeholder={replyTo ? "Write a reply…" : "Write a comment…"}
								className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
							/>
							<button
								type="submit"
								disabled={!text.trim() || submitting}
								className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400 disabled:opacity-50 transition-colors"
							>
								{submitting ? "…" : "Send"}
							</button>
						</div>
					</div>
				</form>
			)}
		</div>
	);
}
