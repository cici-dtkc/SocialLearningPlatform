import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import FormField from "../../../components/FormField.jsx";
import { clearAuthError, registerUser } from "../authSlice.js";
import Logo from "../../../assets/logo.svg";

function getPasswordStrength(password) {
	if (!password) return { level: 0, label: "", color: "" };
	let score = 0;
	if (password.length >= 6) score++;
	if (password.length >= 10) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;

	if (score <= 2) return { level: score, label: "Weak", color: "bg-red-500" };
	if (score <= 3) return { level: score, label: "Fair", color: "bg-yellow-400" };
	return { level: score, label: "Strong", color: "bg-emerald-400" };
}

export default function RegisterPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const authStatus = useSelector((state) => state.auth.status);
	const authError = useSelector((state) => state.auth.error);

	const [showPassword, setShowPassword] = useState(false);
	const [passwordValue, setPasswordValue] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: { username: "", email: "", fullName: "", password: "" },
	});

	useEffect(() => {
		if (user) navigate("/", { replace: true });
	}, [user, navigate]);

	useEffect(() => {
		if (authError) {
			toast.error(authError);
			dispatch(clearAuthError());
		}
	}, [authError, dispatch]);

	const onSubmit = async (values) => {
		const res = await dispatch(registerUser(values));
		if (registerUser.fulfilled.match(res)) {
			toast.success("Account created! You can sign in now.");
			navigate("/login", { replace: true });
		}
	};

	const strength = getPasswordStrength(passwordValue);
	const isLoading = authStatus === "loading";

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#07111f] to-[#050816] p-6 text-white">
			<div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
				{/* Sidebar */}
				<aside className="hidden md:flex flex-col justify-center gap-6 p-8 rounded-xl bg-white/3 border border-white/8 shadow-lg">
					<div className="flex items-center gap-4">
						<img src={Logo} alt="SL logo" className="w-14 h-14 rounded-xl" />
						<div>
							<h3 className="text-2xl font-semibold">Social Learning</h3>
							<p className="text-sm text-neutral-400">Study together, ship often</p>
						</div>
					</div>

					<ul className="space-y-4">
						<li className="flex items-start gap-3">
							<span className="mt-2 w-2 h-2 rounded-full bg-sky-400 shrink-0" />
							<div>
								<div className="font-medium">Create your profile</div>
								<div className="text-sm text-neutral-400">Customize your avatar and info.</div>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<span className="mt-2 w-2 h-2 rounded-full bg-violet-400 shrink-0" />
							<div>
								<div className="font-medium">Post updates</div>
								<div className="text-sm text-neutral-400">Share notes, links and images.</div>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
							<div>
								<div className="font-medium">Collaborate</div>
								<div className="text-sm text-neutral-400">Comment, like and support peers.</div>
							</div>
						</li>
					</ul>

					<p className="text-sm text-neutral-500 mt-2">
						Join now and keep your learning visible to teammates.
					</p>
				</aside>

				{/* Form */}
				<main className="p-6 rounded-xl bg-white/3 border border-white/8 shadow-lg">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<img src={Logo} alt="SL logo" className="w-10 h-10 md:hidden" />
							<h2 className="text-xl font-semibold">Create your account</h2>
						</div>
						<p className="text-sm text-neutral-400">
							Have one?{" "}
							<Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors">
								Sign in
							</Link>
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							label="Username"
							placeholder="e.g. johndoe_99"
							autoComplete="username"
							{...register("username", {
								required: "Username is required",
								minLength: { value: 3, message: "Minimum 3 characters" },
								maxLength: { value: 30, message: "Maximum 30 characters" },
								pattern: {
									value: /^[a-zA-Z0-9_.-]+$/,
									message: "Only letters, numbers, dots, underscores, hyphens",
								},
							})}
							error={errors.username?.message}
						/>

						<FormField
							label="Full name (optional)"
							placeholder="John Doe"
							autoComplete="name"
							{...register("fullName", {
								maxLength: { value: 100, message: "Maximum 100 characters" },
							})}
							error={errors.fullName?.message}
						/>

						<FormField
							label="Email"
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Enter a valid email",
								},
							})}
							error={errors.email?.message}
						/>

						{/* Password with show/hide toggle */}
						<div className="flex flex-col gap-2">
							<label className="text-sm text-neutral-300">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Minimum 6 characters"
									autoComplete="new-password"
									className="w-full rounded-md bg-white/3 border border-neutral-700 text-sm text-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400"
									{...register("password", {
										required: "Password is required",
										minLength: { value: 6, message: "Minimum 6 characters" },
										onChange: (e) => setPasswordValue(e.target.value),
									})}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
									tabIndex={-1}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
								</button>
							</div>
							{errors.password && (
								<span className="text-sm text-red-400">{errors.password.message}</span>
							)}
							{/* Strength bar */}
							{passwordValue && (
								<div className="flex items-center gap-2 mt-1">
									<div className="flex gap-1 flex-1">
										{[1, 2, 3, 4, 5].map((i) => (
											<div
												key={i}
												className={`h-1 flex-1 rounded-full transition-all duration-300 ${
													i <= strength.level ? strength.color : "bg-white/10"
												}`}
											/>
										))}
									</div>
									<span className={`text-xs ${
										strength.label === "Strong" ? "text-emerald-400" :
										strength.label === "Fair" ? "text-yellow-400" : "text-red-400"
									}`}>
										{strength.label}
									</span>
								</div>
							)}
						</div>

						<div className="flex items-center justify-between gap-3 mt-2">
							<button
								type="submit"
								disabled={isLoading}
								className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-sky-400 to-violet-500 text-slate-900 font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<>
										<span className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
										Creating...
									</>
								) : (
									"Create account"
								)}
							</button>
							<p className="text-xs text-neutral-500">
								By registering you agree to the{" "}
								<span className="text-sky-400 cursor-pointer hover:underline">terms</span>.
							</p>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
}
