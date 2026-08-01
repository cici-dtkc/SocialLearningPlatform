import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../../auth/authSlice.js";
import { fetchFollowStatus, toggleFollow } from "../userSlice.js";

 
export default function FollowButton({ targetId, size = "md" }) {
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const isFollowing = useSelector((s) => s.user.followStatus[targetId]);

	useEffect(() => {
		// Load status only if logged in and not own profile
		if (currentUser && String(currentUser.id) !== String(targetId) && isFollowing === undefined) {
			dispatch(fetchFollowStatus(targetId));
		}
	}, [targetId, currentUser, isFollowing, dispatch]);

	// Don't show button for own profile or when not logged in
	if (!currentUser || String(currentUser.id) === String(targetId)) return null;

	const handleClick = () => {
		dispatch(toggleFollow({ targetId, isFollowing: !!isFollowing }))
			.unwrap()
			.catch((err) => toast.error(err || "Action failed"));
	};

	const smStyle = {
		fontSize: "12px",
		padding: "4px 12px",
		borderRadius: "6px",
		fontWeight: 600,
		cursor: "pointer",
		border: "none",
		transition: "opacity 0.15s",
	};
	const mdStyle = {
		fontSize: "14px",
		padding: "7px 20px",
		borderRadius: "8px",
		fontWeight: 600,
		cursor: "pointer",
		border: "none",
		transition: "opacity 0.15s",
		minWidth: "88px",
	};
	const base = size === "sm" ? smStyle : mdStyle;

	if (isFollowing) {
		return (
			<button
				onClick={handleClick}
				style={{
					...base,
					background: "rgba(255,255,255,0.08)",
					color: "#ffffff",
					border: "1px solid rgba(255,255,255,0.2)",
				}}
				className="hover:bg-white/15 transition-colors"
			>
				Following
			</button>
		);
	}

	return (
		<button
			onClick={handleClick}
			style={{ ...base, background: "#0095f6", color: "#ffffff" }}
			className="hover:opacity-85 transition-opacity"
		>
			{isFollowing === undefined ? "Follow" : "Follow"}
		</button>
	);
}
