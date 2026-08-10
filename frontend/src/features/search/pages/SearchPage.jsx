import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../../components/layout/Sidebar.jsx";
import { selectCurrentUser } from "../../auth/authSlice.js";
import { fetchGroups } from "../../group/groupSlice.js";
import { getGroupsRequest } from "../../group/services/groupService.js";

function SearchPage() {
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const [query, setQuery] = useState("");
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("all");

	const suggestions = useMemo(() => [
		"react",
		"javascript",
		"design",
		"ai",
		"community",
	], []);

	useEffect(() => {
		dispatch(fetchGroups({ page: 1 }));
	}, [dispatch]);

	const handleSearch = async (value = query) => {
		const nextQuery = value.trim();
		if (!nextQuery) {
			setGroups([]);
			return;
		}

		setLoading(true);
		try {
			const response = await getGroupsRequest({ page: 1, limit: 8, search: nextQuery });
			const nextGroups = Array.isArray(response?.data) ? response.data : [];
			setGroups(nextGroups);
		} catch (error) {
			toast.error(error?.response?.data?.message || "Search failed");
			setGroups([]);
		} finally {
			setLoading(false);
		}
	};

	const emptyState = () => (
		<div style={{ textAlign: "center", padding: "40px 16px", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: "16px", background: "rgba(255,255,255,0.03)" }}>
			<p style={{ fontSize: 32, margin: 0 }}>🔎</p>
			<p style={{ margin: "10px 0 6px", fontSize: 16, fontWeight: 600, color: "#ffffff" }}>Search communities</p>
			<p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Try a keyword like React, JavaScript, AI, Design, or Learning.</p>
		</div>
	);

	return (
		<div className="flex min-h-screen" style={{ background: "#000", color: "#fff" }}>
			<Sidebar />
			<div className="flex-1 px-4 py-6 md:px-8">
				<div style={{ maxWidth: 960, margin: "0 auto" }}>
					<div style={{ border: "1px solid rgba(255,255,255,0.10)", borderRadius: "24px", background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(10,10,10,0.95))", padding: "24px" }}>
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<div>
								<p style={{ margin: 0, color: "#60a5fa", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Discover</p>
								<h1 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: "#ffffff" }}>Search</h1>
							</div>
							{currentUser && (
								<div style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(59,130,246,0.16)", color: "#bfdbfe", fontSize: 12 }}>
									Welcome back, {currentUser.username}
								</div>
							)}
						</div>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSearch(query);
							}}
							style={{ marginTop: 20, display: "flex", gap: "10px", flexWrap: "wrap" }}
						>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search communities, topics, or people"
								style={{ flex: 1, minWidth: 240, background: "rgba(255,255,255,0.06)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "12px 14px", fontSize: 14, outline: "none" }}
							/>
							<button
								type="submit"
								disabled={loading}
								style={{ background: "#0095f6", border: "none", borderRadius: "12px", padding: "12px 16px", color: "#ffffff", cursor: "pointer", fontWeight: 600 }}
							>
								{loading ? "Searching…" : "Search"}
							</button>
						</form>

						<div style={{ marginTop: 18, display: "flex", gap: "8px", flexWrap: "wrap" }}>
							{suggestions.map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => {
										setQuery(item);
										handleSearch(item);
									}}
									style={{ border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", color: "#dbeafe", borderRadius: 999, padding: "7px 12px", cursor: "pointer" }}
								>
									#{item}
								</button>
							))}
						</div>

						<div style={{ marginTop: 22, display: "flex", gap: "8px" }}>
							{["all", "groups"].map((tab) => (
								<button
									key={tab}
									type="button"
									onClick={() => setActiveTab(tab)}
									style={{ border: activeTab === tab ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.10)", background: activeTab === tab ? "rgba(56,189,248,0.14)" : "rgba(255,255,255,0.04)", color: activeTab === tab ? "#ffffff" : "#9ca3af", borderRadius: 999, padding: "7px 12px", cursor: "pointer" }}
								>
									{tab === "all" ? "All results" : "Communities"}
								</button>
							))}
						</div>

						<div style={{ marginTop: 18 }}>
							{!query ? emptyState() : loading ? (
								<div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>Searching…</div>
							) : groups.length === 0 ? (
								<div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>No results found for “{query}”.</div>
							) : (
								<div style={{ display: "grid", gap: "12px" }}>
									{groups.map((group) => (
										<Link key={group.id} to={`/groups/${group.id}`} style={{ textDecoration: "none" }}>
											<div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
												<div style={{ width: 48, height: 48, borderRadius: "50%", background: group.avatar ? "transparent" : "linear-gradient(135deg,#38bdf8,#a855f7)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0a", fontWeight: 700 }}>
													{group.avatar ? <img src={group.avatar} alt={group.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : group.name?.[0]?.toUpperCase()}
												</div>
												<div style={{ flex: 1 }}>
													<p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#ffffff" }}>{group.name}</p>
													<p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>{group.description || "No description yet"}</p>
												</div>
												<div style={{ color: "#60a5fa", fontSize: 12, fontWeight: 600 }}>{group.membersCount} members</div>
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SearchPage;
