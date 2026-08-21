function Card({ children, className = "", hoverable = false, ...props }) {
  const hoverClasses = hoverable
    ? "hover:shadow-md hover:border-slate-300 transition cursor-pointer"
    : "";

  return (
    <div
      className={`bg-surface border border-border rounded-lg p-5 ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
