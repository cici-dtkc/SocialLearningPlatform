import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice.js";
import { createGroup, fetchGroups } from "../groupSlice.js";
import Sidebar from "../../../components/layout/Sidebar.jsx";
import toast from "react-hot-toast";

// Create Group Modal  
function CreateGroupModal({ onClose }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: "", description: "", visibility: "public", tags: "" });
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name.trim()) return;
		setLoading(true);
		const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
		const res = await dispatch(createGroup({ ...form, tags }));
		setLoading(false);
		if (createGroup.fulfilled.match(res)) {
			toast.success("Group created!");
			onClose();
			navigate(`/groups/${res.payload.data.id}`);
		} else {
			toast.error(res.payload || "Failed to create group");
		}
	};

	const inputCls = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }}
			onClick={onClose}>
			<div className="w-full rounded-xl overflow-hidden" style={{ maxWidth: 480, background: "#1a1a1a",
				border: "1px solid rgba(255,255,255,0.12)" }} onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
					<h2 className="font-semibold text-white" style={{ fontSize: 16 }}>Create Group</h2>
					<button onClick={onClose} style={{ background: "none", border: "none", color: "#a8a8a8", cursor: "pointer", fontSize: 20 }}>×</button>
				</div>
				<form onSubmit={handleSubmit} className="p-5 space-y-4">
					<div>
						<label className="block text-xs text-neutral-400 mb-1">Group name *</label>
						<input className={inputCls} placeholder="e.g. ReactJS Vietnam" maxLength={100}
							value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
					</div>
					<div>
						<label className="block text-xs text-neutral-400 mb-1">Description</label>
						<textarea className={inputCls + " min-h-[80px] resize-none"} placeholder="What is this group about?"
							maxLength={1000} value={form.description}
							onChange={(e) => setForm({ ...form, description: e.target.value })} />
					</div>
					<div>
						<label className="block text-xs text-neutral-400 mb-1">Tags (comma separated)</label>
						<input className={inputCls} placeholder="react, javascript, frontend"
							value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
					</div>
					<div>
						<label className="block text-xs text-neutral-400 mb-2">Visibility</label>
						<div className="flex gap-3">
							{["public", "private"].map((v) => (
								<button key={v} type="button"
									onClick={() => setForm({ ...form, visibility: v })}
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
							style={{ flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 14, border: "1px solid rgba(255,255,255,0.15)",
								background: "none", color: "#a8a8a8", cursor: "pointer" }}>
							Cancel
						</button>
						<button type="submit" disabled={!form.name.trim() || loading}
							style={{ flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 14, fontWeight: 600,
								background: "#0095f6", color: "white", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
							{loading ? "Creating…" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// Group Card 
function GroupCard({ group }) {
	return (
		<Link to={`/groups/${group.id}`} style={{ textDecoration: "none" }}>
			<div className="rounded-xl overflow-hidden border border-white/8 hover:border-white/20 transition-colors"
				style={{ background: "#111" }}>
				{/* Cover */}
				<div style={{ height: 80, background: group.cover ? `url(${group.cover}) center/cover` :
					"linear-gradient(135deg,#1a1f3e,#0f172a)", position: "relative" }}>
					{/* Avatar */}
					<div style={{ position: "absolute", bottom: -20, left: 14, width: 44, height: 44,
						borderRadius: "50%", border: "3px solid #111",
						background: group.avatar ? `url(${group.avatar}) center/cover` :
							"linear-gradient(135deg,#38bdf8,#a855f7)",
						overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
						fontSize: 16, fontWeight: 700, color: "#0a0a0a" }}>
						{!group.avatar && group.name?.[0]?.toUpperCase()}
					</div>
					{/* Visibility badge */}
					<span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, padding: "2px 8px",
						borderRadius: 20, background: "rgba(0,0,0,0.6)",
						color: group.visibility === "private" ? "#fbbf24" : "#34d399" }}>
						{group.visibility === "private" ? "🔒 Private" : "🌍 Public"}
					</span>
				</div>

				<div style={{ padding: "28px 14px 14px" }}>
					<p className="font-semibold text-white truncate" style={{ fontSize: 14 }}>{group.name}</p>
					<p className="text-neutral-400 truncate mt-0.5" style={{ fontSize: 12 }}>
						{group.description || "No description"}
					</p>
					<div className="flex items-center justify-between mt-2">
						<span style={{ fontSize: 11, color: "#737373" }}>
							{group.membersCount} member{group.membersCount !== 1 ? "s" : ""}
						</span>
						{group.myRole && (
							<span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20,
								background: "rgba(0,149,246,0.15)", color: "#60a5fa" }}>
								{group.myRole}
							</span>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}

// Page 
export default function GroupListPage() {
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const groups = useSelector((s) => s.group.groups);
	const meta = useSelector((s) => s.group.meta);
	const status = useSelector((s) => s.group.status);
	const [search, setSearch] = useState("");
	const [showCreate, setShowCreate] = useState(false);

	useEffect(() => {
		dispatch(fetchGroups({ page: 1 }));
	}, [dispatch]);

	const handleSearch = (e) => {
		e.preventDefault();
		dispatch(fetchGroups({ page: 1, search }));
	};

	return (
		<div className="flex min-h-screen" style={{ background: "#000", color: "#fff" }}>
			<Sidebar />
			<div className="flex-1 px-6 py-8" style={{ maxWidth: 1000, margin: "0 auto" }}>

				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="font-bold text-white" style={{ fontSize: 22 }}>Communities</h1>
						<p style={{ fontSize: 13, color: "#737373", marginTop: 2 }}>
							Discover groups and learn together
						</p>
					</div>
					{currentUser && (
						<button onClick={() => setShowCreate(true)}
							style={{ background: "#0095f6", border: "none", borderRadius: 8, padding: "9px 18px",
								fontSize: 14, fontWeight: 600, color: "white", cursor: "pointer" }}>
							+ New Group
						</button>
					)}
				</div>

				{/* Search */}
				<form onSubmit={handleSearch} className="flex gap-2 mb-6">
					<input value={search} onChange={(e) => setSearch(e.target.value)}
						placeholder="Search groups…"
						style={{ flex: 1, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
							borderRadius: 8, padding: "9px 14px", fontSize: 14, color: "white", outline: "none" }} />
					<button type="submit"
						style={{ background: "#0095f6", border: "none", borderRadius: 8, padding: "9px 18px",
							fontSize: 14, color: "white", cursor: "pointer" }}>
						Search
					</button>
					{search && (
						<button type="button" onClick={() => { setSearch(""); dispatch(fetchGroups({ page: 1 })); }}
							style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8,
								padding: "9px 14px", fontSize: 14, color: "#a8a8a8", cursor: "pointer" }}>
							Clear
						</button>
					)}
				</form>

				{/* Grid */}
				{status === "loading" ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{[1,2,3,4,5,6,7,8].map((i) => (
							<div key={i} className="rounded-xl animate-pulse" style={{ height: 160, background: "#1a1a1a" }} />
						))}
					</div>
				) : groups.length === 0 ? (
					<div className="text-center py-20" style={{ color: "#737373" }}>
						<p style={{ fontSize: 40, marginBottom: 8 }}>🏘️</p>
						<p style={{ fontSize: 15 }}>No groups found</p>
						{currentUser && (
							<button onClick={() => setShowCreate(true)}
								style={{ marginTop: 12, background: "#0095f6", border: "none", borderRadius: 8,
									padding: "9px 18px", fontSize: 14, color: "white", cursor: "pointer" }}>
								Create the first one
							</button>
						)}
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{groups.map((g) => <GroupCard key={g.id} group={g} />)}
						</div>
						{meta.page < meta.totalPages && (
							<button onClick={() => dispatch(fetchGroups({ page: meta.page + 1 }))}
								className="w-full mt-6 py-2.5 rounded-xl border border-white/8 text-sm text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
								Load more
							</button>
						)}
					</>
				)}
			</div>

			{showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
		</div>
	);
}
