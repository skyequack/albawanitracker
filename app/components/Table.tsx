import React from "react";

interface TableColumn<T> {
  header: string;
  accessor: keyof T & string;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Array<TableColumn<T>>;
  data: T[];
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-y border-slate-100 italic">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`group transition-all ${
                onRowClick
                  ? "hover:bg-slate-50/80 cursor-pointer"
                  : "hover:bg-slate-50/80"
              }`}
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-5 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {React.isValidElement(row[col.accessor]) 
                    ? row[col.accessor] as React.ReactNode 
                    : String(row[col.accessor] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
