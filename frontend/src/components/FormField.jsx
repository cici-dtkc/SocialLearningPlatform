export default function FormField({ label, error, multiline = false, className = "", ...props }) {
  const base = "rounded-md bg-white/3 border border-neutral-700 text-sm text-gray-900 placeholder:text-neutral-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 autofill:shadow-[0_0_0_100px_rgba(255,255,255,0.05)_inset] autofill:text-gray-900";
  const fieldClassName = [base, className].filter(Boolean).join(" ");

  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-sm text-neutral-300">{label}</span> : null}
      {multiline ? (
        <textarea className={fieldClassName + " min-h-[88px] resize-vertical"} {...props} />
      ) : (
        <input className={fieldClassName} {...props} />
      )}
      {error ? <span className="text-sm text-red-400 mt-1">{error}</span> : null}
    </label>
  );
}