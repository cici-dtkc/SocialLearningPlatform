import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import FormField from "../../../components/FormField.jsx";
import { clearAuthError, loginUser } from "../authSlice.js";
import Logo from "../../../assets/logo.svg";

export default function LoginPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const authStatus = useSelector((state) => state.auth.status);
	const authError = useSelector((state) => state.auth.error);

	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: { identifier: "", password: "" },
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
		const res = await dispatch(loginUser(values));
		if (loginUser.fulfilled.match(res)) {
			toast.success("Welcome back!");
			navigate("/", { replace: true });
		}
	};

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
								<div className="font-medium">Share updates</div>
								<div className="text-sm text-neutral-400">Publish progress, notes and resources.</div>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<span className="mt-2 w-2 h-2 rounded-full bg-violet-400 shrink-0" />
							<div>
								<div className="font-medium">Connect & learn</div>
								<div className="text-sm text-neutral-400">Comment, reply and iterate with peers.</div>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
							<div>
								<div className="font-medium">Track progress</div>
								<div className="text-sm text-neutral-400">See your journey and celebrate wins.</div>
							</div>
						</li>
					</ul>

					<p className="text-sm text-neutral-500 mt-2">
						Join the community and keep your learning flow visible.
					</p>
				</aside>

				{/* Form */}
				<main className="p-6 rounded-xl bg-white/3 border border-white/8 shadow-lg">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<img src={Logo} alt="SL logo" className="w-10 h-10 md:hidden" />
							<h2 className="text-xl font-semibold">Welcome back</h2>
						</div>
						<p className="text-sm text-neutral-400">
							New here?{" "}
							<Link to="/register" className="text-sky-400 hover:text-sky-300 transition-colors">
								Sign up
							</Link>
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							label="Email or username"
							placeholder="you@example.com or username"
							autoComplete="username"
							{...register("identifier", {
								required: "Email or username is required",
							})}
							error={errors.identifier?.message}
						/>

						<div className="flex flex-col gap-2">
							<label className="text-sm text-neutral-300">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									autoComplete="current-password"
									className="w-full rounded-md bg-white/3 border border-neutral-700 text-sm text-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400"
									{...register("password", {
										required: "Password is required",
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
										Signing in...
									</>
								) : (
									"Sign in"
								)}
							</button>
							<Link
								to="/forgot-password"
								className="text-sm text-neutral-400 hover:text-white transition-colors"
							>
								Forgot password?
							</Link>
						</div>
					</form>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-white/10" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-white/3 px-2 text-neutral-500">Or continue with</span>
						</div>
					</div>

					<div className="text-center text-sm text-neutral-500">
						OAuth integration coming soon
					</div>
				</main>
			</div>
		</div>
	);
}
