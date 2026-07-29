import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser, selectCurrentUser } from "../../features/auth/authSlice.js";
import Logo from "../../assets/logo.svg";

export default function Navbar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handler = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleLogout = () => {
		dispatch(logoutUser());
		toast.success("Logged out");
		navigate("/login");
	};

	return (
		<header className="sticky top-0 z-50 border-b border-white/8 bg-[#07111f]/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2">
					<img src={Logo} alt="SL" className="h-7 w-7 rounded-md" />
					<span className="font-semibold text-white">Social Learning</span>
				</Link>

				{user ? (
					<div className="flex items-center gap-3">
						<span className="hidden text-sm text-neutral-400 sm:block">
							Hi, <span className="text-white">{user.username}</span>
						</span>

						{/* Avatar + dropdown */}
						<div className="relative" ref={menuRef}>
							<button
								onClick={() => setMenuOpen((v) => !v)}
								className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-sky-400/50 transition-all"
								aria-label="User menu"
							>
								{user.avatar ? (
									<img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
								) : (
									<div className="h-full w-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-sm font-semibold text-slate-900">
										{user.username?.[0]?.toUpperCase()}
									</div>
								)}
							</button>

							{menuOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0d1525] shadow-xl overflow-hidden">
									{/* User info */}
									<div className="border-b border-white/8 px-4 py-3">
										<p className="text-sm font-medium text-white truncate">
											{user.fullName || user.username}
										</p>
										<p className="text-xs text-neutral-400 truncate">{user.email}</p>
										<span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] ${
											user.role === "mentor" ? "bg-violet-500/20 text-violet-300" :
											user.role === "admin" ? "bg-red-500/20 text-red-300" :
											"bg-sky-500/20 text-sky-300"
										}`}>
											{user.role}
										</span>
									</div>

									{/* Menu items */}
									<div className="py-1">
										<Link
											to="/profile"
											onClick={() => setMenuOpen(false)}
											className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
										>
											<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
											</svg>
											View profile
										</Link>
										<Link
											to="/profile"
											onClick={() => setMenuOpen(false)}
											className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
										>
											<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
											</svg>
											Edit profile
										</Link>
									</div>

									{/* Logout */}
									<div className="border-t border-white/8 py-1">
										<button
											onClick={handleLogout}
											className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
										>
											<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
											</svg>
											Sign out
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<Link
							to="/login"
							className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:text-white transition-colors"
						>
							Sign in
						</Link>
						<Link
							to="/register"
							className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400 transition-colors"
						>
							Get started
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
