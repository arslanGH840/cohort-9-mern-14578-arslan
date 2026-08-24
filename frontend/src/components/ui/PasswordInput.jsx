import { forwardRef, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(function PasswordInput(
  { id, placeholder, className = "", ...props },
  ref,
) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
      <input
        ref={ref}
        id={id}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full border border-border rounded-lg pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
        tabIndex={-1}
      >
        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});

export default PasswordInput;
