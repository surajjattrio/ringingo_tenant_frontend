"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Dept = "All Departments" | "Sales" | "Support" | "Billing";
type Range = "Daily" | "Weekly" | "Monthly";

const COLORS = {
  total: "#4F46E5", // indigo
  connected: "#059669", // green
  missed: "#E11D48", // red
  dropped: "#D97706", // orange
};

const legend = [
  { key: "total", label: "Total Calls", color: COLORS.total },
  { key: "connected", label: "Connected", color: COLORS.connected },
  { key: "missed", label: "Missed", color: COLORS.missed },
  { key: "dropped", label: "Dropped", color: COLORS.dropped },
] as const;


export default function CallDistribution({ className = "", data }: { className?: string, data?: number[] }) {
  const [dept, setDept] = useState<Dept>("All Departments");
  const [range, setRange] = useState<Range>("Daily");

  // sample numbers (replace with API)
  const series = useMemo(() => {
    if (data && data.length === 4) return data;
    return [68, 14, 11, 7];
  }, [data]);

  const options: ApexOptions = useMemo(
    () => ({
      chart: { type: "donut", toolbar: { show: false } },
      labels: ["Total Calls", "Connected", "Missed", "Dropped"],
      colors: [COLORS.total, COLORS.connected, COLORS.missed, COLORS.dropped],
      stroke: { width: 6, colors: ["#ffffff"] },
      dataLabels: { enabled: false },
      legend: { show: false }, // we build custom legend like screenshot
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
          },
        },
      },
      tooltip: { theme: "light" },
    }),
    []
  );

  return (
    <div className={`h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide text-slate-800">
          CALL DISTRIBUTION
        </h3>

        {/* <div className="flex items-center gap-2">
          <MiniSelect
            value={dept}
            onChange={(v) => setDept(v as Dept)}
            options={["All Departments", "Sales", "Support", "Billing"]}
          />
          <MiniSelect value={range} onChange={(v) => setRange(v as Range)} options={["Daily", "Weekly", "Monthly"]} />
        </div> */}
      </div>

      {/* Donut */}
      <div className="mt-4 flex items-center justify-center">
        {data && data.length === 4 && data.some(v => v > 0) ? (
          <Chart options={options} series={series} type="donut" height={250} />
        ) : (
          <div className="flex h-[250px] flex-col items-center justify-center text-slate-400">
            <span className="text-sm">No data available</span>
          </div>
        )}
      </div>

      {/* Legend bottom */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
        {legend.map((l) => (
          <div key={l.key} className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-sm font-medium" style={{ color: l.color }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
