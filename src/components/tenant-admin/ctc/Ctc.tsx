"use client";
import { useEffect, useState } from "react";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Input, Select } from "@/components/forms";
import Button from "@/components/forms/Button";
import { Icon } from "@/components/ui-components";

// THIRD-PARTY IMPORT
import Cookies from "js-cookie";
import {
  sipNameOptionsGet,
  useSipNameOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
  tenantTrunkOptionsGet,
  useTenantTrunkOptions,
} from "@/redux/slice/tenant-admin/tenantTrunkSlice";
import {
  didOptionsGet,
  useDidOptions,
} from "@/redux/slice/tenant-admin/didSlice";
import {
  ctcHistoryGet,
  ctcPlaceCall,
  useCtcHistory,
} from "@/redux/slice/tenant-admin/ctcSlice";
import {
  createApiKey,
  getApiKey,
  revokeApiKey,
} from "@/redux/services/tenant-admin/apiKeyServices";

// TYPES
type AgentType = "extension" | "trunk";
type CallFirst = "agent" | "customer";

type HistoryRow = {
  ts: string;
  agent: string;
  agentType: AgentType;
  customer: string;
  ok: boolean;
  message: string;
};

const agentTypeTabs: { key: AgentType; label: string }[] = [
  { key: "extension", label: "Extension" },
  { key: "trunk", label: "Trunk" },
];

/* ============================== CTC (CLICK TO CALL) ============================== */

const Ctc = () => {
  const dispatch = useAppDispatch();

  const sipNameOptions = useSipNameOptions();
  const tenantTrunkOptions = useTenantTrunkOptions();
  const didOptions = useDidOptions();
  const callerIdOptions = [{ value: "", label: "Auto / default" }, ...(didOptions || [])];
  const trunkAutoOptions = [{ value: "", label: "Auto (use Outgoing Rules)" }, ...(tenantTrunkOptions || [])];

  const [agentType, setAgentType] = useState<AgentType>("extension");
  const [extensionValue, setExtensionValue] = useState("");
  const [trunkValue, setTrunkValue] = useState("");
  const [trunkNumber, setTrunkNumber] = useState("");
  const [agentCallerId, setAgentCallerId] = useState("");
  const [autoAnswer, setAutoAnswer] = useState(false);

  const [customerNumber, setCustomerNumber] = useState("");
  const [customerTrunkValue, setCustomerTrunkValue] = useState("");
  const [customerCallerId, setCustomerCallerId] = useState("");
  const [callFirst, setCallFirst] = useState<CallFirst>("agent");
  const [timeout, setTimeoutSec] = useState("40");

  const [placing, setPlacing] = useState(false);
  const [showApi, setShowApi] = useState(false);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [historySeeded, setHistorySeeded] = useState(false);
  const dbHistory = useCtcHistory();

  const [apiKey, setApiKey] = useState("");
  const [apiKeyLoading, setApiKeyLoading] = useState(false);

  useEffect(() => {
    dispatch(sipNameOptionsGet());
    dispatch(tenantTrunkOptionsGet());
    dispatch(didOptionsGet());
    dispatch(ctcHistoryGet({ limit: 20 }));
    fetchApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Static, per-tenant key - unlike the session Bearer token it never expires, so an
  // external system can hit /ctc/dial with it (as an "x-api-key" header) indefinitely.
  const fetchApiKey = async () => {
    try {
      const res: any = await getApiKey();
      if (res?.statusCode === 200 && res?.data?.api_key) {
        setApiKey(res.data.api_key);
      }
    } catch {
      // no key generated yet - leave blank
    }
  };

  const onGenerateApiKey = async () => {
    setApiKeyLoading(true);
    try {
      const res: any = await createApiKey();
      if (res?.data?.api_key) {
        setApiKey(res.data.api_key);
        Success("API key generated");
      } else {
        Danger(res?.message || "Could not generate API key");
      }
    } catch (e: any) {
      Danger(e?.response?.data?.message || "Could not generate API key");
    } finally {
      setApiKeyLoading(false);
    }
  };

  const onRevokeApiKey = async () => {
    setApiKeyLoading(true);
    try {
      const res: any = await revokeApiKey();
      if (res?.statusCode === 200) {
        setApiKey("");
        Success("API key revoked");
      } else {
        Danger(res?.message || "Could not revoke API key");
      }
    } catch (e: any) {
      Danger(e?.response?.data?.message || "Could not revoke API key");
    } finally {
      setApiKeyLoading(false);
    }
  };

  // Seed the list once with past attempts fetched from the backend; calls placed
  // in this session are then prepended on top via setHistory in onPlaceCall.
  useEffect(() => {
    if (historySeeded || !dbHistory?.length) return;
    setHistory(
      dbHistory.map((row: any) => ({
        ts: row?.createdAt ? new Date(row.createdAt).toLocaleTimeString() : "",
        agent: row?.agent_number,
        agentType: row?.agent_type,
        customer: row?.customer_number,
        ok: !!row?.ok,
        message: row?.message,
      }))
    );
    setHistorySeeded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbHistory]);

  const agentNumber = agentType === "extension" ? extensionValue : trunkNumber;
  const agentLabel =
    agentType === "extension"
      ? sipNameOptions?.find((o: any) => o.value === extensionValue)?.label
      : tenantTrunkOptions?.find((o: any) => o.value === trunkValue)?.label;

  const canSubmit =
    !!customerNumber.trim() &&
    (agentType === "extension" ? !!extensionValue : !!trunkValue && !!trunkNumber.trim());

  // Same payload shape POST /ctc/dial and GET /ctc/dial both accept - reused by the
  // "Place Call" button and by the API snippet shown under "Get API".
  const buildPayload = () => {
    const payload: any = {
      agent_number: agentNumber.trim(),
      agent_type: agentType,
      agent_caller_id: agentCallerId || undefined,
      customer_number: customerNumber.trim(),
      customer_type: "mobile",
      customer_trunk: customerTrunkValue || undefined,
      customer_caller_id: customerCallerId || undefined,
      callfirst: callFirst,
      timeout: Number(timeout) || 40,
    };
    if (agentType === "trunk") {
      payload.agent_trunk = trunkValue;
    }
    if (agentType === "extension" && autoAnswer) {
      payload.auto_answer = 1;
    }
    return payload;
  };

  // Place a click-to-call: rings the agent's own SIP device (extension) or the
  // number entered on the selected tenant trunk, then bridges it to the customer.
  // Agent login/registration state is never checked here on purpose.
  const onPlaceCall = async () => {
    if (!canSubmit) {
      Danger("Please fill agent and customer details");
      return;
    }
    setPlacing(true);
    const payload = buildPayload();

    try {
      const res: any = await dispatch(ctcPlaceCall(payload)).unwrap();
      const ok = !!res?.success || res?.statusCode === 200 || res?.statusCode === 201;
      setHistory((prev) => [
        {
          ts: new Date().toLocaleTimeString(),
          agent: agentLabel || agentNumber,
          agentType,
          customer: customerNumber,
          ok,
          message: res?.message || (ok ? "Call placed" : "Call failed"),
        },
        ...prev,
      ]);
      if (ok) {
        Success(res?.message || "Call placed");
      } else {
        Danger(res?.message || "Call failed");
      }
    } catch (e: any) {
      const message =
        e?.response?.data?.message || e?.message || "Unable to place the call";
      setHistory((prev) => [
        {
          ts: new Date().toLocaleTimeString(),
          agent: agentLabel || agentNumber,
          agentType,
          customer: customerNumber,
          ok: false,
          message,
        },
        ...prev,
      ]);
      Danger(message);
    } finally {
      setPlacing(false);
    }
  };

  // Build a ready-to-hit GET URL + curl (POST) snippet for whatever is currently filled in the
  // form, using this tenant's own session token - so hitting either one places the same call.
  const apiBase = (process.env.BASE_URL || "").replace(/\/$/, "");
  let accessToken = "";
  try {
    accessToken = JSON.parse(Cookies.get("user") || "{}")?.access_token || "";
  } catch {
    accessToken = "";
  }
  const apiPayload = buildPayload();
  // api_key as a query param (not just an "x-api-key" header) so this URL works when just
  // pasted into a browser tab - a plain navigation can't attach custom headers.
  const getUrlParams: any = { ...apiPayload };
  if (apiKey) {
    getUrlParams.api_key = apiKey;
  }
  const queryString = Object.entries(getUrlParams)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  const getUrl = `${apiBase}/ctc/dial?${queryString}`;
  // Prefer the static x-api-key once generated - it does not expire like the session token does.
  const authHeaderLine = apiKey
    ? `-H "x-api-key: ${apiKey}" \\`
    : `-H "Authorization: Bearer ${accessToken || "<your tenant access token>"}" \\`;
  const curlSnippet = `curl -X POST ${apiBase}/ctc/dial \\
  ${authHeaderLine}
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(apiPayload, null, 2)}'`;

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      Success("Copied");
    } catch {
      Danger("Copy failed");
    }
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <div className="flex items-center gap-2 mb-5">
        <Icon name="PhoneCall" alt="CTC" width={24} height={24} />
        <div>
          <h1 className="text-lg font-bold text-heading">CTC</h1>
          <p className="text-xs text-dark-400">
            Ring an agent&apos;s SIP device (or dial out on a tenant trunk) and bridge it
            straight to the customer — the agent&apos;s login/registration status is not checked.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 tsm:grid-cols-1 gap-6">
        {/* AGENT LEG */}
        <div className="border border-dark-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-heading">Agent</span>
            <div className="flex border border-dark-800 rounded-full overflow-hidden">
              {agentTypeTabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setAgentType(t.key)}
                  className={`px-3 py-1 text-xs font-bold flex items-center gap-1 ${
                    agentType === t.key
                      ? "bg-primary-primaryPurple text-white"
                      : "bg-white text-dark-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {agentType === "extension" ? (
            <div className="flex flex-col gap-3">
              <Select
                name="extension"
                label="SIP Device / Extension"
                placeholder="Select an extension"
                options={sipNameOptions}
                value={extensionValue}
                onChange={(e: any) => setExtensionValue(e.target.value)}
                isInfo
              />
              <label className="flex items-center gap-2 text-sm text-heading cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAnswer}
                  onChange={(e) => setAutoAnswer(e.target.checked)}
                  className="w-4 h-4 accent-primary-primaryPurple"
                />
                Auto-answer on the agent&apos;s device (no manual click)
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Select
                name="trunk"
                label="Trunk"
                placeholder="Select a trunk"
                options={tenantTrunkOptions}
                value={trunkValue}
                onChange={(e: any) => setTrunkValue(e.target.value)}
                isInfo
              />
              <Input
                name="trunkNumber"
                label="Number to dial on this trunk"
                placeholder="e.g. 919812345678"
                value={trunkNumber}
                onChange={(e: any) => setTrunkNumber(e.target.value)}
                noSpace
              />
            </div>
          )}

          <div className="mt-4">
            <Select
              name="agentCallerId"
              label="Caller ID"
              placeholder="Select a DID"
              options={callerIdOptions}
              value={agentCallerId}
              onChange={(e: any) => setAgentCallerId(e.target.value)}
              isInfo
            />
          </div>
        </div>

        {/* CUSTOMER LEG */}
        <div className="border border-dark-800 rounded-2xl p-4">
          <span className="text-sm font-bold text-heading">Customer</span>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              name="customerNumber"
              label="Customer number"
              placeholder="e.g. 919812345678"
              value={customerNumber}
              onChange={(e: any) => setCustomerNumber(e.target.value)}
              noSpace
            />
            <Select
              name="customerTrunk"
              label="Trunk"
              placeholder="Select a trunk"
              options={trunkAutoOptions}
              value={customerTrunkValue}
              onChange={(e: any) => setCustomerTrunkValue(e.target.value)}
              isInfo
            />
            <Select
              name="customerCallerId"
              label="Caller ID shown to customer"
              placeholder="Select a DID"
              options={callerIdOptions}
              value={customerCallerId}
              onChange={(e: any) => setCustomerCallerId(e.target.value)}
              isInfo
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 tsm:grid-cols-1 gap-6 mt-6">
        <Select
          name="callFirst"
          label="Call first"
          options={[
            { value: "agent", label: "Agent" },
            { value: "customer", label: "Customer" },
          ]}
          value={callFirst}
          onChange={(e: any) => setCallFirst(e.target.value)}
        />
        <Input
          name="timeout"
          type="number"
          label="Ring timeout (seconds)"
          value={timeout}
          onChange={(e: any) => setTimeoutSec(e.target.value)}
          noSpace
        />
      </div>
      <p className="text-[11px] text-dark-400 mt-2">
        Every call is recorded automatically.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button
          text={placing ? "Calling…" : "Place Call"}
          style="primary"
          loading={placing}
          disabled={placing || !canSubmit}
          onClick={onPlaceCall}
        />
        <Button
          text={showApi ? "Hide API" : "Get API"}
          icon="Copy"
          style="primary-outline"
          disabled={!canSubmit}
          onClick={() => setShowApi((v) => !v)}
        />
      </div>

      {showApi && (
        <div className="mt-4 bg-dark-950 rounded-2xl p-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide">
                Static API key (does not expire like your login session)
              </span>
              {apiKey ? (
                <button
                  type="button"
                  className="text-xs font-bold text-error hover:text-white disabled:opacity-50"
                  disabled={apiKeyLoading}
                  onClick={onRevokeApiKey}
                >
                  Revoke
                </button>
              ) : (
                <button
                  type="button"
                  className="text-xs font-bold text-primary-green hover:text-white disabled:opacity-50"
                  disabled={apiKeyLoading}
                  onClick={onGenerateApiKey}
                >
                  Generate
                </button>
              )}
            </div>
            {apiKey ? (
              <div className="flex items-center gap-2">
                <pre className="text-[11px] text-primary-green whitespace-pre-wrap break-all font-mono flex-1">
                  {apiKey}
                </pre>
                <button
                  type="button"
                  className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 shrink-0"
                  onClick={() => copyText(apiKey)}
                >
                  <Icon name="Copy" width={14} height={14} /> Copy
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-white/50">
                No API key generated yet - click Generate to create one. Send it as an{" "}
                <span className="font-mono">x-api-key</span> header instead of Authorization.
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide">
                GET - hit this URL and the call is placed
              </span>
              <button
                type="button"
                className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1"
                onClick={() => copyText(getUrl)}
              >
                <Icon name="Copy" width={14} height={14} /> Copy
              </button>
            </div>
            <pre className="text-[11px] text-primary-green whitespace-pre-wrap break-all font-mono">
              {getUrl}
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide">
                POST (curl)
              </span>
              <button
                type="button"
                className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1"
                onClick={() => copyText(curlSnippet)}
              >
                <Icon name="Copy" width={14} height={14} /> Copy
              </button>
            </div>
            <pre className="text-[11px] text-primary-green whitespace-pre-wrap break-all font-mono">
              {curlSnippet}
            </pre>
          </div>
          <p className="text-[11px] text-white/50">
            {apiKey ? (
              <>The GET URL above already has your static API key baked in as{" "}
              <span className="font-mono">?api_key=...</span> - paste it straight into a browser
              tab and the call fires. The curl example uses the same key as an{" "}
              <span className="font-mono">x-api-key</span> header instead.</>
            ) : (
              <>Generate the static API key above first - without it, the GET URL needs an{" "}
              <span className="font-mono">Authorization</span> header (a plain browser click
              won&apos;t send one), so it only works from curl/Postman/server-side code.</>
            )}
          </p>
        </div>
      )}

      <div className="mt-8">
        <span className="text-sm font-bold text-heading">Recent attempts</span>
        <div className="mt-2 divide-y divide-dark-800">
          {history.length ? (
            history.map((h, idx) => (
              <div key={idx} className="py-2 flex items-center gap-3 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${h.ok ? "bg-primary-green" : "bg-error"}`}
                />
                <span className="font-bold text-heading">{h.agent}</span>
                <span className="text-dark-400">({h.agentType})</span>
                <Icon name="CallOut" width={12} height={12} />
                <span className="font-bold text-heading">{h.customer}</span>
                <span className="ml-auto text-dark-400">{h.message}</span>
                <span className="text-dark-400">{h.ts}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-dark-400 py-3">No click-to-call attempts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ctc;
