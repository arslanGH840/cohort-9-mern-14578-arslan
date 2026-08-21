function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center py-16 px-4"
    >
      <div
        aria-hidden="true"
        className="w-16 h-16 rounded-full bg-error-bg flex items-center justify-center mb-4 text-error"
      >
        !
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-text-secondary text-sm mb-6 max-w-sm">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-primary text-sm font-medium hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
