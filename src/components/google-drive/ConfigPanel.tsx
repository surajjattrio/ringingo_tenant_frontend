"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaSave, FaPlug, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { googleDriveService } from "@/services/googleDriveService";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";

// Fix for React Node type issue with react-icons v5 and @types/react v18
const GoogleIcon = FaGoogle as any;
const SaveIcon = FaSave as any;
const PlugIcon = FaPlug as any;
const EyeIcon = FaEye as any;
const EyeSlashIcon = FaEyeSlash as any;
const InfoIcon = FaInfoCircle as any;

const Tooltip = ({ text, link }: { text: string; link?: string }) => (
    <div className="group relative inline-block ml-2">
        {link ? (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 hover:text-blue-500 transition-colors flex"
                onClick={(e) => e.stopPropagation()} // Prevent bubbling if needed
            >
                <InfoIcon size={14} />
            </a>
        ) : (
            <div className="cursor-help text-gray-400 hover:text-blue-500 transition-colors">
                <InfoIcon size={14} />
            </div>
        )}
        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 text-white text-xs rounded-lg text-center shadow-lg transition-all duration-200 z-50 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
            {text}
            {link && <div className="mt-1 text-blue-300 font-semibold">Click to open link</div>}
        </div>
    </div>
);

const ConfigPanel = () => {
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [settings, setSettings] = useState({
        client_id: "",
        client_secret: "",
        refresh_token: "",
        root_folder_id: "",
        enabled: true,
    });
    const [showSecret, setShowSecret] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await googleDriveService.getSettings(user?.tenant_detail?.uuid);
            if (res.success && res.data) {
                setSettings({
                    client_id: res.data.client_id || "",
                    client_secret: res.data.client_secret || "",
                    refresh_token: res.data.refresh_token || "",
                    root_folder_id: res.data.root_folder_id || "",
                    enabled: res.data.enabled ?? true,
                });
                setConnectionStatus("connected");
            }
        } catch (error: any) {
            if (error.response?.status !== 404) {
                console.error(error);
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch settings";
                Danger(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        // Placeholder for OAuth flow
        Danger("Google OAuth flow is not yet configured.");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await googleDriveService.createSettings(settings);
            if (res.success) {
                Success("Settings saved successfully!");
                setConnectionStatus("connected");
            }
        } catch (error: any) {
            if (error.response?.status === 409) {
                // Already exists, try update
                try {
                    const updateRes = await googleDriveService.updateSettings(settings); // PUT
                    if (updateRes.success) {
                        Success("Settings updated successfully!");
                    }
                } catch (updateErr: any) {
                    const updateErrorMessage = updateErr.response?.data?.message || updateErr.message || "Failed to update settings";
                    Danger(updateErrorMessage);
                }
            } else {
                const errorMessage = error.response?.data?.message || error.message || "Failed to save settings";
                Danger(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTestConnection = async () => {
        try {
            setTesting(true);
            const res = await googleDriveService.testConnection(user?.tenant_detail?.uuid);
            if (res.success) {
                Success("Connection successful!");
                setConnectionStatus("connected");
            } else {
                setConnectionStatus("error");
                Danger("Connection failed");
            }
        } catch (error: any) {
            setConnectionStatus("error");
            const errorMessage = error.response?.data?.message || error.message || "Connection test failed";
            Danger(errorMessage);
        } finally {
            setTesting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <GoogleIcon className="text-3xl" />
                    <div>
                        <h2 className="text-xl font-bold">Configuration</h2>
                        <p className="text-blue-100 text-sm">Manage your Drive credentials</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : connectionStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium">
                        {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'error' ? 'Connection Error' : 'Not Connected'}
                    </span>
                </div>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">Enable Integration</h3>
                            <p className="text-sm text-gray-500">Allow automatic uploads to Google Drive</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="enabled" checked={settings.enabled} onChange={handleChange} className="sr-only peer" />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex flex-col items-center gap-6 mb-8">
                        <button
                            type="button"
                            onClick={handleGoogleAuth}
                            className="bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-medium rounded-xl px-8 py-3 flex items-center gap-3 shadow-sm w-full md:w-auto justify-center group"
                        >
                            <div className="bg-white p-1 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                                <GoogleIcon className="text-xl text-red-500" />
                            </div>
                            <span className="text-base">Sign in with Google</span>
                        </button>

                        <div className="flex items-center w-full gap-4">
                            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or manually enter credentials</span>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    Client ID
                                    <Tooltip
                                        text="Find this in Google Cloud Console > APIs & Services > Credentials"
                                        link="https://console.cloud.google.com/apis/credentials"
                                    />
                                </label>
                                <input
                                    type="text"
                                    name="client_id"
                                    value={settings.client_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white transition-all"
                                    placeholder="Enter Client ID"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    Root Folder ID
                                    <Tooltip
                                        text="The ID from the Google Drive folder URL (e.g., 1yX...)"
                                        link="https://drive.google.com/"
                                    />
                                </label>
                                <input
                                    type="text"
                                    name="root_folder_id"
                                    value={settings.root_folder_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white transition-all"
                                    placeholder="Folder ID where files will be saved"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    Client Secret
                                    <Tooltip
                                        text="Find this in Google Cloud Console > APIs & Services > Credentials"
                                        link="https://console.cloud.google.com/apis/credentials"
                                    />
                                </label>
                                <div className="relative">
                                    <input
                                        type={showSecret ? "text" : "password"}
                                        name="client_secret"
                                        value={settings.client_secret}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white transition-all pr-12"
                                        placeholder="Enter Client Secret"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showSecret ? <EyeSlashIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    Refresh Token
                                    <Tooltip
                                        text="Generated via OAuth 2.0 Playground or authorization flow"
                                        link="https://developers.google.com/oauthplayground"
                                    />
                                </label>
                                <div className="relative">
                                    <input
                                        type={showToken ? "text" : "password"}
                                        name="refresh_token"
                                        value={settings.refresh_token}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white transition-all pr-12"
                                        placeholder="Enter Refresh Token"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowToken(!showToken)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showToken ? <EyeSlashIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                        {/* Delete button hidden for now as per logic comments */}
                        <button
                            type="button"
                            onClick={handleTestConnection}
                            disabled={testing || loading}
                            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                            {testing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div> : <PlugIcon />}
                            Test Saved Connection
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 transform active:scale-95"
                        >
                            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <SaveIcon />}
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ConfigPanel;
