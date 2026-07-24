import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-[#050816] text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.16),_transparent_28%),linear-gradient(180deg,_#09111f,_#050816)]" />
			<div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
				<div className="max-w-3xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
					<div className="flex items-center gap-4">
						<img src={Logo} alt="Social Learning Platform" className="h-14 w-14 rounded-2xl bg-white/10 p-2" />
						<div>
							<p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Social Learning Platform</p>
							<h1 className="mt-1 text-4xl font-semibold">Study together. Share progress. Keep moving.</h1>
						</div>
					</div>

					<p className="max-w-2xl text-base leading-7 text-neutral-300">
						A focused space for students to post updates, share resources, and collaborate without losing the thread of their learning.
					</p>

					<div className="flex flex-wrap gap-3">
						<Link to="/login" className="rounded-full bg-sky-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-300">
							Sign in
						</Link>
						<Link to="/register" className="rounded-full border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/10">
							Create account
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}