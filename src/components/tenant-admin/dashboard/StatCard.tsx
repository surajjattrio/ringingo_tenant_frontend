import React from "react";

type Trend = "up" | "down" | "neutral";

type StatCardProps = {
  title: string;
  value: string | number;

  // Optional delta row
  trend?: Trend;
  deltaText?: string; // e.g. "+12.5%"
  deltaCaption?: string; // e.g. "vs last period"

  // Icon bubble on the right
  icon?: React.ReactNode;
  iconBgClassName?: string; // e.g. "bg-emerald-50"
  iconClassName?: string; // e.g. "text-emerald-500"

  // Card sizing
  variant?: "large" | "compact";

  className?: string;
};

const trendStyles: Record<Trend, { text: string; bg: string; arrow: string }> = {
  up: { text: "text-emerald-600", bg: "bg-emerald-50", arrow: "↗" },
  down: { text: "text-rose-600", bg: "bg-rose-50", arrow: "↘" },
  neutral: { text: "text-slate-500", bg: "bg-slate-50", arrow: "→" },
};

export function StatCard({
  title,
  value,
  trend = "neutral",
  deltaText,
  deltaCaption = "",
  icon,
  iconBgClassName = "bg-slate-50",
  iconClassName = "text-slate-600",
  variant = "large",
  className = "",
}: StatCardProps) {
  const t = trendStyles[trend];

  const isLarge = variant === "large";

  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white",
        "shadow-sm",
        isLarge ? "px-5 py-4" : "px-5 py-4",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <div className={isLarge ? "mt-3" : "mt-2"}>
            <p className={isLarge ? "text-3xl font-semibold text-slate-900" : "text-2xl font-semibold text-slate-900"}>
              {value}
            </p>
          </div>

          {/* Delta row (optional) */}
          {/* {deltaText ? (
            <div className={isLarge ? "mt-4 flex items-center gap-2" : "mt-3 flex items-center gap-2"}> */}
              {/* <span
                className={[
                  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                  t.bg,
                  t.text,
                ].join(" ")}
              >
                <span className="text-[11px]">{t.arrow}</span>
                {deltaText}
              </span> */}
              {/* <span className="text-sm text-slate-500">{deltaText}</span>
            </div>
          ) : null} */}
        </div>

        {/* Icon bubble (optional) */}
        {icon ? (
          <div className={["flex h-12 w-12 items-center justify-center rounded-2xl", iconBgClassName].join(" ")}>
            <span className={["h-6 w-6", iconClassName].join(" ")}>{icon}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
