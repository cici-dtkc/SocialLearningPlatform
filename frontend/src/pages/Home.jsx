import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import Sidebar from "../components/layout/Sidebar.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import PostComposer from "../features/post/components/PostComposer.jsx";
import PostFeed from "../features/post/components/PostFeed.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Logo from "../assets/logo.svg";

function SuggestedUserRow({ name, handle }) {
	return (
		<div className="flex items-center justify-between py-2">
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center font-semibold"
					style={{ width: 32, height: 32, borderRadius: "50%",
						background: "linear-gradient(135deg, #38bdf8, #a855f7)",
						color: "#0a0a0a", fontSize: "12px", flexShrink: 0 }}>
					{name[0].toUpperCase()}
				</div>
				<div>
					<p className="font-semibold text-white" style={{ fontSize: "13px" }}>{handle}</p>
					<p style={{ fontSize: "12px", color: "#a8a8a8" }}>{name}</p>
				</div>
			</div>
			<button style={{ fontSize: "13px", color: "#0095f6", fontWeight: 600,
				background: "none", border: "none", cursor: "pointer" }}>
				Follow
			</button>
		</div>
	);
}

function LandingView() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
			style={{ background: "#000" }}>
			<div className="max-w-md space-y-6">
				<div className="mx-auto flex items-center justify-center"
					style={{ width: 72, height: 72, borderRadius: "18px",
						background: "linear-gradient(135deg, #38bdf8, #a855f7)" }}>
					<img src={Logo} alt="SL" style={{ width: 44, height: 44 }} />
				</div>
				<div>
					<h1 className="font-bold text-white" style={{ fontSize: "30px" }}>Social Learning</h1>
					<p style={{ fontSize: "15px", color: "#a8a8a8", marginTop: "8px", lineHeight: "1.6" }}>
						Learn together. Share progress. Keep moving forward.
					</p>
				</div>
				<div className="space-y-3">
					<Link to="/login"
						className="flex items-center justify-center w-full font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
						style={{ background: "#0095f6", padding: "10px 0", fontSize: "14px",
							textDecoration: "none", borderRadius: "8px" }}>
						Log in
					</Link>
					<Link to="/register"
						className="flex items-center justify-center w-full font-semibold text-white rounded-lg hover:bg-white/10 transition-colors"
						style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "10px 0",
							fontSize: "14px", textDecoration: "none", borderRadius: "8px" }}>
						Create new account
					</Link>
				</div>
			</div>
		</div>
	);
}

function FeedView({ user, composerOpen, setComposerOpen }) {
	return (
		<div className="flex min-h-screen" style={{ background: "#000" }}>
			{/* Sidebar */}
			<Sidebar onCreatePost={() => setComposerOpen(true)} />

			{/* Main content */}
			<div className="flex-1 flex justify-center px-6 py-8">
				<div className="flex gap-10 w-full" style={{ maxWidth: "920px" }}>

					{/* Feed column */}
					<main style={{ flex: 1, maxWidth: "600px", minWidth: 0 }}>
						{/* Composer — shown when Create is clicked */}
						{composerOpen && (
							<div style={{ marginBottom: "16px" }}>
								<PostComposer autoOpen onClose={() => setComposerOpen(false)} />
							</div>
						)}
						{!composerOpen && (
							<div
								className="flex items-center gap-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
								style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
									padding: "12px 16px", marginBottom: "16px" }}
								onClick={() => setComposerOpen(true)}
							>
								<Avatar user={user} size="sm" />
								<span style={{ fontSize: "14px", color: "#737373" }}>What are you learning today?</span>
								<button
									style={{ marginLeft: "auto", background: "#0095f6", border: "none",
										borderRadius: "8px", padding: "6px 14px", fontSize: "13px",
										fontWeight: 600, color: "white", cursor: "pointer" }}
									onClick={(e) => { e.stopPropagation(); setComposerOpen(true); }}
								>
									Post
								</button>
							</div>
						)}

						<PostFeed />
					</main>

					{/* Right sidebar */}
					<aside className="hidden xl:block" style={{ width: "300px", flexShrink: 0 }}>
						<div style={{ position: "sticky", top: "24px" }}>
							{/* User card */}
							<div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
								<div className="flex items-center gap-3">
									<Avatar user={user} size="md" />
									<div>
										<p className="font-semibold text-white" style={{ fontSize: "14px" }}>{user.username}</p>
										<p style={{ fontSize: "13px", color: "#a8a8a8" }}>{user.fullName || user.email}</p>
									</div>
								</div>
								<Link to="/profile"
									style={{ fontSize: "13px", fontWeight: 600, color: "#0095f6", textDecoration: "none" }}>
									View profile
								</Link>
							</div>

							{/* Suggested */}
							<div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
								<span className="font-semibold" style={{ fontSize: "14px", color: "#a8a8a8" }}>
									Suggested for you
								</span>
								<button className="font-semibold text-white hover:text-white/70 transition-colors"
									style={{ fontSize: "12px", background: "none", border: "none", cursor: "pointer" }}>
									See All
								</button>
							</div>

							<SuggestedUserRow name="JavaScript Dev" handle="jsdev" />
							<SuggestedUserRow name="React Learner" handle="react_fan" />
							<SuggestedUserRow name="Node.js Builder" handle="nodebuilder" />
							<SuggestedUserRow name="CSS Wizard" handle="csswiz" />

							<p className="mt-8" style={{ fontSize: "11px", color: "#525252", lineHeight: "1.7" }}>
								About · Help · Privacy · Terms
								<br /><br />
								© 2026 SOCIAL LEARNING
							</p>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

export default function HomePage() {
	const user = useSelector(selectCurrentUser);
	const [composerOpen, setComposerOpen] = useState(false);

	if (!user) {
		return (
			<div style={{ background: "#000" }}>
				<Navbar />
				<LandingView />
			</div>
		);
	}

	return <FeedView user={user} composerOpen={composerOpen} setComposerOpen={setComposerOpen} />;
}
