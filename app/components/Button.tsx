import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.97] shadow-sm";

  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-slate-900 border border-slate-300 hover:bg-slate-100",
    danger: "bg-rose-100 text-rose-700 hover:bg-rose-200",
  };

  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-xs",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
        </div>
      ) : children}
    </button>
  );
}
