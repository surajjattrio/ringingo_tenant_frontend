"use client";
import React, { useState, useEffect } from "react";
import { FaSyncAlt, FaChevronRight, FaCog, FaPlus, FaChartPie, FaFolder, FaPlug } from "react-icons/fa";
import AnalyticsStats from "./AnalyticsStats";
import ActivityLogs from "./ActivityLogs";
import ConnectAccountModal from "./ConnectAccountModal";
import ConfigurationDrawer from "./ConfigurationDrawer";
import { Danger, Success } from "@/redux/services/toasterServices";
import { googleDriveService } from "@/services/googleDriveService";
import { useAuth } from "@/contexts/hooks/useAuth";
import FolderSelectorModal from "./FolderSelectorModal";

// Fix for React Node type issue
const SyncIcon = FaSyncAlt as any;
const ChevronRightIcon = FaChevronRight as any;
const CogIcon = FaCog as any;
const PlusIcon = FaPlus as any;
const ChartPieIcon = FaChartPie as any;
const FolderIcon = FaFolder as any;
const PlugIcon = FaPlug as any;

const GoogleDriveDashboard = () => {
    const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [testing, setTesting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showFolderSelector, setShowFolderSelector] = useState(false);
    const [oauthState, setOauthState] = useState<string>(""); const { user } = useAuth();

    const tabs = [
        { id: "overview", label: "Overview", icon: ChartPieIcon },
        { id: "logs", label: "Activity Logs", icon: FolderIcon },
    ];

    useEffect(() => {
        checkConnection();
    }, []);


    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("Dashboard received message:", event.data);

            if (event.data.type === 'OAUTH_CALLBACK' && event.data.state) {
                console.log("✅ Showing folder selector");
                setIsConnectModalOpen(false); // Close the connect modal immediately
                setOauthState(event.data.state);
                setShowFolderSelector(true);
            }
            else if (event.data.type === 'OAUTH_ERROR') {
                console.error("❌ OAuth error:", event.data.error);
                Danger(event.data.message || `Authorization failed: ${event.data.error}`);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);


    const handleToggle = async (checked: boolean) => {
        try {
            const res = await googleDriveService.toggleIntegration(checked, user?.tenant_detail?.uuid);
            if (res.success) {
                setIsEnabled(checked);
            }
        } catch (error) {
            console.error("Failed to toggle integration", error);
        }
    };

    const checkConnection = async () => {
        try {
            const res = await googleDriveService.getSettings(user?.tenant_detail?.uuid);
            if (res.success && res.data) {
                setIsConnected(true);
                setIsEnabled(res.data.enabled ?? true);
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectSuccess = async (state?: string) => {
        if (state) {
            setOauthState(state);
            setShowFolderSelector(true);
        } else {
            try {
                const statusRes = await googleDriveService.checkOAuthStatus(user.tenant_detail.uuid);

                const statusData = statusRes.data || statusRes;

                if (statusData.status === 'awaiting_folder_selection' && statusData.state) {
                    console.log("📂 Status shows awaiting folder selection");
                    console.log("  State:", statusData.state.substring(0, 30) + "...");
                    setOauthState(statusData.state);
                    setShowFolderSelector(true);
                } else if (statusData.connected) {
                    console.log("✅ Already connected");
                    Success("Google Drive connected successfully!");
                    checkConnection();
                } else {
                    console.log("⚠️ Unexpected status:", statusData.status);
                }
            } catch (error) {
                console.error("❌ Failed to check status:", error);
            }
        }

        console.log("=== handleConnectSuccess END ===");
    };

    const handleTestConnection = async () => {
        try {
            setTesting(true);
            const res = await googleDriveService.testConnection(user?.tenant_detail?.uuid);
            if (res.success) {
                Success("Connection verified successfully!");
            } else {
                Danger("Connection failed. Please check your credentials.");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Connection verification failed.";
            Danger(errorMessage);
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="space-y-5 bg-white p-6 rounded-[25px]">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <span>Settings</span>
                                <ChevronRightIcon size={12} />
                                <span>Integrations</span>
                                <ChevronRightIcon size={12} />
                                <span className="text-blue-600 font-medium">Google Drive</span>
                            </div> */}
                    <div className="flex items-center gap-3">
                        {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Drive Configuration
                                </h1> */}
                        {!loading && isConnected && (
                            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1">
                                <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {isEnabled ? 'Active & Syncing' : 'Paused'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer ml-1">
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={(e) => handleToggle(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!loading && (
                        isConnected ? (
                            <>
                                <button
                                    onClick={handleTestConnection}
                                    disabled={testing || loading}
                                    className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    {testing ? (
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700 dark:border-gray-300" />
                                    ) : (
                                        <PlugIcon size={14} />
                                    )}
                                    Test Connection
                                </button>
                                <button
                                    onClick={() => setIsConfigDrawerOpen(true)}
                                    className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    <CogIcon size={14} /> Configure
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsConnectModalOpen(true)}
                                className="px-3 py-1.5 bg-blue-600 text-white border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <PlusIcon size={14} /> Connect Account
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            {isConnected && (
                <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                        relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                                        ${activeTab === tab.id
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                                }
                                    `}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? "text-blue-500" : ""} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}


            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Loading Google Drive settings...</p>
                </div>
            ) : !isConnected ? (
                <AnalyticsStats isConnected={false} onConnect={() => setIsConnectModalOpen(true)} />
            ) : (
                <>
                    {activeTab === "overview" && (
                        <AnalyticsStats
                            isConnected={true}
                            onConnect={() => setIsConnectModalOpen(true)}
                            refreshTrigger={refreshTrigger}
                        />
                    )}
                    {activeTab === "logs" && (
                        <ActivityLogs refreshTrigger={refreshTrigger} />
                    )}
                </>
            )}


            {/* Modals & Drawers */}
            <ConnectAccountModal
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
                onSuccess={handleConnectSuccess}
            />

            <ConfigurationDrawer
                isOpen={isConfigDrawerOpen}
                onClose={() => setIsConfigDrawerOpen(false)}
                onDisconnect={() => {
                    checkConnection(); // Refresh state
                    setIsConnected(false);
                }}
            />
            {/*  Folder Selector Modal */}
            <FolderSelectorModal
                isOpen={showFolderSelector}
                state={oauthState}
                onClose={() => {
                    setShowFolderSelector(false);
                    setOauthState("");
                }}
                onComplete={(result) => {
                    setShowFolderSelector(false);
                    setOauthState("");
                    Success("Google Drive connected successfully!");
                    checkConnection(); // Refresh connection status
                    setRefreshTrigger(prev => prev + 1);
                }}
            />
        </div>
    );
};

export default GoogleDriveDashboard;
