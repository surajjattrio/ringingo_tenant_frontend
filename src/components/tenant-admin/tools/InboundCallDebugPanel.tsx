"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchInboundCallDebugSnapshot,
  selectInboundCallDebugError,
  selectInboundCallDebugLoading,
  selectInboundCallDebugSnapshot,
  fetchInboundCallDebugFormOptions,
  selectInboundCallDebugFormOptions,
} from "@/redux/slice/tenant-admin/inboundCallDebugSlice";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      type="button"
      className="ml-2 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-xs flex items-center gap-1 transition-colors shrink-0"
      title="Copy verification command"
    >
      {copied ? (
        <span className="text-green-600 font-medium">Copied!</span>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
};

const InboundCallDebugPanel = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector( selectInboundCallDebugLoading );
  const error = useAppSelector( selectInboundCallDebugError );
  const snapshot = useAppSelector( selectInboundCallDebugSnapshot );
  const formOptions = useAppSelector( selectInboundCallDebugFormOptions );

  const [campaignUuid, setCampaignUuid] = useState( "" );
  const [extension, setExtension] = useState( "" );
  const [userUuid, setUserUuid] = useState( "" );
  const [callQueueUuid, setCallQueueUuid] = useState( "" );
  const [autoRefresh, setAutoRefresh] = useState( false );
  const [showRaw, setShowRaw] = useState( false );

  useEffect( () => {
    dispatch( fetchInboundCallDebugFormOptions() );
  }, [ dispatch ] );

  useEffect( () => {
    if ( campaignUuid ) {
      dispatch( fetchInboundCallDebugFormOptions( { campaign_uuid: campaignUuid } ) );
    } else {
      dispatch( fetchInboundCallDebugFormOptions() );
    }
    setCallQueueUuid( "" );
  }, [ campaignUuid, dispatch ] );

  const runFetch = useCallback( () => {
    if ( !campaignUuid ) {
      return;
    }
    if ( !extension.trim() && !userUuid.trim() ) {
      return;
    }
    dispatch(
      fetchInboundCallDebugSnapshot( {
        campaign_uuid: campaignUuid,
        extension: extension.trim() || undefined,
        user_uuid: userUuid.trim() || undefined,
        call_queue_uuid: callQueueUuid || undefined,
      } )
    );
  }, [ campaignUuid, extension, userUuid, callQueueUuid, dispatch ] );

  useEffect( () => {
    if ( !autoRefresh ) {
      return;
    }
    const id = setInterval( () => {
      runFetch();
    }, 5000 );
    return () => clearInterval( id );
  }, [ autoRefresh, runFetch ] );

  const overallColor = useMemo( () => {
    const o = snapshot?.overall;
    if ( o === "healthy" ) {
      return "text-green-700 bg-green-50 border-green-200";
    }
    if ( o === "degraded" ) {
      return "text-amber-800 bg-amber-50 border-amber-200";
    }
    if ( o === "broken" ) {
      return "text-red-700 bg-red-50 border-red-200";
    }
    return "text-gray-700 bg-gray-50 border-gray-200";
  }, [ snapshot ] );

  const copyBundle = () => {
    if ( !snapshot ) {
      return;
    }
    const text = JSON.stringify( snapshot, null, 2 );
    const blob = new Blob( [ text ], { type: "application/json" } );
    const url = URL.createObjectURL( blob );
    const a = document.createElement( "a" );
    a.href = url;
    a.download = `inbound-call-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL( url );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Inbound call debug</h1>
        <p className="text-sm text-gray-600 mt-1">
          Compare Mongo assignment, FreeSWITCH mod_callcenter state, SIP registration, and CALL_CENTER.xml for one agent and campaign.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Inbound campaign</span>
            <select
              className="border rounded-lg px-3 py-2 text-gray-900"
              value={campaignUuid}
              onChange={( e ) => setCampaignUuid( e.target.value )}
            >
              <option value="">Select campaign</option>
              {formOptions?.campaigns?.map( ( o: any ) => (
                <option key={o.uuid} value={o.uuid}>
                  {o.name}
                </option>
              ) )}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Extension (username)</span>
            <select
              className="border rounded-lg px-3 py-2 text-gray-900"
              value={extension}
              onChange={( e ) => setExtension( e.target.value )}
            >
              <option value="">Select extension</option>
              {formOptions?.extensions?.map( ( ext: any ) => (
                <option key={ext.uuid} value={ext.username}>
                  {ext.username}
                </option>
              ) )}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">User UUID (optional, instead of extension)</span>
            <select
              className="border rounded-lg px-3 py-2 text-gray-900"
              value={userUuid}
              onChange={( e ) => setUserUuid( e.target.value )}
            >
              <option value="">Select user</option>
              {formOptions?.users?.map( ( user: any ) => (
                <option key={user.uuid} value={user.uuid}>
                  {user.fullname ? `${user.fullname} (${user.username})` : user.username}
                </option>
              ) )}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Call queue (optional)</span>
            <select
              className="border rounded-lg px-3 py-2 text-gray-900"
              value={callQueueUuid}
              onChange={( e ) => setCallQueueUuid( e.target.value )}
              disabled={!formOptions?.queues?.length}
            >
              <option value="">All queues on campaign</option>
              {formOptions?.queues?.map( ( q: any ) => (
                <option key={q.uuid} value={q.uuid}>
                  {q.name}
                </option>
              ) )}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !campaignUuid || ( !extension.trim() && !userUuid.trim() )}
            onClick={runFetch}
          >
            {loading ? "Loading…" : "Refresh snapshot"}
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={( e ) => setAutoRefresh( e.target.checked )}
            />
            Auto-refresh every 5s
          </label>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            disabled={!snapshot}
            onClick={copyBundle}
          >
            Copy debug bundle (JSON)
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {snapshot && (
        <>
          <div className={`rounded-xl border p-4 ${overallColor}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-semibold uppercase tracking-wide">
                Overall: {snapshot.overall}
              </span>
              <span className="text-xs opacity-80">{snapshot.generatedAt}</span>
            </div>
            <p className="text-sm mt-2">{snapshot.summary}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Health checklist</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-3 pr-4">Check</th>
                    <th className="py-3 pr-4">Result</th>
                    <th className="py-3 pr-4">Detail</th>
                    <th className="py-3">Verification Command (2-Step Manual Verification)</th>
                  </tr>
                </thead>
                <tbody>
                  {( snapshot.checklist || [] ).map( ( row: any ) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-gray-800">{row.label}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            row.pass
                              ? "text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded-full text-xs border border-green-200"
                              : row.severity === "warning"
                                ? "text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-full text-xs border border-amber-200"
                                : "text-red-700 font-semibold bg-red-50 px-2.5 py-1 rounded-full text-xs border border-red-200"
                          }
                        >
                          {row.pass ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600 whitespace-pre-wrap max-w-xs md:max-w-sm lg:max-w-md">{row.detail}</td>
                      <td className="py-3 text-gray-600">
                        {row.verificationCommand ? (
                          <div className="flex items-center gap-2 max-w-md">
                            <pre className="text-xs bg-gray-50 text-gray-800 p-2 rounded-lg border border-gray-200 overflow-x-auto font-mono flex-1 whitespace-pre-wrap break-all">
                              {row.verificationCommand}
                            </pre>
                            <CopyButton text={row.verificationCommand} />
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">N/A</span>
                        )}
                      </td>
                    </tr>
                  ) )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Mongo — queues</h2>
              <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-64 text-gray-800">
                {JSON.stringify( snapshot.mongo?.queues, null, 2 )}
              </pre>
              <h3 className="text-xs font-semibold text-gray-700 mt-3">call_queue_agent</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48 text-gray-800">
                {JSON.stringify( snapshot.mongo?.call_queue_agent, null, 2 )}
              </pre>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Mongo — agent state</h2>
              <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-40 text-gray-800">
                {JSON.stringify(
                  {
                    agent_live_report: snapshot.mongo?.agent_live_report,
                    agent_campaign_login: snapshot.mongo?.agent_campaign_login,
                    extension: snapshot.mongo?.extension,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">FreeSWITCH — excerpts</h2>
            <div className="space-y-3 text-xs">
              <div>
                <h3 className="font-semibold text-gray-700">agent get (raw)</h3>
                <pre className="bg-gray-50 p-3 rounded-lg overflow-auto max-h-40 text-gray-800 whitespace-pre-wrap">
                  {snapshot.freeswitch?.agent_get_raw || ""}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">tier list (filtered excerpt)</h3>
                <pre className="bg-gray-50 p-3 rounded-lg overflow-auto max-h-32 text-gray-800 whitespace-pre-wrap">
                  {snapshot.freeswitch?.tier_list_excerpt || ""}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">queue members (JSON per queue)</h3>
                <pre className="bg-gray-50 p-3 rounded-lg overflow-auto max-h-48 text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify( snapshot.freeswitch?.queue_members_by_queue, null, 2 )}
                </pre>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">CALL_CENTER.xml excerpt</h2>
            <p className="text-xs text-gray-500 mb-1">{snapshot.call_center_xml?.path}</p>
            <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-64 text-gray-800 whitespace-pre-wrap">
              {snapshot.call_center_xml?.excerpt || snapshot.call_center_xml?.error || ""}
            </pre>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:underline"
              onClick={() => setShowRaw( !showRaw )}
            >
              {showRaw ? "Hide" : "Show"} raw JSON
            </button>
            {showRaw && (
              <pre className="text-xs bg-gray-900 text-green-100 p-3 rounded-lg overflow-auto max-h-96 mt-2">
                {JSON.stringify( snapshot, null, 2 )}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InboundCallDebugPanel;
