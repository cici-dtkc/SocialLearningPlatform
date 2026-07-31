import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser, selectCurrentUser } from "../../features/auth/authSlice.js";
import Logo from "../../assets/logo.svg";

function NavItem({ to, icon, label, onClick }) {
	const base = "flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-colors hover:bg-white/8 group w-full";

	if (onClick) {
		return (
			<button onClick={onClick} className={base} style={{ background: "none", border: "none", textAlign: "left" }}>
				<span className="text-white" style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
					{icon}
				</span>
				<span className="font-medium text-white" style={{ fontSize: "16px" }}>{label}</span>
			</button>
		);
	}

	return (
		<NavLink to={to} className={({ isActive }) =>
			`${base} ${isActive ? "bg-white/8" : ""}`
		}>
			{({ isActive }) => (
				<>
					<span className="text-white" style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
						{icon}
					</span>
					<span className={`text-white ${isActive ? "font-bold" : "font-medium"}`} style={{ fontSize: "16px" }}>
						{label}
					</span>
				</>
			)}
		</NavLink>
	);
}

// icon
const HomeIcon = () => (
	<svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
		<path d="M9.005 16.545a2.997 2.997 0 012.997-2.997A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" />
	</svg>
);

const SearchIcon = () => (
	<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
	</svg>
);

const NotifIcon = () => (
	<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
	</svg>
);

const CreateIcon = () => (
	<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg>
);

const ProfileIcon = () => (
	<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
	</svg>
);

const LogoutIcon = () => (
	<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
	</svg>
);

const MoreIcon = () => (
	<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
	</svg>
);

//  Sidebar  
export default function Sidebar({ onCreatePost }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const [moreOpen, setMoreOpen] = useState(false);
	const moreRef = useRef(null);

	const handleLogout = () => {
		dispatch(logoutUser());
		toast.success("Logged out");
		navigate("/login");
	};

	if (!user) return null;

	return (
		<>
			 
			<aside
				className="fixed top-0 left-0 h-screen flex flex-col"
				style={{
					width: "244px",
					background: "#000",
					borderRight: "1px solid rgba(255,255,255,0.1)",
					zIndex: 40,
					padding: "8px 12px 20px",
				}}
			>
				<div style={{ padding: "24px 12px 32px" }}>
					<Link to="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
						<img src={Logo} alt="SL" style={{ width: 32, height: 32, borderRadius: "8px" }} />
						<span className="font-semibold text-white" style={{ fontSize: "20px" }}>
							SocialLearn
						</span>
					</Link>
				</div>

				<nav className="flex flex-col gap-1 flex-1">
					<NavItem to="/" icon={<HomeIcon />} label="Home" />
					<NavItem to="/search" icon={<SearchIcon />} label="Search" />
					<NavItem to="/notifications" icon={<NotifIcon />} label="Notifications" />
					<NavItem
						icon={<CreateIcon />}
						label="Create"
						onClick={onCreatePost}
					/>
					<NavLink
						to="/profile"
						className={({ isActive }) =>
							`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors hover:bg-white/8 ${isActive ? "bg-white/8" : ""}`
						}
					>
						{({ isActive }) => (
							<>
								<span style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
									{user.avatar ? (
										<img src={user.avatar} alt={user.username}
											style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover",
												border: isActive ? "2px solid white" : "2px solid transparent" }} />
									) : (
										<div className="flex items-center justify-center font-bold"
											style={{ width: 26, height: 26, borderRadius: "50%",
												background: "linear-gradient(135deg, #38bdf8, #a855f7)",
												color: "#0a0a0a", fontSize: "11px",
												border: isActive ? "2px solid white" : "2px solid transparent" }}>
											{user.username?.[0]?.toUpperCase()}
										</div>
									)}
								</span>
								<span className={`text-white ${isActive ? "font-bold" : "font-medium"}`} style={{ fontSize: "16px" }}>
									Profile
								</span>
							</>
						)}
					</NavLink>
				</nav>

				<div className="relative" ref={moreRef}>
					<button
						onClick={() => setMoreOpen((v) => !v)}
						className="flex items-center gap-4 px-3 py-3 rounded-xl w-full hover:bg-white/8 transition-colors"
						style={{ background: "none", border: "none", cursor: "pointer" }}
					>
						<span style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
							<MoreIcon />
						</span>
						<span className="font-medium text-white" style={{ fontSize: "16px" }}>More</span>
					</button>

					{moreOpen && (
						<div
							className="absolute bottom-full left-0 mb-2 shadow-2xl"
							style={{ width: 220, background: "#1a1a1a",
								border: "1px solid rgba(255,255,255,0.12)",
								borderRadius: "16px", overflow: "hidden", zIndex: 100 }}
						>
							<div style={{ padding: "8px 0" }}>
								<div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
									<p className="font-semibold text-white" style={{ fontSize: "14px" }}>{user.username}</p>
									<p style={{ fontSize: "12px", color: "#a8a8a8" }}>{user.email}</p>
								</div>
								<button
									onClick={handleLogout}
									className="flex items-center gap-3 w-full hover:bg-white/5 transition-colors"
									style={{ padding: "12px 16px", background: "none", border: "none",
										cursor: "pointer", fontSize: "14px", color: "#ed4956" }}
								>
									<LogoutIcon />
									Log out
								</button>
							</div>
						</div>
					)}
				</div>
			</aside>

			<div style={{ width: "244px", flexShrink: 0 }} />
		</>
	);
}
