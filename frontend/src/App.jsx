import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import HomePage from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProfilePage from "./features/user/pages/ProfilePage.jsx";
import PublicProfilePage from "./features/user/pages/PublicProfilePage.jsx";
import { loadCurrentUser, selectAuthInitialized } from "./features/auth/authSlice.js";

function AppContent() {
	const dispatch = useDispatch();
	const initialized = useSelector(selectAuthInitialized);

	useEffect(() => {
		const token = localStorage.getItem("slp_token");
		if (token) {
			dispatch(loadCurrentUser());
		}
	}, [dispatch]);

	if (!initialized) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#07111f] to-[#050816]">
				<div className="h-8 w-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
			</div>
		);
	}

	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/" element={<HomePage />} />
			<Route path="/profile" element={<ProfilePage />} />
			<Route path="/profile/:userId" element={<PublicProfilePage />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AppContent />
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#1a1f2e",
						color: "#f1f5f9",
						border: "1px solid rgba(255,255,255,0.1)",
					},
				}}
			/>
		</BrowserRouter>
	);
}
