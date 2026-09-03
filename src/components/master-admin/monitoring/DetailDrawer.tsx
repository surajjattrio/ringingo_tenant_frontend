import { useState } from "react";
import { TargetHealthResult } from "@/types/master-admin/monitoringTypes";
import { Icon } from "@/components/ui-components";
import StatusPill from "./StatusPill";

interface DetailDrawerProps {
    result: TargetHealthResult | null;
    onClose: () => void;
}

const DetailDrawer = ({ result, onClose }: DetailDrawerProps) => {
    const [showRaw, setShowRaw] = useState(false);
    const visible = !!result;
    const status = result?.reachable ? result?.health?.status || "healthy" : "unreachable";

    return (
        <div
            className={`fixed inset-0 z-50 ${visible ? "" : "pointer-events-none"}`}
            aria-hidden={!visible}
        >
            <div
                className={`absolute inset-0 bg-black/30 transition-opacity ${visible ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />
            <div
                className={`absolute top-0 right-0 h-full w-full max-w-[480px] bg-white shadow-2xl transition-transform duration-200 overflow-y-auto ${visible ? "translate-x-0" : "translate-x-full"}`}
            >
                {result && (
                    <div className="p-6 space-y-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="font-bold text-lg text-heading">{result.displayName}</div>
                                <div className="text-xs text-gray-400">{result.slug}</div>
                            </div>
                            <Icon name="Close" alt="Close" width={16} height={16} onClick={onClose} />
                        </div>

                        <StatusPill status={status} />

                        {!result.reachable ? (
                            <div className="text-sm text-error bg-red-50 rounded-lg px-3 py-2.5">
                                {result.error || "Unreachable"}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <div className="text-gray-400">PID</div>
                                    <div className="font-semibold text-heading">{result.health?.process?.pid ?? "-"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Timestamp</div>
                                    <div className="font-semibold text-heading">
                                        {result.health?.timestamp ? new Date(result.health.timestamp).toLocaleString() : "-"}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                className="text-xs font-semibold text-primary underline"
                                onClick={() => setShowRaw((v) => !v)}
                            >
                                {showRaw ? "Hide raw payload" : "Show raw payload"}
                            </button>
                            {showRaw && (
                                <pre className="mt-2 text-[10px] bg-gray-50 rounded-lg p-3 overflow-x-auto max-h-[400px] overflow-y-auto">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailDrawer;
