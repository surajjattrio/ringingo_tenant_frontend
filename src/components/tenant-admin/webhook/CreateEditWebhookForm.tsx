"use client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import {
  tenantWebhookCreate,
  tenantWebhookSingleGet,
  tenantWebhookUpdate,
} from "@/redux/slice/tenant-admin/tenantWebhookSlice";
import {
  campaignOptionsGet,
  useCampaignOptions,
} from "@/redux/slice/tenant-admin/campaignReportSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import {
  CheckBox,
  Input,
  InputNumber,
  Select,
  Textarea,
} from "@/components/forms";
import Radio from "@/components/forms/Radio";
import { CardForm } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

/* ============================== CREATE & EDIT WEBHOOK FORM ============================== */

const webhookTypeOptions = [
  { value: "cdr", label: "CDR" },
  // { value: "voice_broadcast", label: "Voice Broadcast" },
];

const cdrFieldOptions = [
  {
    label: "CDR fields",
    options: [
      { value: "cdr.uuid", label: "uuid" },
      { value: "cdr.actual_talktime", label: "actual_talktime" },
      { value: "cdr.acw_time", label: "acw_time" },
      { value: "cdr.authentication_type", label: "authentication_type" },
      { value: "cdr.auto_call_flag", label: "auto_call_flag" },
      { value: "cdr.billsecond", label: "billsecond" },
      { value: "cdr.call_count", label: "call_count" },
      { value: "cdr.call_mode", label: "call_mode" },
      { value: "cdr.call_state", label: "call_state" },
      { value: "cdr.call_type", label: "call_type" },
      { value: "cdr.callend", label: "callend" },
      { value: "cdr.caller_id_name", label: "caller_id_name" },
      { value: "cdr.caller_id_number", label: "caller_id_number" },
      { value: "cdr.callstart", label: "callstart" },
      { value: "cdr.campaign_uuid", label: "campaign_uuid" },
      { value: "cdr.circle_uuid", label: "circle_uuid" },
      { value: "cdr.custom_callid", label: "custom_callid" },
      { value: "cdr.destination_number", label: "destination_number" },
      { value: "cdr.dial_method", label: "dial_method" },
      { value: "cdr.direction", label: "direction" },
      { value: "cdr.disconnected_by", label: "disconnected_by" },
      { value: "cdr.disposition", label: "disposition" },
      { value: "cdr.extension_uuid", label: "extension_uuid" },
      { value: "cdr.hangup_cause", label: "hangup_cause" },
      { value: "cdr.hold_time", label: "hold_time" },
      { value: "cdr.ip_map_uuid", label: "ip_map_uuid" },
      { value: "cdr.isSend", label: "isSend" },
      { value: "cdr.is_csat", label: "is_csat" },
      { value: "cdr.ivr_feedback_score", label: "ivr_feedback_score" },
      { value: "cdr.ivr_group", label: "ivr_group" },
      { value: "cdr.lead_uuid", label: "lead_uuid" },
      { value: "cdr.number_masking", label: "number_masking" },
      { value: "cdr.pbx_feature", label: "pbx_feature" },
      { value: "cdr.pbx_feature_uuid", label: "pbx_feature_uuid" },
      { value: "cdr.recording_path", label: "recording_path" },
      { value: "cdr.ringing_time", label: "ringing_time" },
      { value: "cdr.sip_user", label: "sip_user" },
      { value: "cdr.tenant_uuid", label: "tenant_uuid" },
      { value: "cdr.total_duration", label: "total_duration" },
      { value: "cdr.trunk_uuid", label: "trunk_uuid" },
      { value: "cdr.user_uuid", label: "user_uuid" },
      { value: "cdr.waiting_time", label: "waiting_time" },
    ],
  },
  {
    label: "Derived / joined",
    options: [
      { value: "agent_name", label: "Agent Name" },
      {
        value: "agent_display_name",
        label: "Agent Display Name — \"username - full name\" when both exist",
      },
      {
        value: "extension_username",
        label: "Extension Username — the SIP extension's own username",
      },
      { value: "campaign_name", label: "Campaign Name" },
      { value: "comment", label: "Comment" },
      {
        value: "follow_up_date",
        label: "Follow Up Date — latest scheduled reminder for the lead",
      },
      {
        value: "hangup_by",
        label: "Hang Up By (Agent / Customer / System)",
      },
      { value: "disposition_root", label: "Disposition Root" },
      { value: "disposition_sub", label: "Disposition Sub" },
      { value: "disposition_sub2", label: "Disposition Sub 2" },
      {
        value: "callstart_ist",
        label: "Call Start IST — converted from UTC (2026-07-14 15:04:05)",
      },
      { value: "call_date", label: "Call Date (2026-07-14)" },
      { value: "call_time", label: "Call Time (15:04:05)" },
      {
        value: "callend_ist",
        label: "Call End IST — stored as-is, not converted (2026-07-14 18:09:48)",
      },
      { value: "callend_date", label: "Call End Date (2026-07-14)" },
      { value: "callend_time", label: "Call End Time (18:09:48)" },
      {
        value: "created_at_ist",
        label: "Created At IST — converted from UTC (2026-07-14 18:37:36)",
      },
      { value: "recording_url", label: "Recording URL" },
      {
        value: "total_duration_formatted",
        label: "Total Duration (00:04:12)",
      },
      { value: "billsecond_formatted", label: "billsecond_formatted - Answer Time (00:03:10)" },
      {
        value: "actual_talktime_formatted",
        label: "Actual Talk Time (00:01:40) — direction-aware, unlike cdr.actual_talktime which is blank for outbound calls",
      },
      { value: "ringing_time_formatted", label: "Ringing Time (00:00:08)" },
      { value: "waiting_time_formatted", label: "Waiting Time (00:00:05)" },
      { value: "hold_time_formatted", label: "Hold Time (00:00:12)" },
      {
        value: "acw_time_formatted",
        label: "ACW Time (00:00:00)",
      },
      { value: "hangup_by_raw", label: "Hang Up By — Agent / Customer / System / -" },
      {
        value: "dial_method_label",
        label: "Dial Method (Auto / Manual / Preview Dial)",
      },
      {
        value: "disconnected_by_label",
        label: "Disconnected By (Agent / Customer / System)",
      },
      { value: "direction_label", label: "Direction (Inbound / Outbound)" },
      { value: "user_group_name", label: "User Group Name" },
      { value: "lead_group_name", label: "Lead Group Name" },
      { value: "ivr_cq_name", label: "IVR / Call Queue Name" },
      { value: "lead_name", label: "Lead Name" },
      {
        value: "customer_number",
        label: "Customer Number (direction-based)",
      },
      { value: "agent_number", label: "Agent Number (direction-based)" },
      { value: "event", label: "Event (1 = inbound / 2 = outbound)" },
      {
        value: "call_status_vyapar",
        label: "Call Status (Connected / Abandoned / Not Connected)",
      },
      { value: "queue_id", label: "Queue ID (if call_queue)" },
      { value: "call_id_objectid", label: "Call ID — Mongo _id" },
      { value: "custom_fields", label: "Custom Fields — object (lead)" },
      {
        value: "custom_fields_json",
        label: "Custom Fields — JSON string (lead)",
      },
    ],
  },
];

// `raw || fallback` treats a genuine 0 as falsy and silently replaces it with
// fallback — wrong for delay_minutes, where 0 ("deliver immediately") is a valid,
// intentional value distinct from "unset". Only an empty/missing/non-numeric raw
// value should fall back.
const parseNumericOrFallback = (raw: any, fallback: number) => {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return fallback;
  }
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
};

const methodOptions = [
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "GET", label: "GET" },
];

const mappingModeOptions = [
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
];

const defaultCdrMappingRows = [
  { targetKey: "Start Date", sourcePath: "callstart_ist", defaultValue: "" },
  { targetKey: "End Date", sourcePath: "callend_ist", defaultValue: "" },
  { targetKey: "Caller's Number", sourcePath: "agent_number", defaultValue: "" },
  { targetKey: "Receiver's Number", sourcePath: "customer_number", defaultValue: "" },
  { targetKey: "User ID", sourcePath: "cdr.sip_user", defaultValue: "" },
  { targetKey: "Full Name", sourcePath: "agent_name", defaultValue: "" },
  { targetKey: "User Group Name", sourcePath: "user_group_name", defaultValue: "" },
  { targetKey: "IVR/CQ Name", sourcePath: "ivr_cq_name", defaultValue: "" },
  { targetKey: "Duration", sourcePath: "total_duration_formatted", defaultValue: "" },
  { targetKey: "Answer Time", sourcePath: "billsecond_formatted", defaultValue: "" },
  { targetKey: "Actual Talk Time", sourcePath: "actual_talktime_formatted", defaultValue: "" },
  { targetKey: "Call Status", sourcePath: "call_status_vyapar", defaultValue: "" },
  { targetKey: "Hold Time", sourcePath: "hold_time_formatted", defaultValue: "" },
  { targetKey: "Waiting Time", sourcePath: "waiting_time_formatted", defaultValue: "" },
  { targetKey: "Ringing Time", sourcePath: "ringing_time_formatted", defaultValue: "" },
  { targetKey: "ACW Time", sourcePath: "acw_time_formatted", defaultValue: "" },
  { targetKey: "Campaign", sourcePath: "campaign_name", defaultValue: "" },
  { targetKey: "Lead Group Name", sourcePath: "lead_group_name", defaultValue: "" },
  { targetKey: "Dial Method", sourcePath: "dial_method_label", defaultValue: "" },
  { targetKey: "Disconnected By", sourcePath: "disconnected_by_label", defaultValue: "" },
  { targetKey: "Disposition", sourcePath: "disposition_root", defaultValue: "" },
  { targetKey: "Sub Disposition 1", sourcePath: "disposition_sub", defaultValue: "" },
  { targetKey: "Sub Disposition 2", sourcePath: "disposition_sub2", defaultValue: "" },
  { targetKey: "Direction", sourcePath: "direction_label", defaultValue: "" },
  { targetKey: "CSAT Score", sourcePath: "cdr.ivr_feedback_score", defaultValue: "" },
  { targetKey: "Comment", sourcePath: "comment", defaultValue: "" },
  { targetKey: "Recording", sourcePath: "recording_url", defaultValue: "" },
];

// Local form state keeps is_active as a "0"/"1" string for the Switch control;
// it is converted to a boolean only when building the API payload in onSubmit.
const initialValues: any = {
  name: "",
  webhook_url: "",
  webhook_type: "cdr",
  method: "POST",
  headers: {},
  headers_text: "",
  timeout: 30000,
  max_retries: 3,
  retry_delay: 2000,
  delay_minutes: "2",
  is_active: "0",
  bearer_token: "",
  transform_strategy: "legacy",
  wrapInJson: "0",
  wrapperKey: "",
  wrapperType: "object",
  transform_template: "",
  stripEmpty: "0",
  campaign_uuids: [],
};

const CreateEditWebhookForm = () => {
  const { id }: any = useParams();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const campaignOptions = useCampaignOptions();

  const [loading, setLoading] = useState<boolean>(false);
  const [mappingMode, setMappingMode] = useState<"default" | "custom">(
    "default",
  );
  const [transformRows, setTransformRows] = useState<
    Array<{ sourcePath: string; targetKey: string; defaultValue: string }>
  >(defaultCdrMappingRows.map((row) => ({ ...row })));

  const buildTemplateFromRowsList = (
    rows: Array<{ sourcePath: string; targetKey: string; defaultValue: string }>,
  ) => {
    const record: { [key: string]: any } = {};
    rows.forEach((row) => {
      const targetKey = row.targetKey?.trim();
      const sourcePath = row.sourcePath?.trim();
      const defaultValue = row.defaultValue?.trim();
      if (!targetKey || !sourcePath) return;
      record[targetKey] = defaultValue
        ? `{{${sourcePath}||${defaultValue}}}`
        : `{{${sourcePath}}}`;
    });
    return record;
  };

  const applyWrapping = (record: { [key: string]: any }) => {
    if (values.wrapInJson === "1") {
      const wrapper = values.wrapperKey?.trim() || "wrapper";
      return values.wrapperType === "array"
        ? { [wrapper]: [record] }
        : { [wrapper]: record };
    }
    return record;
  };

  const buildTransformTemplateFromRows = () => {
    const record = buildTemplateFromRowsList(transformRows);
    return Object.keys(record).length > 0 ? record : null;
  };

  const syncRowsFromTemplate = (template: any) => {
    if (!template) {
      return [{ sourcePath: "", targetKey: "", defaultValue: "" }];
    }
    if (typeof template === "string") {
      try {
        template = JSON.parse(template);
      } catch {
        return [{ sourcePath: "", targetKey: "", defaultValue: "" }];
      }
    }
    if (typeof template === "object" && !Array.isArray(template)) {
      return Object.entries(template).map(([key, value]) => {
        const stringValue =
          typeof value === "string" ? value : JSON.stringify(value);
        const match = stringValue.match(
          /\{\{\s*([a-zA-Z0-9_.]+)(?:\|\|([^}]+))?\s*\}\}/,
        );
        return {
          sourcePath: match ? match[1] : "",
          defaultValue: match?.[2]?.trim() || "",
          targetKey: key,
        };
      });
    }
    return [{ sourcePath: "", targetKey: "", defaultValue: "" }];
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please Enter Webhook Name"),
    webhook_url: Yup.string()
      .required("Please Enter Webhook URL")
      .url("Please Enter a Valid URL"),
    headers_text: Yup.string().test(
      "is-json",
      "Headers must be valid JSON",
      (value) => {
        if (!value) return true;
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      },
    ),
    wrapInJson: Yup.string().oneOf(["0", "1"]),
    wrapperKey: Yup.string().test(
      "wrapper-key-validation",
      "Wrapper key is required and must be a valid identifier",
      function (value) {
        const { wrapInJson } = this.parent;
        if (wrapInJson === "1") {
          return !!value && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value);
        }
        return true;
      },
    ),
    wrapperType: Yup.string().oneOf(["object", "array"]),
    transform_template: Yup.string().test(
      "is-json",
      "Transform template must be valid JSON",
      (value) => {
        if (!value) return true;
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      },
    ),
  });

  // Prefers the (possibly hand-edited) Output preview JSON over the rows — this is
  // what lets someone add a hardcoded literal key/value that has no corresponding
  // mapping row (e.g. "source": "my-crm"). Falls back to the row-generated template
  // when the preview is empty or not valid JSON.
  const resolveTransformTemplate = (values: any) => {
    const raw = values.transform_template?.trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        // Falls through to the row-generated template below.
      }
    }
    return buildTransformTemplateFromRows();
  };

  const onSubmit = (values: any) => {
    let headers = {};
    if (values.headers_text) {
      try {
        headers = JSON.parse(values.headers_text);
      } catch {
        headers = {};
      }
    }

    const payload = {
      name: values.name,
      webhook_url: values.webhook_url,
      webhook_type: values.webhook_type,
      method: values.method,
      headers,
      timeout: Number(values.timeout) || 30000,
      max_retries: Number(values.max_retries) || 0,
      retry_delay: Number(values.retry_delay) || 0,
      delay: parseNumericOrFallback(values.delay_minutes, 2) * 60000,
      is_active: values.is_active === "0",
      bearer_token: values.bearer_token || null,
      transform_strategy: values.transform_strategy,
      wrapInJson: values.wrapInJson === "1",
      wrapperKey: values.wrapperKey || null,
      wrapperType: values.wrapperType || "object",
      transform_template: resolveTransformTemplate(values),
      mapping_mode: mappingMode,
      stripEmpty: values.stripEmpty === "1",
      campaign_uuids: values.campaign_uuids || [],
    };

    if (id) {
      onUpdateWebhook(payload);
    } else {
      onCreateWebhook(payload);
    }
  };

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik<any>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const outputPreview = useMemo(() => {
    const record = buildTemplateFromRowsList(transformRows);
    if (Object.keys(record).length === 0) return null;
    return applyWrapping(record);
  }, [transformRows, values.wrapInJson, values.wrapperKey, values.wrapperType]);

  // Seeds the editable Output preview textarea from the row-generated template, but
  // only while it's still empty — so this never clobbers a hand-added hardcoded value
  // or a template already loaded from an existing webhook. Once seeded, further row
  // changes require the explicit "Regenerate from rows" button, by design.
  useEffect(() => {
    if (values.transform_template || !outputPreview) return;
    setFieldValue("transform_template", JSON.stringify(outputPreview, null, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputPreview]);

  useEffect(() => {
    dispatch(campaignOptionsGet());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!id) return;
    onGetSingleWebhookData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onGetSingleWebhookData = async () => {
    try {
      const res: any = await dispatch(tenantWebhookSingleGet(id)).unwrap();
      if (res?.statusCode === 200) {
        const webhook = res?.data;
        setValues({
          ...values,
          name: webhook?.name,
          webhook_url: webhook?.webhook_url,
          webhook_type: webhook?.webhook_type || "cdr",
          method: webhook?.method || "POST",
          headers_text: webhook?.headers
            ? JSON.stringify(webhook.headers, null, 2)
            : "",
          timeout: webhook?.timeout || 30000,
          max_retries: webhook?.max_retries ?? 3,
          retry_delay: webhook?.retry_delay ?? 2000,
          // parseNumericOrFallback (not ||) so a genuinely saved 0 (deliver
          // immediately) isn't silently replaced by the 2-minute default — it also
          // guards against existing documents storing delay as a string (e.g. "120000").
          delay_minutes: String(parseNumericOrFallback(webhook?.delay, 120000) / 60000),
          is_active: webhook?.is_active === false ? "1" : "0",
          bearer_token: webhook?.bearer_token || "",
          transform_strategy: webhook?.transform_strategy || "legacy",
          wrapInJson: webhook?.wrapInJson ? "1" : "0",
          wrapperKey: webhook?.wrapperKey || "",
          wrapperType: webhook?.wrapperType || "object",
          stripEmpty: webhook?.stripEmpty ? "1" : "0",
          campaign_uuids: webhook?.campaign_uuids || [],
          transform_template:
            webhook?.transform_template &&
            typeof webhook.transform_template === "object"
              ? JSON.stringify(webhook.transform_template, null, 2)
              : webhook?.transform_template || "",
        });
        if (webhook?.transform_template) {
          setMappingMode(webhook?.mapping_mode === "default" ? "default" : "custom");
          setTransformRows(syncRowsFromTemplate(webhook.transform_template));
        }
      }
    } catch (err) {
      console.error("Get Single Webhook Data Err =-=>", err);
    }
  };

  const onCreateWebhook = async (payload: any) => {
    setLoading(true);
    try {
      const res: any = await dispatch(tenantWebhookCreate(payload)).unwrap();
      if (res?.statusCode === 201) {
        Success(res?.message || "Webhook created successfully");
        router.back();
      } else {
        Danger(res?.message || "Failed to create webhook");
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      Danger("Failed to create webhook");
      console.error("Create Webhook Err --->", e?.message);
    }
  };

  const onUpdateWebhook = async (payload: any) => {
    setLoading(true);
    try {
      const res: any = await dispatch(
        tenantWebhookUpdate({ ...payload, id }),
      ).unwrap();
      if (res?.statusCode === 200) {
        Success(res?.message || "Webhook updated successfully");
        router.back();
      } else {
        Danger(res?.message || "Failed to update webhook");
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      Danger("Failed to update webhook");
      console.error("Update Webhook Err --->", e?.message);
    }
  };

  return (
    <CardForm
      id={id}
      name="webhook"
      title={id ? "Edit Webhook" : "Create Webhook"}
      loading={loading}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => router.back()}
    >
      <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
        <Input
          name="name"
          label={
            <>
              Name <span className="text-red-500">*</span>
            </>
          }
          placeholder="Enter Webhook Name"
          value={values.name}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          noSpace
          isInfo
        />
        <Input
          name="webhook_url"
          label={
            <>
              Webhook URL <span className="text-red-500">*</span>
            </>
          }
          placeholder="https://example.com/webhook"
          value={values.webhook_url}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Select
          name="webhook_type"
          label="Webhook Type"
          options={webhookTypeOptions}
          value={values.webhook_type}
          touched={touched}
          errors={errors}
          onChange={(e: any) => setFieldValue("webhook_type", e.target.value)}
          onBlur={handleBlur}
          isInfo
        />
        <Select
          name="method"
          label="HTTP Method"
          options={methodOptions}
          value={values.method}
          touched={touched}
          errors={errors}
          onChange={(e: any) => setFieldValue("method", e.target.value)}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="bearer_token"
          label="Bearer Token"
          placeholder="Optional bearer token"
          value={values.bearer_token}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <div className="col-span-3 flex flex-col gap-1">
          <Select
            name="campaign_uuids"
            label="Campaigns"
            placeholder="Select Campaigns"
            isMulti
            isGroup
            options={campaignOptions}
            value={values.campaign_uuids}
            touched={touched}
            errors={errors}
            onChange={(vals: any) => setFieldValue("campaign_uuids", vals)}
            onBlur={handleBlur}
            isInfo
          />
          <p className="text-xs text-gray-500">
            Restrict this webhook to only post data for the selected
            campaigns. Leave empty to post for all campaigns.
          </p>
        </div>
        <Select
          name="transform_strategy"
          label="Transform Strategy"
          options={[
            // { value: "legacy", label: "Legacy" },
            { value: "ui", label: "UI Template" },
          ]}
          value={values.transform_strategy}
          touched={touched}
          errors={errors}
          onChange={(e: any) =>
            setFieldValue("transform_strategy", e.target.value)
          }
          onBlur={handleBlur}
          isInfo
        />
        {values.transform_strategy === "ui" && (
          <div className="col-span-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">
                  Mapping Keys
                </div>
                <p className="text-xs text-gray-500">
                  Select a CDR field and enter the outgoing payload key.
                </p>
                <Radio
                  name="mapping_mode"
                  label="Mapping Type"
                  value={mappingMode}
                  options={mappingModeOptions}
                  onChange={(e: any) => {
                    const nextMode = e.target.value as "default" | "custom";
                    setMappingMode(nextMode);
                    if (nextMode === "default") {
                      const rows = defaultCdrMappingRows.map((row) => ({
                        ...row,
                      }));
                      setTransformRows(rows);
                      // Force-regenerate (not just seed-if-empty) so switching back to
                      // Default always reflects the real default mapping, even if the
                      // Output preview textarea still held stale custom/hand-edited JSON.
                      setFieldValue(
                        "transform_template",
                        JSON.stringify(
                          applyWrapping(buildTemplateFromRowsList(rows)),
                          null,
                          2,
                        ),
                      );
                    }
                  }}
                />
                {mappingMode === "default" && (
                  <p className="text-xs text-gray-500">
                    Sends the standard CDR report fields (Start Date, End
                    Date, Caller&apos;s Number, Disposition, Recording, etc.).
                    Switch to Custom to change the mapping.
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <CheckBox
                    checked={values.wrapInJson === "1"}
                    onChange={(checked: boolean) =>
                      setFieldValue("wrapInJson", checked ? "1" : "0")
                    }
                    label="Wrap in JSON object"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Nest all mapped fields as an array under a single key.
                </p>
                <div className="flex items-center gap-4">
                  <CheckBox
                    checked={values.stripEmpty === "1"}
                    onChange={(checked: boolean) =>
                      setFieldValue("stripEmpty", checked ? "1" : "0")
                    }
                    label="Strip empty fields"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Remove mapped keys whose rendered value is empty, null, or
                  &quot;-&quot; from the outgoing payload.
                </p>
                {values.wrapInJson === "1" && (
                  <>
                    <Input
                      name="wrapperKey"
                      label="Wrapper key name"
                      placeholder="e.g. D"
                      value={values.wrapperKey}
                      touched={touched}
                      errors={errors}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInfo
                    />
                    <Select
                      name="wrapperType"
                      label="Wrapper format"
                      options={[
                        { value: "object", label: "Object" },
                        { value: "array", label: "Array" },
                      ]}
                      value={values.wrapperType}
                      touched={touched}
                      errors={errors}
                      onChange={(e: any) =>
                        setFieldValue("wrapperType", e.target.value)
                      }
                      onBlur={handleBlur}
                      isInfo
                    />
                  </>
                )}
              </div>
              {mappingMode === "custom" && (
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
                    onClick={() =>
                      setTransformRows((prev) => [
                        ...prev,
                        { sourcePath: "", targetKey: "", defaultValue: "" },
                      ])
                    }
                  >
                    Add row
                  </button>
                </div>
              )}
            </div>
            <div className="grid gap-3">
              {transformRows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-3 rounded-lg border border-gray-200 bg-white p-3"
                >
                  <Select
                    name={`transform_source_${index}`}
                    label="Source field"
                    options={cdrFieldOptions}
                    value={row.sourcePath}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                      const newRows = [...transformRows];
                      newRows[index].sourcePath = e.target.value;
                      setTransformRows(newRows);
                    }}
                    onBlur={handleBlur}
                    isInfo
                    className="col-span-2"
                    isGroup
                    isDisabled={mappingMode === "default"}
                  />
                  <Input
                    name={`transform_target_${index}`}
                    label="Payload key"
                    placeholder="Enter payload key"
                    value={row.targetKey}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                      const newRows = [...transformRows];
                      newRows[index].targetKey = e.target.value;
                      setTransformRows(newRows);
                    }}
                    onBlur={handleBlur}
                    isInfo
                    className="col-span-2"
                    disabled={mappingMode === "default"}
                  />
                  <Input
                    name={`transform_default_${index}`}
                    label="Default value"
                    placeholder="Optional default"
                    value={row.defaultValue}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                      const newRows = [...transformRows];
                      newRows[index].defaultValue = e.target.value;
                      setTransformRows(newRows);
                    }}
                    onBlur={handleBlur}
                    isInfo
                    className="col-span-2"
                    disabled={mappingMode === "default"}
                  />
                  {mappingMode === "custom" && (
                    <button
                      type="button"
                      className="col-span-1 self-end rounded-md bg-red-500 px-3 py-2 text-xs font-semibold text-white"
                      onClick={() =>
                        setTransformRows((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Output preview
                  </div>
                  <p className="text-xs text-gray-500">
                    Shows how mapped fields will appear in the webhook
                    payload.{" "}
                    {mappingMode === "custom" ? (
                      <>
                        Edit directly to add a hardcoded value that
                        isn&apos;t tied to any CDR field (e.g.{" "}
                        <code>&quot;source&quot;: &quot;my-crm&quot;</code>) —
                        this is what actually gets sent, not just the
                        mapping rows above.
                      </>
                    ) : (
                      <>Switch to Custom to edit this JSON directly.</>
                    )}
                  </p>
                </div>
                {mappingMode === "custom" && (
                  <button
                    type="button"
                    className="shrink-0 rounded-md bg-slate-700 px-3 py-2 text-xs font-semibold text-white"
                    onClick={() =>
                      setFieldValue(
                        "transform_template",
                        JSON.stringify(outputPreview ?? {}, null, 2),
                      )
                    }
                  >
                    Regenerate from rows
                  </button>
                )}
              </div>
              <Textarea
                name="transform_template"
                rows={14}
                isShowLabel={false}
                className="font-mono"
                placeholder="Add mapping rows above, or write the payload JSON directly here."
                value={values.transform_template}
                touched={touched}
                errors={errors}
                disabled={mappingMode === "default"}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        )}
        <InputNumber
          name="max_retries"
          label="Max Retries"
          value={values.max_retries?.toString()}
          touched={touched}
          errors={errors}
          onChange={(value: string) => setFieldValue("max_retries", value)}
          onBlur={handleBlur}
          isInfo
        />
        <InputNumber
          name="retry_delay"
          label="Retry Delay (ms)"
          value={values.retry_delay?.toString()}
          touched={touched}
          errors={errors}
          onChange={(value: string) => setFieldValue("retry_delay", value)}
          onBlur={handleBlur}
          isInfo
        />
        <div className="flex flex-col gap-1">
          <InputNumber
            name="delay_minutes"
            label="Webhook Post Delay (minutes)"
            value={values.delay_minutes?.toString()}
            touched={touched}
            errors={errors}
            onChange={(value: string) => setFieldValue("delay_minutes", value)}
            onBlur={handleBlur}
            isInfo
          />
          <p className="text-xs text-gray-500">
            Waits this long after the call ends before delivering the webhook,
            so late-set fields like disposition and comment are captured.
            Default 2 minutes.
          </p>
        </div>
        <Textarea
          className="col-span-3"
          name="headers_text"
          label="Custom Headers (JSON)"
          placeholder='{"X-Custom-Header": "value"}'
          rows={4}
          value={values.headers_text}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
      </div>
    </CardForm>
  );
};

export default CreateEditWebhookForm;
