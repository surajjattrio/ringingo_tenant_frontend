import { useEffect, useState } from "react";
import { Button } from "@/components/forms";
import { MonitoringOverview } from "@/types/master-admin/monitoringTypes";
import { STATUS_COLOR, ageSeconds, formatAge } from "./utils";

interface SummaryBarProps {
    overview: MonitoringOverview | null;
    isLoading: boolean;
    onRefresh: () => void;
}

const SummaryBar = ({ overview, isLoading, onRefresh }: SummaryBarProps) => {
    const [, setTick] = useState(0);

    // Re-renders once a second to keep the "fetched Ns ago" label live.
    // Does NOT touch data/state - no refetch happens here.
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const summary = overview?.summary;
    const age = ageSeconds(overview?.collectedAt);
    const stale = age > 120;

    const counters: Array<{ key: keyof NonNullable<typeof summary>; label: string }> = [
        { key: "healthy", label: "Healthy" },
        { key: "degraded", label: "Degraded" },
        { key: "unhealthy", label: "Unhealthy" },
        { key: "unreachable", label: "Unreachable" },
    ];

    return (
        <div className="bg-white rounded-[25px] p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
                {counters.map((c) => (
                    <div
                        key={c.key}
                        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                        style={{
                            backgroundColor: `${STATUS_COLOR[c.key as keyof typeof STATUS_COLOR]}1a`,
                            color: STATUS_COLOR[c.key as keyof typeof STATUS_COLOR],
                        }}
                    >
                        {summary?.[c.key] ?? 0} {c.label}
                    </div>
                ))}
                {summary && (
                    <div className="text-xs text-gray-400">of {summary.total} services</div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {overview && (
                    <div className="text-right">
                        <div className={`text-xs font-semibold ${stale ? "text-error" : "text-gray-500"}`}>
                            {formatAge(overview.collectedAt)}
                            {stale && " — data may be stale"}
                        </div>
                        <div className="text-[10px] text-gray-400">
                            {new Date(overview.collectedAt).toLocaleString()} · took {overview.durationMs}ms
                        </div>
                    </div>
                )}
                <Button
                    text="Refresh"
                    icon="Refresh2"
                    loading={isLoading}
                    onClick={onRefresh}
                />
            </div>
        </div>
    );
};

export default SummaryBar;
