"use client";

import React from "react";

// TYPES
interface UsageChartProps {
    title: string;
    data: string;
}

// Self-contained, robust SVG Semi-Circular Gauge Component (No external chunk load dependencies)
const SemiCircleGauge = ({ percent }: { percent: number }) => {
    const clampedPercent = Math.min(Math.max(isNaN(percent) ? 0 : percent, 0), 1);
    const radius = 75;
    const strokeWidth = 14;
    const cx = 100;
    const cy = 90;

    // Semi-circle circumference = π * radius
    const circumference = Math.PI * radius;

    // Arc lengths matching [50%, 30%, 20%]
    const arc1Len = circumference * 0.5;
    const arc2Len = circumference * 0.3;
    const arc3Len = circumference * 0.2;

    // Needle angle: from -180deg (0%) to 0deg (100%)
    const needleAngle = -180 + clampedPercent * 180;
    const needleRad = (needleAngle * Math.PI) / 180;
    const needleLen = radius - 15;
    const needleX = cx + needleLen * Math.cos(needleRad);
    const needleY = cy + needleLen * Math.sin(needleRad);

    return (
        <div className="relative flex flex-col items-center justify-center p-2">
            <svg viewBox="0 0 200 115" className="w-full max-w-[220px] overflow-visible">
                {/* Arc 1: Green (0 - 50%) */}
                <path
                    d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx} ${cy - radius}`}
                    fill="none"
                    stroke="#90E4BB"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Arc 2: Yellow/Orange (50% - 80%) */}
                <path
                    d={`M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos((-36 * Math.PI) / 180)} ${cy - radius * Math.sin((36 * Math.PI) / 180)}`}
                    fill="none"
                    stroke="#E4AE90"
                    strokeWidth={strokeWidth}
                />

                {/* Arc 3: Red (80% - 100%) */}
                <path
                    d={`M ${cx + radius * Math.cos((-36 * Math.PI) / 180)} ${cy - radius * Math.sin((36 * Math.PI) / 180)} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                    fill="none"
                    stroke="#E49090"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Needle Line */}
                <line
                    x1={cx}
                    y1={cy}
                    x2={needleX}
                    y2={needleY}
                    stroke="#2D3748"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />

                {/* Center Pivot Dot */}
                <circle cx={cx} cy={cy} r="6" fill="#2D3748" />
                <circle cx={cx} cy={cy} r="2.5" fill="#FFFFFF" />

                {/* Percentage Text */}
                <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    className="font-bold text-gray-800 text-sm"
                    fill="#1A202C"
                    style={{ fontSize: "16px", fontWeight: "700" }}
                >
                    {(clampedPercent * 100).toFixed(0)}%
                </text>
            </svg>
        </div>
    );
};

const UsageChart = (props: UsageChartProps) => {
    const { title, data } = props;
    const numericVal = parseFloat(data?.replace("%", "") || "0");
    const free = Math.max(0, 100 - numericVal);

    return (
        <div className="bg-white h-full rounded-xl drop-shadow-sm border border-gray-100 flex flex-col justify-between p-4">
            <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-gray-900 text-sm font-bold">{title}</span>
            </div>

            <div className="my-2">
                <SemiCircleGauge percent={numericVal / 100} />
            </div>

            <div className="flex py-2 px-1 items-center justify-evenly bg-gray-50 rounded-lg border border-gray-100 text-center">
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">Total</span>
                    <span className="text-xs font-bold text-gray-800">100%</span>
                </div>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-emerald-600 uppercase">Used</span>
                    <span className="text-xs font-bold text-gray-800">{numericVal.toFixed(1)}%</span>
                </div>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-blue-600 uppercase">Free</span>
                    <span className="text-xs font-bold text-gray-800">{free.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
};

export default UsageChart;
