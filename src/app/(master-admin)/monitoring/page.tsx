"use client";
import { useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    monitoringOverviewGet,
    useMonitoringSelector,
} from "@/redux/slice/master-admin/monitoringSlice";
import { Loader } from "@/components/ui-components";
import { Button } from "@/components/forms";
import SummaryBar from "@/components/master-admin/monitoring/SummaryBar";
import ServerGroup from "@/components/master-admin/monitoring/ServerGroup";
import DependencyMatrix from "@/components/master-admin/monitoring/DependencyMatrix";
import DetailDrawer from "@/components/master-admin/monitoring/DetailDrawer";
import { TargetHealthResult } from "@/types/master-admin/monitoringTypes";

const Monitoring = () => {
    const dispatch = useAppDispatch();
    const { overview, isLoading, hasLoaded, error } = useMonitoringSelector();
    const [selected, setSelected] = useState<TargetHealthResult | null>(null);

    // Fetch once on mount only - Refresh button is the only other trigger, no polling.
    useLayoutEffect(() => {
        onFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFetch = async () => {
        try {
            await dispatch(monitoringOverviewGet()).unwrap();
        } catch (err) {
            console.error("Get Monitoring Overview Err =-=> ", err);
        }
    };

    if (!hasLoaded && isLoading) {
        return <Loader height={400} />;
    }

    if (hasLoaded && !overview) {
        return (
            <div className="bg-white rounded-[25px] p-10 flex flex-col items-center justify-center gap-4">
                <div className="text-sm text-error font-semibold">
                    {error || "Failed to load monitoring data"}
                </div>
                <Button text="Retry" onClick={onFetch} loading={isLoading} />
            </div>
        );
    }

    const allServices = overview?.servers.flatMap((s) => s.services) || [];

    return (
        <div className="space-y-5">
            <SummaryBar overview={overview} isLoading={isLoading} onRefresh={onFetch} />

            <div className={`space-y-5 transition-opacity ${isLoading ? "opacity-60" : ""}`}>
                {overview?.servers.map((server) => (
                    <ServerGroup key={`${server.hostname}-${server.ip}`} server={server} onSelect={setSelected} />
                ))}

                <DependencyMatrix services={allServices} />
            </div>

            <DetailDrawer result={selected} onClose={() => setSelected(null)} />
        </div>
    );
};

export default Monitoring;
