function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mb-4 text-text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-text-secondary text-sm mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export default EmptyState;
