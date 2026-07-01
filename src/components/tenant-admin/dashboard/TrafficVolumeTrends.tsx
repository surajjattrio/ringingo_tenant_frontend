"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { TrendingUp } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TimeRange = "Daily" | "Weekly" | "Monthly";
type Channel = "All" | "Inbound" | "Outbound";

export default function TrafficVolumeTrends({ className = "", data }: { className?: string, data?: any }) {
  const [timeRange, setTimeRange] = useState<TimeRange>("Daily");
  const [channel, setChannel] = useState<Channel>("All");

  const times = useMemo(() => data?.labels || ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"], [data]);

  const series = useMemo(() => {
    const inbound = { name: "Inbound", data: data?.inbound || [0,0,0,0,0,0,0,0,0,0,0] };
    const outbound = { name: "Outbound", data: data?.outbound || [0,0,0,0,0,0,0,0,0,0,0] };

    if (channel === "Inbound") return [inbound];
    if (channel === "Outbound") return [outbound];
    return [inbound, outbound];
  }, [channel, data]);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true },
        fontFamily: "inherit",
      },
      stroke: {
        curve: "smooth",
        width: 4,
      },
      colors: ["#4F46E5", "#059669"], // purple, green
      markers: {
        size: 7,
        strokeWidth: 0,
        hover: { size: 8 },
      },
      grid: {
        borderColor: "#E2E8F0",
        strokeDashArray: 5,
        padding: { left: 10, right: 20, top: 10, bottom: 0 },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: times,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: "#64748B", fontSize: "12px" },
        },
      },
      yaxis: {
        min: 0,
        max: 160,
        tickAmount: 4,
        labels: {
          style: { colors: "#64748B", fontSize: "12px" },
        },
      },
      legend: { show: false }, // we’ll render custom legend like screenshot
      tooltip: {
        theme: "light",
        x: { show: true },
      },
    }),
    []
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900">Traffic Volume Trends</h3>
        </div>
       {/* 
        <div className="flex flex-wrap items-center gap-3">
          <PillGroup<TimeRange>
            value={timeRange}
            onChange={setTimeRange}
            options={["Daily", "Weekly", "Monthly"]}
          />

          <span className="hidden h-6 w-px bg-slate-200 md:block" />

          <PillGroup<Channel>
            value={channel}
            onChange={setChannel}
            options={["All", "Inbound", "Outbound"]}
          />
        </div> */}
      </div>

      {/* Chart */}
      <div className="mt-4">
        {data?.labels?.length > 0 ? (
          <Chart options={options} series={series} type="line" height={330} />
        ) : (
          <div className="flex h-[330px] flex-col items-center justify-center text-slate-400">
            <span className="text-sm">No data available</span>
          </div>
        )}
      </div>

      {/* Custom legend (bottom center) */}
      <div className="mt-2 flex items-center justify-center gap-6">
        {(channel === "All" || channel === "Inbound") && (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-indigo-600" />
            <span className="text-lg font-medium text-indigo-600">Inbound</span>
          </div>
        )}
        {(channel === "All" || channel === "Outbound") && (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-emerald-600" />
            <span className="text-lg font-medium text-emerald-600">Outbound</span>
          </div>
        )}
      </div>

      {/* NOTE: timeRange state is ready. You can swap series based on Daily/Weekly/Monthly later */}
    </div>
  );
}
