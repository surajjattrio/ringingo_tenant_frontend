
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { IoCloseOutline, IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { convertUtcToIst } from '@/helperFunctions';

// Cast icons to fix react-icons v5 type incompatibility with React 18 types
const CloseIcon = IoCloseOutline as React.ElementType;
const CopyIcon = IoCopyOutline as React.ElementType;
const CheckIcon = IoCheckmarkOutline as React.ElementType;


const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface ActivityDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ isOpen, onClose, data }) => {
    const [isCopiedId, setIsCopiedId] = useState(false);
    const [isCopiedData, setIsCopiedData] = useState(false);
    const [activeTab, setActiveTab] = useState<'payload' | 'response'>('payload');

    if (!isOpen || !data) return null;

    const handleCopyId = () => {
        navigator.clipboard.writeText(data.uuid);
        setIsCopiedId(true);
        setTimeout(() => setIsCopiedId(false), 2000);
    };

    const handleCopyData = () => {
        const content = activeTab === 'payload' ? data.payload : data.response;
        navigator.clipboard.writeText(JSON.stringify(content, null, 2));
        setIsCopiedData(true);
        setTimeout(() => setIsCopiedData(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-[25px] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden relative flex flex-col">
                {/* Header */}
                <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Activity Log</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <CloseIcon size={24} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-2 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24">Log ID</span>
                            <span className="text-gray-700 font-mono text-xs">{data.uuid}</span>
                            <button onClick={handleCopyId} className="p-1 hover:bg-gray-100 rounded transition-colors">
                                {isCopiedId ? <CheckIcon className="text-green-500" size={14} /> : <CopyIcon size={14} />}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24">Action</span>
                            <span className="text-gray-800 font-bold text-xs uppercase">{data.action} <span className="text-gray-400 font-normal">({data.method})</span></span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24 mt-0.5">Hit URL</span>
                            <span className="text-blue-600 font-medium text-xs break-all">{data.url}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24">Executed</span>
                            <span className="text-gray-700 text-xs">{convertUtcToIst(data.createdAt?.replace('Z', ''))}</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 pt-2 flex-1 overflow-y-auto">
                    <div className="bg-gray-50 rounded-[20px] border border-gray-100 p-4 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 flex-shrink-0">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('payload')}
                                    className={`text - sm font - semibold transition - colors ${activeTab === 'payload' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'} `}
                                >
                                    Payload
                                </button>
                                <button
                                    onClick={() => setActiveTab('response')}
                                    className={`text - sm font - semibold transition - colors ${activeTab === 'response' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'} `}
                                >
                                    Response
                                </button>
                            </div>

                            <div className="flex items-center gap-6">
                                <button onClick={handleCopyData} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                    {isCopiedData ? <CheckIcon className="text-green-500" size={20} /> : <CopyIcon size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto rounded-xl bg-[#1e1e1e] min-h-[300px] p-4 text-gray-300">
                            <ReactJson
                                src={activeTab === 'payload' ? data.payload : data.response}
                                theme="monokai"
                                displayDataTypes={false}
                                name={false}
                                style={{ backgroundColor: 'transparent' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetailModal;
