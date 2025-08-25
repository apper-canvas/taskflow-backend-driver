import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  required = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 text-sm border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white";
  const validStyles = "border-gray-300 focus:border-primary-500 focus:ring-primary-200";
  const errorStyles = "border-accent-300 focus:border-accent-500 focus:ring-accent-200";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          baseStyles,
          error ? errorStyles : validStyles,
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-accent-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;