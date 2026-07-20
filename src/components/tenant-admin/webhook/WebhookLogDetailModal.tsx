import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IoCloseOutline, IoCopyOutline, IoCheckmarkOutline, IoTerminalOutline, IoAlertCircleOutline } from "react-icons/io5";
import { convertUtcToIst } from "@/helperFunctions";

// Cast icons to fix react-icons v5 type incompatibility with React 18 types
const CloseIcon = IoCloseOutline as React.ElementType;
const CopyIcon = IoCopyOutline as React.ElementType;
const CheckIcon = IoCheckmarkOutline as React.ElementType;
const TerminalIcon = IoTerminalOutline as React.ElementType;
const AlertIcon = IoAlertCircleOutline as React.ElementType;

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface WebhookLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const WebhookLogDetailModal: React.FC<WebhookLogDetailModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isCopiedData, setIsCopiedData] = useState(false);
  const [curlCopyStatus, setCurlCopyStatus] = useState<"copied" | "failed" | null>(null);
  const [activeTab, setActiveTab] = useState<"payload" | "response">("payload");

  if (!isOpen || !data) return null;

  const isFailed = data.status === "failed";

  const handleCopyData = () => {
    const content = activeTab === "payload" ? data.payload : data.responseData;
    navigator.clipboard.writeText(JSON.stringify(content ?? null, null, 2));
    setIsCopiedData(true);
    setTimeout(() => setIsCopiedData(false), 2000);
  };

  const handleCopyCurl = () => {
    if (!data.curlCommand) return;
    navigator.clipboard
      .writeText(data.curlCommand)
      .then(() => setCurlCopyStatus("copied"))
      .catch(() => setCurlCopyStatus("failed"))
      .finally(() => {
        setTimeout(() => setCurlCopyStatus(null), 1800);
      });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-[25px] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Webhook Delivery Log</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseIcon size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-2 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24">
                Webhook
              </span>
              <span className="text-gray-800 font-semibold text-xs">
                {data.webhookName || "-"}
              </span>
              <span className="text-gray-400 text-xs uppercase">
                ({data.webhook_type || "cdr"})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24">
                Status
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isFailed
                    ? "bg-error/10 text-error"
                    : "bg-primary-success/10 text-primary-success"
                }`}
              >
                {isFailed ? "Failed" : "Success"}
              </span>
              <span className="text-gray-700 text-xs">
                {data.statusCode ?? "-"} {data.statusText || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24">
                Attempt
              </span>
              <span className="text-gray-700 text-xs">{data.attempt ?? "-"}</span>
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                Duration
              </span>
              <span className="text-gray-700 text-xs">
                {data.duration != null ? `${data.duration} ms` : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider w-24">
                Timestamp
              </span>
              <span className="text-gray-700 text-xs">
                {data.createdAt
                  ? convertUtcToIst(String(data.createdAt).replace("Z", ""))
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2 flex-1 overflow-y-auto">
          <div className="bg-gray-50 rounded-[20px] border border-gray-100 p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("payload")}
                  className={`text-sm font-semibold transition-colors ${
                    activeTab === "payload"
                      ? "text-gray-800"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Request Payload
                </button>
                <button
                  onClick={() => setActiveTab("response")}
                  className={`text-sm font-semibold transition-colors ${
                    activeTab === "response"
                      ? "text-gray-800"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Response
                </button>
              </div>

              <div className="flex items-center gap-3">
                {data.curlCommand && (
                  <button
                    onClick={handleCopyCurl}
                    title="Copy cURL"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors ${
                      curlCopyStatus === "failed"
                        ? "bg-error hover:bg-error/90"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {curlCopyStatus === "copied" && (
                      <CheckIcon size={14} className="text-green-400" />
                    )}
                    {curlCopyStatus === "failed" && (
                      <AlertIcon size={14} className="text-white" />
                    )}
                    {!curlCopyStatus && <TerminalIcon size={14} />}
                    {curlCopyStatus === "copied"
                      ? "Copied ✓"
                      : curlCopyStatus === "failed"
                        ? "Copy failed"
                        : "Copy cURL"}
                  </button>
                )}
                <button
                  onClick={handleCopyData}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy JSON"
                >
                  {isCopiedData ? (
                    <CheckIcon className="text-green-500" size={20} />
                  ) : (
                    <CopyIcon size={20} />
                  )}
                </button>
              </div>
            </div>

            {activeTab === "response" && isFailed && (
              <div className="mb-4 rounded-lg bg-error/5 border border-error/20 p-3 text-xs text-gray-700 space-y-1 flex-shrink-0">
                <div>
                  <span className="font-semibold text-error">Error: </span>
                  {data.error || "-"}
                </div>
                <div className="flex gap-4">
                  <span>
                    <span className="font-semibold text-gray-500">Code: </span>
                    {data.errorCode || "-"}
                  </span>
                  <span>
                    <span className="font-semibold text-gray-500">Type: </span>
                    {data.errorType || "-"}
                  </span>
                  <span>
                    <span className="font-semibold text-gray-500">Status Text: </span>
                    {data.statusText || "-"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto rounded-xl bg-[#1e1e1e] min-h-[300px] p-4 text-gray-300">
              <ReactJson
                src={
                  (activeTab === "payload" ? data.payload : data.responseData) ?? {}
                }
                theme="monokai"
                displayDataTypes={false}
                name={false}
                collapsed={1}
                style={{ backgroundColor: "transparent" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookLogDetailModal;
