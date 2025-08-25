import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-200",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border border-accent-200",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;