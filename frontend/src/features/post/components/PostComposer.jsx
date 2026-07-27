import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../../auth/authSlice.js";
import { createPost } from "../postSlice.js";
import { uploadPostImagesRequest } from "../services/postService.js";
import Avatar from "../../../components/ui/Avatar.jsx";

const MAX_FILES = 4;
const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

export default function PostComposer() {
	const dispatch = useDispatch();
	const user = useSelector(selectCurrentUser);
	const fileRef = useRef(null);

	const [open, setOpen] = useState(false);
	const [content, setContent] = useState("");
	const [tags, setTags] = useState("");
	const [files, setFiles] = useState([]);       // File objects (preview)
	const [previews, setPreviews] = useState([]);  // blob URLs
	const [uploading, setUploading] = useState(false);
	const [loading, setLoading] = useState(false);

	const reset = () => {
		setOpen(false);
		setContent("");
		setTags("");
		setFiles([]);
		setPreviews((prev) => { prev.forEach(URL.revokeObjectURL); return []; });
	};

	const handleFiles = (selected) => {
		const valid = Array.from(selected).filter((f) => f.type.startsWith("image/"));
		if (valid.length === 0) { toast.error("Only image files are allowed"); return; }
		const combined = [...files, ...valid].slice(0, MAX_FILES);
		if (files.length + valid.length > MAX_FILES)
			toast(`Max ${MAX_FILES} images`, { icon: "⚠️" });
		setFiles(combined);
		setPreviews(combined.map((f) => URL.createObjectURL(f)));
	};

	const removeImage = (idx) => {
		URL.revokeObjectURL(previews[idx]);
		setFiles((p) => p.filter((_, i) => i !== idx));
		setPreviews((p) => p.filter((_, i) => i !== idx));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;
		setLoading(true);

		let imageUrls = [];
		if (files.length > 0) {
			setUploading(true);
			try {
				const res = await uploadPostImagesRequest(files);
				imageUrls = res.data.map((img) => img.url);
			} catch {
				toast.error("Image upload failed");
				setLoading(false);
				setUploading(false);
				return;
			}
			setUploading(false);
		}

		const tagsArray = tags
			.split(",")
			.map((t) => t.trim().replace(/^#/, ""))
			.filter(Boolean);

		const res = await dispatch(createPost({
			content: content.trim(),
			tags: tagsArray,
			images: imageUrls,
		}));

		setLoading(false);
		if (createPost.fulfilled.match(res)) {
			toast.success("Post published!");
			reset();
		} else {
			toast.error(res.payload || "Failed to post");
		}
	};

	/* drag-and-drop */
	const handleDrop = (e) => {
		e.preventDefault();
		handleFiles(e.dataTransfer.files);
	};

	return (
		<div className="rounded-xl border border-white/8 bg-white/3 p-4">
			<div className="flex items-center gap-3">
				<Avatar user={user} size="md" />
				{!open && (
					<button
						onClick={() => setOpen(true)}
						className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-left text-sm text-neutral-500 hover:border-sky-400/40 hover:text-neutral-300 transition-colors"
					>
						What are you learning today?
					</button>
				)}
			</div>

			{open && (
				<form onSubmit={handleSubmit} className="mt-3 space-y-3">
					{/* Text area */}
					<textarea
						autoFocus
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Share your update, note, or resource…"
						maxLength={5000}
						rows={3}
						className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
					/>

					{/* Image preview grid */}
					{previews.length > 0 && (
						<div className="grid grid-cols-2 gap-2">
							{previews.map((src, i) => (
								<div key={i} className="relative group rounded-lg overflow-hidden border border-white/10">
									<img src={src} alt="" className="h-32 w-full object-cover" />
									<button
										type="button"
										onClick={() => removeImage(i)}
										className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"
									>
										✕
									</button>
								</div>
							))}
							{previews.length < MAX_FILES && (
								<button
									type="button"
									onClick={() => fileRef.current?.click()}
									className="h-32 flex flex-col items-center justify-center rounded-lg border border-dashed border-white/20 text-neutral-500 hover:border-sky-400/40 hover:text-neutral-300 transition-colors text-xs gap-1"
								>
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
									</svg>
									Add more
								</button>
							)}
						</div>
					)}

					{/* Drop zone (shown when no images yet) */}
					{previews.length === 0 && (
						<div
							onDrop={handleDrop}
							onDragOver={(e) => e.preventDefault()}
							onClick={() => fileRef.current?.click()}
							className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 py-5 text-neutral-500 hover:border-sky-400/40 hover:text-neutral-300 cursor-pointer transition-colors"
						>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h.008v.008H3V9.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v9a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 16.5V7.5z" />
							</svg>
							<span className="text-xs">Click or drag images here (max {MAX_FILES})</span>
						</div>
					)}

					<input
						ref={fileRef}
						type="file"
						accept={ACCEPT}
						multiple
						className="hidden"
						onChange={(e) => handleFiles(e.target.files)}
					/>

					{/* Tags */}
					<div className="flex items-center gap-2">
						<span className="text-xs text-neutral-500">#</span>
						<input
							type="text"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder="Tags — comma separated (e.g. react, nodejs)"
							className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
						/>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between">
						<span className="text-xs text-neutral-500">{content.length}/5000</span>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={reset}
								className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={!content.trim() || loading}
								className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{uploading ? (
									<><span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Uploading…</>
								) : loading ? (
									<><span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Posting…</>
								) : "Publish"}
							</button>
						</div>
					</div>
				</form>
			)}
		</div>
	);
}
