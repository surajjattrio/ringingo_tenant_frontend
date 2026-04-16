"use client";
import React, {
    useEffect,
    useState,

} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSave, FaTrash, FaEye, FaEyeSlash, FaInfoCircle, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { googleDriveService } from "@/services/googleDriveService";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { DeleteModal } from "@/components/modals";

// Icons
const TimesIcon = FaTimes as any;
const SaveIcon = FaSave as any;
const TrashIcon = FaTrash as any;
const InfoIcon = FaInfoCircle as any;

interface ConfigurationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onDisconnect: () => void;
}

const ConfigurationDrawer = ({ isOpen, onClose, onDisconnect }: ConfigurationDrawerProps) => {
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [settings, setSettings] = useState({
        client_id: "",
        client_secret: "",
        refresh_token: "",
        root_folder_id: "",
        redirect_uri: "",
        enabled: true,
    });
    const { user } = useAuth();

    // Fetch settings on open

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await googleDriveService.getSettings(user?.tenant_detail?.uuid);
            if (res.success && res.data) {
                setSettings({
                    client_id: res.data.client_id || "",
                    client_secret: res.data.client_secret || "",
                    refresh_token: res.data.refresh_token || "",
                    root_folder_id: res.data.root_folder_id || "",
                    redirect_uri: res.data.redirect_uri || "",
                    enabled: res.data.enabled ?? true,
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await googleDriveService.updateSettings({ ...settings, tenant_uuid: user?.tenant_detail?.uuid });
            if (res.success) {
                Success("Configuration updated successfully");
                onClose();
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to update configuration";
            Danger(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await googleDriveService.deleteSettings(user?.tenant_detail?.uuid);
            Success("Account disconnected");
            onDisconnect();
            onClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to disconnect";
            Danger(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configuration</h2>
                                <p className="text-sm text-gray-500">Edit your integration settings</p>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <TimesIcon size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">


                            <form id="config-form" onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ">OAuth Credentials</label>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Client ID
                                            </label>
                                            <input
                                                name="client_id"
                                                value={settings.client_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm mb-3 bg-white dark:bg-gray-900"
                                                placeholder="Client ID"
                                            />
                                        </div>
                                        <div className="relative mb-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Client Secret
                                            </label>
                                            <input
                                                type="text"
                                                name="client_secret"
                                                value={settings.client_secret}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-900"
                                                placeholder="Client Secret"
                                            />
                                        </div>
                                        <div className="relative mb-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Refresh Token
                                            </label>
                                            <input
                                                type="text"
                                                name="refresh_token"
                                                value={settings.refresh_token}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-900"
                                                placeholder="Refresh Token"
                                            />
                                        </div>
                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Redirect URI
                                            </label>
                                            <input
                                                name="redirect_uri"
                                                value={settings.redirect_uri}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-900"
                                                placeholder="Redirect URI (Optional)"
                                            />
                                        </div> */}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Storage Config</label>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Root Folder ID
                                        </label>
                                        <input
                                            name="root_folder_id"
                                            value={settings.root_folder_id}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-900"
                                            placeholder="Root Folder ID"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/50">
                            <button
                                type="submit"
                                form="config-form"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                {loading ? "Saving..." : <><SaveIcon /> Save Configuration</>}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                type="button"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <TrashIcon /> Delete Account
                            </button>
                        </div>
                    </motion.div>
                </>
            )}

            <DeleteModal
                loading={loading}
                visible={showDeleteModal}
                onCancelClick={() => setShowDeleteModal(false)}
                onDoneClick={() => {
                    setShowDeleteModal(false);
                    handleDelete();
                }}
            />
        </AnimatePresence>
    );
};

export default ConfigurationDrawer;
