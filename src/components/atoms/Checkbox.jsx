import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className,
  checked = false,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ref={ref}
        {...props}
      />
      <div
        onClick={() => !disabled && onChange && onChange({ target: { checked: !checked } })}
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 checkbox-animation",
          checked 
            ? "bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500 shadow-sm" 
            : "bg-white border-gray-300 hover:border-primary-400",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {checked && (
          <ApperIcon 
            name="Check" 
            size={12} 
            className="text-white"
          />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;