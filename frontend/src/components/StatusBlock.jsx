export function StatusBlock({ status, message }) {
  if (status === "idle") return null;

  return (
    <div
      className={`mt-5 rounded-lg px-4 py-3 text-sm ${
        status === "error"
          ? "bg-red-500/10 text-red-100"
          : "bg-emerald-400/10 text-emerald-100"
      }`}
    >
      {message}
    </div>
  );
}
