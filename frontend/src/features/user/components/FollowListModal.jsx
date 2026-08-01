import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFollowers, fetchFollowing } from "../userSlice.js";
import FollowButton from "./FollowButton.jsx";

function UserRow({ user }) {
	return (
		<div className="flex items-center justify-between py-3 px-4">
			<Link to={`/profile/${user.id}`} className="flex items-center gap-3" style={{ textDecoration: "none" }}>
				{user.avatar ? (
					<img src={user.avatar} alt={user.username}
						style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
				) : (
					<div className="flex items-center justify-center font-bold"
						style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
							background: "linear-gradient(135deg, #38bdf8, #a855f7)",
							color: "#0a0a0a", fontSize: "16px" }}>
						{user.username?.[0]?.toUpperCase()}
					</div>
				)}
				<div>
					<p className="font-semibold text-white" style={{ fontSize: "14px" }}>{user.username}</p>
					{user.fullName && (
						<p style={{ fontSize: "12px", color: "#a8a8a8" }}>{user.fullName}</p>
					)}
				</div>
			</Link>
			<FollowButton targetId={user.id} size="sm" />
		</div>
	);
}

 
export default function FollowListModal({ userId, tab, onClose }) {
	const dispatch = useDispatch();
	const followers = useSelector((s) => s.user.followers[userId] ?? null);
	const following = useSelector((s) => s.user.following[userId] ?? null);

	useEffect(() => {
		if (tab === "followers" && !followers) dispatch(fetchFollowers(userId));
		if (tab === "following" && !following) dispatch(fetchFollowing(userId));
	}, [tab, userId, followers, following, dispatch]);

	const list = tab === "followers" ? followers : following;
	const title = tab === "followers" ? "Followers" : "Following";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			style={{ background: "rgba(0,0,0,0.7)" }}
			onClick={onClose}
		>
			<div
				className="relative w-full overflow-hidden"
				style={{ maxWidth: 400, background: "#1a1a1a",
					border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px",
					maxHeight: "80vh", display: "flex", flexDirection: "column" }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3"
					style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
					<span className="font-semibold text-white" style={{ fontSize: "16px" }}>{title}</span>
					<button onClick={onClose}
						style={{ background: "none", border: "none", cursor: "pointer",
							color: "#a8a8a8", fontSize: "20px", lineHeight: 1 }}>
						×
					</button>
				</div>

				{/* List */}
				<div style={{ overflowY: "auto", flex: 1 }}>
					{list === null ? (
						<div className="flex items-center justify-center py-10">
							<div className="h-6 w-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
						</div>
					) : list.length === 0 ? (
						<div className="py-10 text-center" style={{ color: "#a8a8a8", fontSize: "14px" }}>
							No {title.toLowerCase()} yet.
						</div>
					) : (
						list.map((user) => <UserRow key={user.id} user={user} />)
					)}
				</div>
			</div>
		</div>
	);
}
