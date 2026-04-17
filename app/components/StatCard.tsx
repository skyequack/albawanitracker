import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  valueColor?: "blue" | "green" | "orange" | "red";
  subtext?: string;
}

export function StatCard({
  label,
  value,
  valueColor = "blue",
  subtext,
}: StatCardProps) {
  const colorClasses = {
    blue: "text-indigo-600 bg-indigo-50",
    green: "text-teal-600 bg-teal-50",
    orange: "text-amber-600 bg-amber-50",
    red: "text-rose-600 bg-rose-50",
  };

  const borderClasses = {
    blue: "border-indigo-100",
    green: "border-teal-100",
    orange: "border-amber-100",
    red: "border-rose-100",
  };

  return (
    <div className={`bg-white rounded-2xl border ${borderClasses[valueColor]} p-6 hover:border-opacity-100 transition-all duration-300`}>
      <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">{label}</h3>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold tracking-tight ${colorClasses[valueColor].split(" ")[0]}`}>
          {value}
        </p>
      </div>
      {subtext && (
        <div className="mt-4 flex items-center">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[valueColor]}`}>
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
}
