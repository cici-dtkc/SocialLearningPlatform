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

	useEffect(() => {
		const handler = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
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
		<header className="fixed top-0 left-0 right-0 z-50"
			style={{ background: "#000", borderBottom: "1px solid rgba(255,255,255,0.12)", height: "60px" }}>
			<div className="mx-auto flex items-center justify-between px-6"
				style={{ maxWidth: "1024px", height: "60px" }}>

				<Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
					<img src={Logo} alt="SL" style={{ width: 30, height: 30, borderRadius: "8px" }} />
					<span className="font-semibold text-white" style={{ fontSize: "18px" }}>
						Social Learning
					</span>
				</Link>

				{user ? (
					<div className="flex items-center gap-4" ref={menuRef}>
							<div className="relative">
							<button onClick={() => setMenuOpen((v) => !v)} aria-label="User menu"
								style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden",
									border: menuOpen ? "2px solid rgba(255,255,255,0.5)" : "2px solid transparent",
									outline: "none", cursor: "pointer", transition: "border-color 0.2s",
									padding: 0, background: "none" }}>
								{user.avatar ? (
									<img src={user.avatar} alt={user.username}
										style={{ width: "100%", height: "100%", objectFit: "cover" }} />
								) : (
									<div className="flex items-center justify-center font-bold"
										style={{ width: "100%", height: "100%",
											background: "linear-gradient(135deg, #38bdf8, #a855f7)",
											color: "#0a0a0a", fontSize: "11px" }}>
										{user.username?.[0]?.toUpperCase()}
									</div>
								)}
							</button>

							{menuOpen && (
								<div className="absolute right-0 mt-2 shadow-2xl"
									style={{ width: 220, background: "#1a1a1a",
										border: "1px solid rgba(255,255,255,0.12)",
										borderRadius: "12px", overflow: "hidden", zIndex: 100 }}>
									<div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
										<p className="font-semibold text-white truncate" style={{ fontSize: "14px" }}>
											{user.username}
										</p>
										<p className="truncate" style={{ fontSize: "12px", color: "#a8a8a8" }}>
											{user.fullName || user.email}
										</p>
										<span style={{ display: "inline-block", marginTop: "4px",
											fontSize: "10px", borderRadius: "20px", padding: "2px 8px",
											background: user.role === "mentor" ? "rgba(168,85,247,0.2)" :
												user.role === "admin" ? "rgba(239,68,68,0.2)" : "rgba(0,149,246,0.15)",
											color: user.role === "mentor" ? "#c084fc" :
												user.role === "admin" ? "#fca5a5" : "#60a5fa" }}>
											{user.role}
										</span>
									</div>

									<div style={{ padding: "4px 0" }}>
										<Link to="/profile" onClick={() => setMenuOpen(false)}
											style={{ display: "flex", alignItems: "center", gap: "10px",
												padding: "9px 16px", fontSize: "14px", color: "#ffffff",
												textDecoration: "none" }}
											className="hover:bg-white/5 transition-colors">
											<svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24"
												stroke="currentColor" strokeWidth={1.8}>
												<path strokeLinecap="round" strokeLinejoin="round"
													d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
											</svg>
											Your profile
										</Link>
									</div>

									<div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "4px 0" }}>
										<button onClick={handleLogout}
											style={{ display: "flex", alignItems: "center", gap: "10px",
												width: "100%", padding: "9px 16px", fontSize: "14px",
												color: "#ed4956", background: "none", border: "none", cursor: "pointer" }}
											className="hover:bg-white/5 transition-colors">
											<svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24"
												stroke="currentColor" strokeWidth={1.8}>
												<path strokeLinecap="round" strokeLinejoin="round"
													d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
											</svg>
											Log out
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center gap-3">
						<Link to="/login" className="font-semibold text-white hover:text-white/70 transition-colors"
							style={{ fontSize: "14px", textDecoration: "none" }}>
							Log in
						</Link>
						<Link to="/register" className="font-semibold text-white hover:opacity-80 transition-opacity"
							style={{ fontSize: "14px", textDecoration: "none",
								background: "#0095f6", borderRadius: "8px", padding: "7px 18px" }}>
							Sign up
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
