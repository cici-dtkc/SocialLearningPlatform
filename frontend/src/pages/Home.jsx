import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import Navbar from "../components/layout/Navbar.jsx";
import PostComposer from "../features/post/components/PostComposer.jsx";
import PostFeed from "../features/post/components/PostFeed.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Logo from "../assets/logo.svg";

/* ── Landing (chưa đăng nhập) ── */
function LandingView() {
	return (
		<div className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 py-16 text-center">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom-right,_rgba(168,85,247,0.12),_transparent_50%)]" />
			<div className="relative max-w-2xl space-y-6">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 shadow-lg shadow-sky-500/20">
					<img src={Logo} alt="SL" className="h-10 w-10" />
				</div>
				<div>
					<p className="text-sm uppercase tracking-widest text-sky-400/80 mb-2">Social Learning Platform</p>
					<h1 className="text-4xl font-bold leading-tight">
						Study together.<br />Share progress.<br />Keep moving.
					</h1>
				</div>
				<p className="text-base text-neutral-400 leading-7 max-w-lg mx-auto">
					A focused space for students to post updates, share resources, and collaborate.
				</p>
				<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
					<Link to="/register" className="rounded-full bg-sky-500 px-6 py-2.5 font-medium text-white hover:bg-sky-400 transition-colors">
						Get started — it's free
					</Link>
					<Link to="/login" className="rounded-full border border-white/15 px-6 py-2.5 font-medium text-white hover:bg-white/8 transition-colors">
						Sign in
					</Link>
				</div>
				<div className="flex flex-wrap justify-center gap-2 pt-2">
					{["Post updates", "Share resources", "Comment & discuss", "Track progress"].map((f) => (
						<span key={f} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-400">{f}</span>
					))}
				</div>
			</div>
		</div>
	);
}

/* ── Feed (đã đăng nhập) ── */
function FeedView({ user }) {
	return (
		<div className="mx-auto max-w-5xl px-4 py-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_260px]">

				{/* Main feed */}
				<main className="space-y-4 min-w-0">
					<PostComposer />
					<PostFeed />
				</main>

				{/* Sidebar */}
				<aside className="hidden md:block space-y-4">
					{/* User card */}
					<div className="rounded-xl border border-white/8 bg-white/3 p-4">
						<div className="flex items-center gap-3 mb-3">
							<Avatar user={user} size="md" />
							<div className="min-w-0">
								<p className="text-sm font-medium text-white truncate">{user.fullName || user.username}</p>
								<p className="text-xs text-neutral-400">@{user.username}</p>
							</div>
						</div>
						<div className="flex gap-4 border-t border-white/8 pt-3 text-center">
							{[["Posts", 0], ["Followers", 0], ["Following", 0]].map(([label, val]) => (
								<div key={label} className="flex-1">
									<p className="text-sm font-semibold text-white">{val}</p>
									<p className="text-xs text-neutral-500">{label}</p>
								</div>
							))}
						</div>
					</div>

					{/* Trending tags */}
					<div className="rounded-xl border border-white/8 bg-white/3 p-4">
						<h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
							Trending topics
						</h3>
						<div className="space-y-2">
							{[["#javascript", 34], ["#react", 28], ["#nodejs", 22], ["#algorithms", 19], ["#webdev", 15]].map(([tag, count]) => (
								<div key={tag} className="flex items-center justify-between">
									<span className="text-sm text-sky-400 hover:text-sky-300 cursor-pointer">{tag}</span>
									<span className="text-xs text-neutral-500">{count} posts</span>
								</div>
							))}
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}

export default function HomePage() {
	const user = useSelector(selectCurrentUser);
	return (
		<div className="min-h-screen bg-[#050816] text-white">
			<Navbar />
			{user ? <FeedView user={user} /> : <LandingView />}
		</div>
	);
}
