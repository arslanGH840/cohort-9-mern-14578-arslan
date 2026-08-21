function Button({ variant = "primary", children, className = "", ...props }) {
  const base =
    "text-sm font-medium py-2.5 px-5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1";

  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary: "bg-surface-alt hover:bg-slate-200 text-text-primary",
    danger: "bg-error-bg hover:bg-error hover:text-white text-error",
    ghost: "bg-transparent hover:bg-surface-alt text-text-secondary",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
