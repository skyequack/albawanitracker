import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = "", title }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
      {title && <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wider mb-4">{title}</h3>}
      {children}
    </div>
  );
}
