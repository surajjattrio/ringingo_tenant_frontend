"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash, FaInfoCircle, FaTimes, FaArrowRight } from "react-icons/fa";
import { googleDriveService } from "@/services/googleDriveService";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";

// Type casting for icons
const GoogleIcon = FaGoogle as any;
const EyeIcon = FaEye as any;
const EyeSlashIcon = FaEyeSlash as any;
const InfoIcon = FaInfoCircle as any;
const TimesIcon = FaTimes as any;
const ArrowRightIcon = FaArrowRight as any;

interface ConnectAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (state?: string) => void;
}

const Tooltip = ({ text, link }: { text: string; link?: string }) => (
    <div className="group relative inline-block ml-2">
        {link ? (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 hover:text-blue-500 transition-colors flex"
                onClick={(e) => e.stopPropagation()}
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

const ConnectAccountModal = ({ isOpen, onClose, onSuccess }: ConnectAccountModalProps) => {
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [settings, setSettings] = useState({
        client_id: "",
        client_secret: "",
        refresh_token: "",
        root_folder_id: "",
        enabled: true,
    });
    const [showSecret, setShowSecret] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const { user } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
        setIsVerified(false); // Reset verification on change
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Step 1: Save Settings
            let saveSuccess = false;
            try {
                const res = await googleDriveService.createSettings({ ...settings, tenant_uuid: user.tenant_detail.uuid });
                if (res.data.success) saveSuccess = true;
            } catch (error: any) {
                if (error.response?.status === 409) {
                    // Try update
                    try {
                        const updateRes = await googleDriveService.updateSettings({ ...settings, tenant_uuid: user.tenant_detail.uuid });
                        if (updateRes.data.success) saveSuccess = true;
                    } catch (uErr: any) {
                        const uMsg = uErr.response?.data?.message || uErr.message || "Failed to update";
                        Danger(uMsg);
                    }
                } else {
                    const msg = error.response?.data?.message || error.message || "Failed to save";
                    Danger(msg);
                }
            }

            if (saveSuccess) {
                Success("Configuration saved successfully.");
                onSuccess();
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const popupRef = React.useRef<Window | null>(null);

    // Cleanup polling and popup on unmount or close
    React.useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            // Force close popup if it's still open
            try {
                if (popupRef.current && !popupRef.current.closed) {
                    console.log("🧹 Cleaning up: Closing OAuth popup");
                    popupRef.current.close();
                }
            } catch (e) {
                // Ignore cross-origin errors if any
            }
        };
    }, []);

    const handleOAuthConnect = async () => {
        try {
            setLoading(true);

            // Step 1: Initiate OAuth
            console.log("🚀 Step 1: Initiating OAuth...");
            const res = await googleDriveService.initiateOAuth(user.tenant_detail.uuid);

            console.log("✅ OAuth initiate response:", res);

            // Get authorization URL
            const authUrl = res.data?.authorization_url
            // || res.authorization_url;

            if (!authUrl) {
                throw new Error("No authorization URL received");
            }

            console.log("🔗 Opening OAuth URL:", authUrl);

            // Step 2: Open OAuth URL in popup
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            const popup = window.open(
                authUrl,
                'Google Drive Authorization',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // Store ref for cleanup
            popupRef.current = popup;

            if (!popup) {
                setLoading(false);
                Danger("Popup was blocked. Please allow popups for this site.");
                return;
            }

            console.log("✅ Popup opened successfully");

            // ⭐ Poll for OAuth completion
            let pollCount = 0;
            const maxPolls = 60; // 2 minutes (60 * 2 seconds)

            const checkStatus = async () => {
                pollCount++;
                console.log(`📊 Polling status... (${pollCount}/${maxPolls})`);

                if (pollCount >= maxPolls) {
                    console.log("⏱️ Max polls reached, stopping...");
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setLoading(false);
                    Danger("Authorization timeout. Please try again.");
                    return;
                }

                try {
                    const statusRes = await googleDriveService.checkOAuthStatus(user.tenant_detail.uuid);
                    console.log("📡 Full status response:", JSON.stringify(statusRes, null, 2));

                    // ⭐ Check the actual response structure
                    const statusData = statusRes.data || statusRes;
                    console.log("📦 Status data:", statusData);
                    console.log("  - connected:", statusData.connected);
                    console.log("  - status:", statusData.status);
                    console.log("  - state:", statusData.state?.substring(0, 30) + "...");

                    // Check if OAuth is awaiting folder selection
                    if (statusData.status === 'awaiting_folder_selection') {
                        console.log("✅ OAuth completed! Opening folder selector...");
                        console.log("  State to pass:", statusData.state);

                        // Cleanup
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);

                        // Close popup if still open
                        try {
                            if (popup) {
                                console.log("🚪 Closing popup...");
                                popup.close();
                            }
                        } catch (e) {
                            console.log("⚠️ Could not close popup:", e);
                        }

                        console.log("🎯 Calling onSuccess with state:", statusData.state);
                        setLoading(false);
                        onClose(); // Close connect modal

                        // Trigger success with state
                        onSuccess(statusData.state);

                        return;
                    }

                    // Check if already completed
                    if (statusData.connected === true) {
                        console.log("✅ Already connected!");

                        if (intervalRef.current) clearInterval(intervalRef.current);
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);

                        try {
                            if (popup) popup.close();
                        } catch (e) { }

                        setLoading(false);
                        onClose();
                        Success("Google Drive connected successfully!");

                        return;
                    }

                    console.log("⏳ Status not ready yet, will continue polling...");

                } catch (err: any) {
                    console.error("⚠️ Status check failed:", err);
                    console.error("  Error message:", err.message);
                    console.error("  Error response:", err.response?.data);
                    // Continue polling
                }
            };

            // Start polling immediately
            console.log("🔄 Starting status polling...");
            checkStatus();
            intervalRef.current = setInterval(checkStatus, 2000);

            // ⭐ Timeout after 5 minutes
            timeoutRef.current = setTimeout(() => {
                console.log("⏱️ Timeout reached after 5 minutes");
                if (intervalRef.current) clearInterval(intervalRef.current);
                setLoading(false);
                Danger("Authorization timeout. Please try again.");
            }, 5 * 60 * 1000);

        } catch (error: any) {
            setLoading(false);
            console.error("❌ OAuth initiation error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to initiate OAuth";
            Danger(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                >
                    <TimesIcon />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-lg">
                        <GoogleIcon className="text-3xl text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Connect Google Drive</h2>
                    <p className="text-blue-100 mt-2 text-sm max-w-sm mx-auto">
                        Sync your recordings securely. Choose a method below to get started.
                    </p>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto" style={{ maxHeight: "calc(85vh - 200px)" }}>
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                                <GoogleIcon className="text-blue-600" size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Recommended: One-Click OAuth</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Connect securely with Google and select your upload folder
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleOAuthConnect}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2"
                        >
                            <GoogleIcon size={18} />
                            Connect with Google OAuth
                        </button>
                    </div>
                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white dark:bg-gray-800 text-gray-500">Or use manual configuration</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="  text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                Client ID
                                <Tooltip text="Google Cloud Console > Credentials" link="https://console.cloud.google.com/apis/credentials" />
                            </label>
                            <input
                                name="client_id"
                                value={settings.client_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white"
                                placeholder="OAuth Client ID"
                                required
                            />
                        </div>

                        <div>
                            <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                Client Secret
                                <Tooltip text="Google Cloud Console > Credentials" link="https://console.cloud.google.com/apis/credentials" />
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecret ? "text" : "password"}
                                    name="client_secret"
                                    value={settings.client_secret}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white pr-10"
                                    placeholder="OAuth Client Secret"
                                    required
                                />
                                <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showSecret ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    Refresh Token
                                    <Tooltip text="OAuth Playground" link="https://developers.google.com/oauthplayground" />
                                </label>
                                <div className="relative">
                                    <input
                                        type={showToken ? "text" : "password"}
                                        name="refresh_token"
                                        value={settings.refresh_token}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white pr-10"
                                        placeholder="Token"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showToken ? <EyeSlashIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1  items-center">
                                    Root Folder ID
                                    <Tooltip text="Drive Folder URL ID" link="https://drive.google.com" />
                                </label>
                                <input
                                    name="root_folder_id"
                                    value={settings.root_folder_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white"
                                    placeholder="Folder ID"
                                    required
                                />
                            </div>
                        </div>

                        {/* Success Message */}
                        {isVerified && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-lg flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Credentials Verified! You can now save.
                            </div>
                        )}

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                {loading ? "Saving..." : <> Save Configuration <ArrowRightIcon size={14} /> </>}
                            </button>
                        </div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ConnectAccountModal;
