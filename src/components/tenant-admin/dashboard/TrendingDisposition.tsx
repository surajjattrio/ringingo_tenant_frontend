"use client";
import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";

type RowCfg = {
  label: string;
  valueText: string;
  valueColorClass: string;
  barColorClass: string;
  percent: number;
};

function ProgressRow({
  label,
  valueText,
  valueColorClass,
  barColorClass,
  percent,
}: RowCfg) {
  const safe = Math.max(0, Math.min(100, percent));

  return (
    <div className="py-3"> {/* ✅ smaller spacing for 5 rows */}
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-slate-600">{label}</div>
        <div className={["text-lg font-semibold", valueColorClass].join(" ")}>
          {valueText}
        </div>
      </div>

      <div className="mt-2 h-3 w-full rounded-full bg-slate-100">
        <div
          className={["h-3 rounded-full", barColorClass].join(" ")}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

export default function TrendingDisposition({ className = "", data }: { className?: string, data?: any[] }) {
  const defaultRows: RowCfg[] = [
    {
      label: "Interested",
      valueText: "42%",
      valueColorClass: "text-emerald-600",
      barColorClass: "bg-emerald-500",
      percent: 42,
    },
    {
      label: "Callback Scheduled",
      valueText: "28%",
      valueColorClass: "text-orange-600",
      barColorClass: "bg-orange-500",
      percent: 28,
    },
    {
      label: "Not Answered",
      valueText: "18%",
      valueColorClass: "text-rose-600",
      barColorClass: "bg-rose-500",
      percent: 18,
    },
    {
      label: "Busy",
      valueText: "9%",
      valueColorClass: "text-indigo-600",
      barColorClass: "bg-indigo-500",
      percent: 9,
    },
    {
      label: "Wrong Number",
      valueText: "6%",
      valueColorClass: "text-slate-700",
      barColorClass: "bg-slate-500",
      percent: 6,
    },
  ];

  const colorClasses = [
    { value: "text-emerald-600", bar: "bg-emerald-500" },
    { value: "text-orange-600", bar: "bg-orange-500" },
    { value: "text-rose-600", bar: "bg-rose-500" },
    { value: "text-indigo-600", bar: "bg-indigo-500" },
    { value: "text-slate-700", bar: "bg-slate-500" },
  ];

  const rows: RowCfg[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item, idx) => ({
      label: item.label,
      valueText: item?.value?.toLocaleString(), // Show raw count
      valueColorClass: colorClasses[idx % colorClasses.length].value,
      barColorClass: colorClasses[idx % colorClasses.length].bar,
      percent: item.percent, // Keep percent for progress bar width
    }));
  }, [data]);

  return (
    <div
      className={[
        "h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-indigo-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Trending Dispositions
        </h3>
      </div>

      <div className="mt-4">
        {rows.length > 0 ? (
          rows.slice(0, 5).map((row) => (
            <ProgressRow key={row.label} {...row} />
          ))
        ) : (
          <div className="flex h-[280px] flex-col items-center justify-center text-slate-400">
            <span className="text-sm">No data available</span>
          </div>
        )}
      </div>
    </div>
  );
}
