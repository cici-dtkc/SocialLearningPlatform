import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../../auth/authSlice.js";
import {
	changeMemberRole, clearCurrentGroup, deleteGroup, fetchGroupById,
	fetchGroupMembers, joinGroup, kickMember, leaveGroup,
	updateGroup, uploadGroupAvatar, uploadGroupCover,
} from "../groupSlice.js";
import Sidebar from "../../../components/layout/Sidebar.jsx";
import PostFeed from "../../post/components/PostFeed.jsx";

const ROLE_COLOR = { owner: "#f59e0b", admin: "#a78bfa", moderator: "#34d399", member: "#60a5fa" };
const CAN_MANAGE = ["owner", "admin"];

// Image uploader button  
function ImgUploader({ label, onFile }) {
	const ref = useRef(null);
	return (
		<>
			<button type="button" onClick={() => ref.current?.click()}
				style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
					borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "white", cursor: "pointer" }}>
				{label}
			</button>
			<input ref={ref} type="file" accept="image/*" className="hidden"
				onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
		</>
	);
}

// Edit Group Modal  
function EditGroupModal({ group, onClose }) {
	const dispatch = useDispatch();
	const [form, setForm] = useState({
		name: group.name, description: group.description, visibility: group.visibility,
		tags: group.tags?.join(", ") ?? "",
	});
	const [loading, setLoading] = useState(false);

	const handleSave = async (e) => {
		e.preventDefault();
		setLoading(true);
		const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
		const res = await dispatch(updateGroup({ id: group.id, payload: { ...form, tags } }));
		setLoading(false);
		if (updateGroup.fulfilled.match(res)) { toast.success("Updated!"); onClose(); }
		else toast.error(res.payload || "Failed");
	};

	const inputCls = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }}
			onClick={onClose}>
			<div className="w-full rounded-xl overflow-hidden" style={{ maxWidth: 480, background: "#1a1a1a",
				border: "1px solid rgba(255,255,255,0.12)" }} onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
					<h2 className="font-semibold text-white" style={{ fontSize: 16 }}>Edit Group</h2>
					<button onClick={onClose} style={{ background: "none", border: "none", color: "#a8a8a8", cursor: "pointer", fontSize: 20 }}>×</button>
				</div>
				<form onSubmit={handleSave} className="p-5 space-y-4">
					<div>
						<label className="block text-xs text-neutral-400 mb-1">Name *</label>
						<input className={inputCls} maxLength={100} value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })} />
					</div>
					<div>
						<label className="block text-xs text-neutral-400 mb-1">Description</label>
						<textarea className={inputCls + " resize-none"} rows={3} maxLength={1000}
							value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
					</div>
					<div>
						<label className="block text-xs text-neutral-400 mb-1">Tags</label>
						<input className={inputCls} placeholder="react, javascript"
							value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
					</div>
					<div>
						<label className="block text-xs text-neutral-400 mb-2">Visibility</label>
						<div className="flex gap-3">
							{["public", "private"].map((v) => (
								<button key={v} type="button" onClick={() => setForm({ ...form, visibility: v })}
									style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
										cursor: "pointer", border: form.visibility === v ? "2px solid #0095f6" : "1px solid rgba(255,255,255,0.15)",
										background: form.visibility === v ? "rgba(0,149,246,0.12)" : "transparent",
										color: form.visibility === v ? "#0095f6" : "#a8a8a8" }}>
									{v === "public" ? "🌍 Public" : "🔒 Private"}
								</button>
							))}
						</div>
					</div>
					<div className="flex gap-2 pt-1">
						<button type="button" onClick={onClose}
							style={{ flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 14,
								border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "#a8a8a8", cursor: "pointer" }}>
							Cancel
						</button>
						<button type="submit" disabled={!form.name.trim() || loading}
							style={{ flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 14, fontWeight: 600,
								background: "#0095f6", color: "white", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
							{loading ? "Saving…" : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// Member row  
function MemberRow({ member, myRole, groupId }) {
	const dispatch = useDispatch();
	const canManage = CAN_MANAGE.includes(myRole);

	const handleRoleChange = async (role) => {
		const res = await dispatch(changeMemberRole({ groupId, userId: member.userId, role }));
		if (changeMemberRole.fulfilled.match(res)) toast.success("Role updated");
		else toast.error(res.payload || "Failed");
	};

	const handleKick = async () => {
		if (!confirm(`Remove ${member.username} from group?`)) return;
		const res = await dispatch(kickMember({ groupId, userId: member.userId }));
		if (kickMember.fulfilled.match(res)) toast.success("Member removed");
		else toast.error(res.payload || "Failed");
	};

	return (
		<div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
			<div className="flex items-center gap-3">
				{member.avatar ? (
					<img src={member.avatar} alt={member.username}
						style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
				) : (
					<div className="flex items-center justify-center font-bold"
						style={{ width: 36, height: 36, borderRadius: "50%",
							background: "linear-gradient(135deg,#38bdf8,#a855f7)", color: "#0a0a0a", fontSize: 13 }}>
						{member.username?.[0]?.toUpperCase()}
					</div>
				)}
				<div>
					<p className="font-medium text-white" style={{ fontSize: 13 }}>{member.username}</p>
					<p style={{ fontSize: 11, color: "#a8a8a8" }}>{member.fullName || ""}</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20,
					background: "rgba(0,0,0,0.3)", color: ROLE_COLOR[member.role] || "#a8a8a8" }}>
					{member.role}
				</span>
				{canManage && member.role !== "owner" && (
					<>
						<select defaultValue={member.role} onChange={(e) => handleRoleChange(e.target.value)}
							style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.1)",
								borderRadius: 6, padding: "3px 6px", fontSize: 11, color: "white", cursor: "pointer" }}>
							{["admin", "moderator", "member"].map((r) => (
								<option key={r} value={r}>{r}</option>
							))}
						</select>
						<button onClick={handleKick}
							style={{ background: "none", border: "none", cursor: "pointer",
								color: "#ed4956", fontSize: 11, padding: "3px 8px",
								borderRadius: 6, border: "1px solid rgba(237,73,86,0.3)" }}>
							Remove
						</button>
					</>
				)}
			</div>
		</div>
	);
}

// Main Page 
export default function GroupDetailPage() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const currentUser = useSelector(selectCurrentUser);
	const group = useSelector((s) => s.group.current);
	const status = useSelector((s) => s.group.currentStatus);
	const members = useSelector((s) => s.group.members);
	const membersMeta = useSelector((s) => s.group.membersMeta);
	const [activeTab, setActiveTab] = useState("posts");
	const [showEdit, setShowEdit] = useState(false);

	useEffect(() => {
		dispatch(fetchGroupById(id));
		dispatch(fetchGroupMembers({ id, params: { page: 1, limit: 20 } }));
		return () => dispatch(clearCurrentGroup());
	}, [id, dispatch]);

	const myRole = group?.myRole;
	const isManager = CAN_MANAGE.includes(myRole);
	const isMember = !!myRole;

	const handleJoin = async () => {
		if (!currentUser) { toast.error("Sign in to join"); return; }
		const res = await dispatch(joinGroup(id));
		if (joinGroup.fulfilled.match(res)) toast.success("Joined!");
		else toast.error(res.payload || "Failed");
	};

	const handleLeave = async () => {
		if (!confirm("Leave this group?")) return;
		const res = await dispatch(leaveGroup(id));
		if (leaveGroup.fulfilled.match(res)) { toast.success("Left group"); navigate("/groups"); }
		else toast.error(res.payload || "Failed");
	};

	const handleDelete = async () => {
		if (!confirm("Delete this group? This cannot be undone.")) return;
		const res = await dispatch(deleteGroup(id));
		if (deleteGroup.fulfilled.match(res)) { toast.success("Group deleted"); navigate("/groups"); }
		else toast.error(res.payload || "Failed");
	};

	const handleAvatarUpload = async (file) => {
		const res = await dispatch(uploadGroupAvatar({ id, file }));
		if (uploadGroupAvatar.fulfilled.match(res)) toast.success("Avatar updated!");
		else toast.error(res.payload || "Upload failed");
	};

	const handleCoverUpload = async (file) => {
		const res = await dispatch(uploadGroupCover({ id, file }));
		if (uploadGroupCover.fulfilled.match(res)) toast.success("Cover updated!");
		else toast.error(res.payload || "Upload failed");
	};

	if (status === "loading" || !group) {
		return (
			<div className="flex min-h-screen" style={{ background: "#000" }}>
				<Sidebar />
				<div className="flex-1 flex items-center justify-center">
					<div className="h-8 w-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen" style={{ background: "#000", color: "#fff" }}>
			<Sidebar />
			<div className="flex-1">

				{/* Cover */}
				<div style={{ position: "relative", height: 200,
					background: group.cover ? `url(${group.cover}) center/cover` : "linear-gradient(135deg,#1a1f3e,#0f172a)" }}>
					{isManager && (
						<div style={{ position: "absolute", bottom: 10, right: 14 }}>
							<ImgUploader label="📷 Change cover" onFile={handleCoverUpload} />
						</div>
					)}
				</div>

				{/* Info bar */}
				<div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0a" }}>
					<div className="mx-auto flex items-start gap-4" style={{ maxWidth: 900 }}>
						{/* Group avatar */}
						<div style={{ position: "relative", marginTop: -32, flexShrink: 0 }}>
							<div style={{ width: 80, height: 80, borderRadius: "50%", border: "4px solid #0a0a0a",
								background: group.avatar ? `url(${group.avatar}) center/cover` : "linear-gradient(135deg,#38bdf8,#a855f7)",
								display: "flex", alignItems: "center", justifyContent: "center",
								fontSize: 28, fontWeight: 700, color: "#0a0a0a", overflow: "hidden" }}>
								{!group.avatar && group.name?.[0]?.toUpperCase()}
							</div>
							{isManager && (
								<div style={{ position: "absolute", bottom: 0, right: 0 }}>
									<ImgUploader label="✏️" onFile={handleAvatarUpload} />
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h1 className="font-bold text-white" style={{ fontSize: 20 }}>{group.name}</h1>
								<span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20,
									background: group.visibility === "private" ? "rgba(251,191,36,0.15)" : "rgba(52,211,153,0.15)",
									color: group.visibility === "private" ? "#fbbf24" : "#34d399" }}>
									{group.visibility === "private" ? "🔒 Private" : "🌍 Public"}
								</span>
							</div>
							<p style={{ fontSize: 13, color: "#a8a8a8", marginTop: 2 }}>{group.description}</p>
							<div className="flex items-center gap-4 mt-2">
								<span style={{ fontSize: 12, color: "#737373" }}>
									<strong className="text-white">{group.membersCount}</strong> members
								</span>
								<span style={{ fontSize: 12, color: "#737373" }}>
									<strong className="text-white">{group.postsCount}</strong> posts
								</span>
								{myRole && (
									<span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20,
										background: "rgba(0,149,246,0.15)", color: "#60a5fa" }}>
										Your role: {myRole}
									</span>
								)}
							</div>
							{/* Tags */}
							{group.tags?.length > 0 && (
								<div className="flex flex-wrap gap-1.5 mt-2">
									{group.tags.map((t) => (
										<span key={t} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20,
											background: "rgba(0,149,246,0.1)", color: "#60a5fa" }}>#{t}</span>
									))}
								</div>
							)}
						</div>

						{/* Action buttons */}
						<div className="flex items-center gap-2 flex-shrink-0">
							{!currentUser ? null : !isMember ? (
								group.visibility === "public" && (
									<button onClick={handleJoin}
										style={{ background: "#0095f6", border: "none", borderRadius: 8,
											padding: "8px 18px", fontSize: 14, fontWeight: 600, color: "white", cursor: "pointer" }}>
										Join
									</button>
								)
							) : (
								<>
									{myRole !== "owner" && (
										<button onClick={handleLeave}
											style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
												borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#a8a8a8", cursor: "pointer" }}>
											Leave
										</button>
									)}
									{isManager && (
										<button onClick={() => setShowEdit(true)}
											style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
												borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "white", cursor: "pointer" }}>
											✏️ Edit
										</button>
									)}
									{myRole === "owner" && (
										<button onClick={handleDelete}
											style={{ background: "rgba(237,73,86,0.1)", border: "1px solid rgba(237,73,86,0.3)",
												borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#ed4956", cursor: "pointer" }}>
											🗑 Delete
										</button>
									)}
								</>
							)}
						</div>
					</div>
				</div>

				{/* Tabs + content */}
				<div className="mx-auto px-6 py-4" style={{ maxWidth: 900 }}>
					<div className="flex gap-0 border-b border-white/8 mb-6">
						{["posts", "members"].map((tab) => (
							<button key={tab} onClick={() => setActiveTab(tab)}
								style={{ padding: "8px 20px", fontSize: 14, fontWeight: 500,
									background: "none", border: "none", cursor: "pointer",
									borderBottom: activeTab === tab ? "2px solid #0095f6" : "2px solid transparent",
									color: activeTab === tab ? "white" : "#737373" }}>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						))}
					</div>

					{activeTab === "posts" && (
						<div style={{ maxWidth: 600 }}>
							{isMember ? (
								<PostFeed groupId={id} />
							) : (
								<div className="text-center py-12" style={{ color: "#737373" }}>
									<p style={{ fontSize: 15 }}>
										{group.visibility === "private"
											? "🔒 Join to see posts in this private group"
											: "Join this group to see and create posts"}
									</p>
									{group.visibility === "public" && currentUser && (
										<button onClick={handleJoin}
											style={{ marginTop: 12, background: "#0095f6", border: "none", borderRadius: 8,
												padding: "9px 20px", fontSize: 14, color: "white", cursor: "pointer" }}>
											Join to participate
										</button>
									)}
								</div>
							)}
						</div>
					)}

					{activeTab === "members" && (
						<div style={{ maxWidth: 600 }}>
							<p style={{ fontSize: 13, color: "#737373", marginBottom: 12 }}>
								{membersMeta.total} member{membersMeta.total !== 1 ? "s" : ""}
							</p>
							{members.map((m) => (
								<MemberRow key={m.userId} member={m} myRole={myRole} groupId={id} />
							))}
							{membersMeta.page < membersMeta.totalPages && (
								<button onClick={() => dispatch(fetchGroupMembers({ id, params: { page: membersMeta.page + 1, limit: 20 } }))}
									className="w-full mt-4 py-2 rounded-xl border border-white/8 text-sm text-neutral-400 hover:bg-white/5 transition-colors">
									Load more members
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			{showEdit && <EditGroupModal group={group} onClose={() => setShowEdit(false)} />}
		</div>
	);
}
