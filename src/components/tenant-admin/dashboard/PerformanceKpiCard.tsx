import React from "react";

type Trend = "up" | "down";

type PerformanceKpiCardProps = {
  icon: React.ReactNode;
  iconClassName: string; // e.g. "text-orange-500"
  value: string; // e.g. "00:02:15"
  label: string; // e.g. "AVG WAIT"
  trend: Trend;
  percent: string; // e.g. "12%"
};

export function PerformanceKpiCard({
  icon,
  iconClassName,
  value,
  label,
  trend,
  percent,
}: PerformanceKpiCardProps) {
  const isUp = trend === "up";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col items-center px-5 py-5">
        <div className={["mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50", iconClassName].join(" ")}>
          {/* icon size controlled by the icon itself */}
          {icon}
        </div>

        <div className="text-lg font-semibold text-slate-900">{value}</div>

        <div className="mt-1 text-xs font-medium tracking-wide text-slate-500">
          {label}
        </div>

        {/* <div className={["mt-3 text-sm font-semibold", isUp ? "text-emerald-600" : "text-rose-600"].join(" ")}>
          {isUp ? "↓" : "↑"} {percent}
        </div> */}
      </div>
    </div>
  );
}
