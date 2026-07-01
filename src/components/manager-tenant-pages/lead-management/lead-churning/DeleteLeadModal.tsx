"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { apiInstance } from "@/redux/axiosApi";
import { Danger, Success } from "@/redux/services/toasterServices";
import { DELETE_ALL_LEADS } from "@/API/constAPI";
import { type LeadGroup } from "./types";

interface Props {
    lg: LeadGroup;
    campaignName: string;
    tenantUuid: string;
    onClose: () => void;
    onDeleted: () => void;
}

export const DeleteLeadModal = ({ lg, campaignName, tenantUuid, onClose, onDeleted }: Props) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await apiInstance.delete(`${DELETE_ALL_LEADS}/${lg.lead_group_uuid}`, {
                params: { tenant_uuid: tenantUuid },
            });
            Success("All leads deleted successfully");
            onDeleted();
        } catch (err: any) {
            Danger(err?.response?.data?.message || "Failed to delete leads");
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            >
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">Delete All Leads</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Permanently delete all{" "}
                    <span className="font-semibold text-gray-800">{lg.total_leads}</span> leads from{" "}
                    <span className="font-semibold text-gray-800">{lg.lead_group_name}</span>{" "}
                    in campaign{" "}
                    <span className="font-semibold text-gray-800">{campaignName}</span>?
                </p>
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-600 mb-6 flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">⚠</span>
                    This action cannot be undone. All lead data will be permanently removed.
                </div>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
                    >
                        {deleting
                            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                        }
                        Delete All
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
