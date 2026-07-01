"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { BarChart3 } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function QueueVolume({ className = "" }: { className?: string }) {
  const categories = ["Sales", "Support", "Billing", "Returns", "General"];
  const series = useMemo(() => [{ name: "Queue Volume", data: [160, 135, 90, 70, 55] }], []);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit",
      },
      colors: ["#3B82F6"], // blue bars like screenshot
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "70%",
        },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: "#E2E8F0",
        strokeDashArray: 5,
        padding: { left: 10, right: 20, top: 10, bottom: 0 },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#64748B", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#64748B", fontSize: "12px" } },
      },
      tooltip: { theme: "light" },
    }),
    []
  );

  return (
    <div className={`h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-slate-700" />
        <h3 className="text-sm font-semibold tracking-wide text-slate-800">
          QUEUE VOLUME
        </h3>
      </div>

      <div className="mt-4">
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
}
