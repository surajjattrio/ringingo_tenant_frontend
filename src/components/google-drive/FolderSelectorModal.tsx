"use client";
import React, { useEffect, useState } from "react";
import { FaTimes, FaFolder, FaSearch, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { googleDriveService } from "@/services/googleDriveService";
import { Danger } from "@/redux/services/toasterServices";

const TimesIcon = FaTimes as any;
const FolderIcon = FaFolder as any;
const SearchIcon = FaSearch as any;
const CheckIcon = FaCheck as any;
const ExternalLinkIcon = FaExternalLinkAlt as any;

interface Folder {
    id: string;
    name: string;
    modifiedTime: string;
    webViewLink?: string;
}

interface FolderSelectorModalProps {
    isOpen: boolean;
    state: string;
    onClose: () => void;
    onComplete: (result: any) => void;
}

const FolderSelectorModal = ({ isOpen, state, onClose, onComplete }: FolderSelectorModalProps) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Define loadFolders FIRST before using it in useEffect
    const loadFolders = async () => {
        try {
            setLoading(true);
            console.log("📡 Loading folders with state:", state?.substring(0, 30) + "...");
            const res = await googleDriveService.listDriveFolders(state);
            console.log("📦 Raw response:", res);
            console.log("  - folders count:", res.folders?.length);

            // The response is the data object directly, not wrapped in success/data
            if (res.folders) {
                const folderList = res.folders || [];
                console.log("✅ Setting folders:", folderList.length, "folders");
                console.log("  First folder:", folderList[0]);
                setFolders(folderList);
            } else {
                console.log("❌ No folders in response");
            }
        } catch (error: any) {
            console.error("❌ Error loading folders:", error);
            Danger(error.response?.data?.message || "Failed to load folders");
        } finally {
            setLoading(false);
        }
    };

    // Load folders when modal opens
    useEffect(() => {
        if (isOpen && state) {
            loadFolders();
        } 
    }, [isOpen, state]);

    if (!isOpen) {
        return null;
    }

    const handleComplete = async () => {
        if (!selectedFolder) {
            Danger("Please select a folder first");
            return;
        }

        try {
            setSaving(true);
            console.log("🚀 Completing setup with folder:", selectedFolder.id);
            const res = await googleDriveService.completeOAuth(state, selectedFolder.id);
            console.log("✅ Complete response:", res);

            // Check for success or just presence of data
            if (res.success || res) {
                onComplete(res.data || res);
            } else {
                // Try to proceed anyway if we have a response
                onComplete(res);
            }
        } catch (error: any) {
            console.error("❌ Error completing setup:", error);
            Danger(error.response?.data?.message || "Failed to complete setup");
        } finally {
            setSaving(false);
        }
    };

    const filteredFolders = folders.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh] my-auto relative animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                        <TimesIcon />
                    </button>
                    <h2 className="text-2xl font-bold">Select Upload Folder</h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Choose which Google Drive folder to use for recordings
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto min-h-0">
                    {/* Search */}
                    <div className="relative mb-4 shrink-0">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search folders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900/50"
                        />
                    </div>

                    {/* Folder List */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                            <p className="text-gray-500 text-sm">Loading folders...</p>
                        </div>
                    ) : (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {filteredFolders.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    {searchTerm ? `No folders found matching "${searchTerm}"` : "No folders found"}
                                </div>
                            ) : (
                                filteredFolders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        onClick={() => setSelectedFolder(folder)}
                                        className={`
                                                p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors
                                                hover:bg-gray-50 dark:hover:bg-gray-700/50
                                                ${selectedFolder?.id === folder.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''}
                                            `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <FolderIcon className="text-gray-400 flex-shrink-0" size={20} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 dark:text-white truncate">
                                                        {folder.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Modified: {new Date(folder.modifiedTime).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            {selectedFolder?.id === folder.id && (
                                                <CheckIcon className="text-blue-600 flex-shrink-0" size={18} />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Selected Preview */}
                    {selectedFolder && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected:</span>
                                    <span className="text-sm text-gray-900 dark:text-white truncate">{selectedFolder.name}</span>
                                </div>
                                {selectedFolder.webViewLink && (
                                    <a
                                        href={selectedFolder.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm flex-shrink-0"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View <ExternalLinkIcon size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                        💡 Recordings will be uploaded to: <strong>{selectedFolder?.name || 'Selected Folder'}</strong> / YYYY-MM-DD / Agent Name / recording.wav
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleComplete}
                        disabled={!selectedFolder || saving}
                        className="flex-[2] px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Connecting..." : "Connect Google Drive"}
                    </button>
                </div>
            </div>
        </div>
    )
};

export default FolderSelectorModal;