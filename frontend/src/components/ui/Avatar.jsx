export default function Avatar({ user, size = "md" }) {
	const dim =
		size === "sm" ? "h-7 w-7 text-xs" :
		size === "lg" ? "h-12 w-12 text-base" :
		"h-9 w-9 text-sm";

	if (user?.avatar) {
		return (
			<img
				src={user.avatar}
				alt={user.username}
				className={`${dim} shrink-0 rounded-full object-cover`}
			/>
		);
	}

	return (
		<div className={`${dim} shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center font-semibold text-slate-900`}>
			{user?.username?.[0]?.toUpperCase() ?? "?"}
		</div>
	);
}
