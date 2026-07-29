import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logoutUser, selectCurrentUser } from "../../features/auth/authSlice.js";
import Logo from "../../assets/logo.svg";
import toast from "react-hot-toast";

export default function Navbar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = async () => {
		await dispatch(logoutUser());
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
					/* Logged in */
					<div className="flex items-center gap-3">
						<span className="hidden text-sm text-neutral-400 sm:block">
							Hi, <span className="text-white">{user.username}</span>
						</span>

						{/* Avatar dropdown */}
						<div className="relative">
							<button
								onClick={() => setMenuOpen((v) => !v)}
								className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-sm font-semibold text-slate-900"
							>
								{user.avatar ? (
									<img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
								) : (
									user.username?.[0]?.toUpperCase()
								)}
							</button>

							{menuOpen && (
								<div
									className="absolute right-0 mt-2 w-44 rounded-lg border border-white/10 bg-[#0d1525] py-1 shadow-xl"
									onBlur={() => setMenuOpen(false)}
								>
									<div className="border-b border-white/8 px-3 py-2">
										<p className="text-sm font-medium text-white">{user.fullName || user.username}</p>
										<p className="truncate text-xs text-neutral-400">{user.email}</p>
									</div>
									<Link
										to="/profile"
										onClick={() => setMenuOpen(false)}
										className="block px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white"
									>
										Profile
									</Link>
									<button
										onClick={handleLogout}
										className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
									>
										Sign out
									</button>
								</div>
							)}
						</div>
					</div>
				) : (
					/* Not logged in */
					<div className="flex items-center gap-2">
						<Link
							to="/login"
							className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:text-white"
						>
							Sign in
						</Link>
						<Link
							to="/register"
							className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400"
						>
							Get started
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
