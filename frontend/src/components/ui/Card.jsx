function Card({
  children,
  className = "",
  hoverable = false,
  as = "div",
  ...props
}) {
  const Component = as;
  const hoverClasses = hoverable
    ? "hover:shadow-md hover:border-slate-300 transition cursor-pointer"
    : "";

  return (
    <Component
      className={`bg-surface border border-border rounded-lg p-5 min-w-0 overflow-hidden ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;