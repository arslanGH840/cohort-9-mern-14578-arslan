function Loader({ label = "Loading..." }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-12"
    >
      <div
        aria-hidden="true"
        className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin"
      />
      <p className="text-text-muted text-sm mt-3">{label}</p>
    </div>
  );
}

export default Loader;
