import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
			<div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
				<p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">404</p>
				<h1 className="mt-3 text-4xl font-semibold">That page does not exist.</h1>
				<p className="mt-4 text-neutral-300">The route you requested is not available. Return home or sign in to continue.</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Link to="/" className="rounded-full bg-sky-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-300">
						Go home
					</Link>
					<Link to="/login" className="rounded-full border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/10">
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}