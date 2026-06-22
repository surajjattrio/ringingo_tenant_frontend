import { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    updateSingleRoleData,
    roleCreate,
    roleUpdate,
    useSingleRoleData,
} from "@/redux/slice/master-admin/roleSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import {
    CheckBox,
    IncreaseDecreaseInput,
    Input,
    LabelSwitch,
    Switch,
} from "@/components/forms";
import { CardForm, Icon } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { InitialValueType } from "@/types/master-admin/rolesTypes";

// DATA IMPORT
import {
    apiData,
    broadcastingData,
    callCenterRoleData,
    incomingRulesData,
    leadManagementData,
    outgoingRulesData,
    reportsRolesData,
    settingData,
    userRoleData,
    messagingData,
    pluginsData,
    schedulingReportData,
    emailData
} from "./mock";

/* ============================== CREATE & EDIT ROLES FORM ============================== */

const CreateEditRolesForm = () => {
    const { id }: any = useParams();

    const dispatch = useAppDispatch();
    const getSingleRole = useSingleRoleData();
    const router = useRouter();

    const [openUser, setOpenUser] = useState<boolean>(false);
    const [openOutgoing, setOpenOutgoing] = useState<boolean>(false);
    const [openIncoming, setOpenIncoming] = useState<boolean>(false);
    const [openLeadManagement, setOpenLeadManagement] = useState<boolean>(false);
    const [openCallCenter, setOpenCallCenter] = useState<boolean>(false);
    const [openBroadcasting, setOpenBroadcasting] = useState<boolean>(false);
    const [openMessaging, setOpenMessaging] = useState<boolean>(false);
    const [openReports, setOpenReports] = useState<boolean>(false);
    const [openSettings, setOpenSettings] = useState<boolean>(false);
    const [openApi, setOpenApi] = useState<boolean>(false);
    const [openPlugins, setOpenPlugins] = useState<boolean>(false);
    const [openSchedulingReport, setOpenSchedulingReport] = useState<boolean>(false);
    const [openEmail, setOpenEmail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        role_name: "",
        status: "0",

        user: "0",
        is_user: false,
        user_group: "0",
        is_user_group: false,
        user_role: "0",
        is_user_role: false,
        extension: "0",
        is_extension: false,
        zoho_id: "0",
        is_zoho_id: false,

        trunk: "0",
        is_trunk: false,
        og_rules: "0",
        is_og_rules: false,
        call_id_group: "0",
        is_call_id_group: false,

        did: "0",
        is_did: false,
        ip_mapping: "0",
        is_ip_mapping: false,
        click_to_Call: "0",
        is_click_to_Call: false,
        rg: "0",
        is_rg: false,
        ivr: "0",
        is_ivr: false,
        tc: "0",
        is_tc: false,
        cf: "0",
        is_cf: false,
        cq: "0",
        is_cq: false,
        fc: "0",
        is_fc: false,
        block_ic: "0",
        is_block_ic: false,

        leads: "0",
        is_leads: false,
        lead_group: "0",
        is_lead_group: false,
        follow_up: "0",
        is_follow_up: false,
        custom_fields: "0",
        is_custom_fields: false,
        lead_churning: "0",
        is_lead_churning: false,

        oc: "0",
        is_oc: false,
        ic: "0",
        is_ic: false,
        bc: "0",
        is_bc: false,
        td: "0",
        is_td: false,
        dnc: "0",
        is_dnc: false,

        vb: "0",
        is_vb: false,

        whatsapp: "0",
        is_whatsapp: false,
        instagram: "0",
        is_instagram: false,

        facebook: "0",
        is_facebook: false,

        sms: "0",
        is_sms: false,
        activity_log: "0",
        is_activity_log: false,

        cdrs: "0",
        is_cdrs: false,
        lc: "0",
        is_lc: false,
        missedcall: "0",
        is_missedcall: false,
        rr: "0",
        is_rr: false,
        lead_report: "0",
        is_lead_report: false,
        campaign_report: "0",
        is_campaign_report: false,
        up: "0",
        is_up: false,
        loginLogout: "0",
        is_loginLogout: false,
        voicemail: "0",
        is_voicemail: false,
        recording: "0",
        is_recording: false,
        voicebroadcast_report: "0",
        is_voicebroadcast_report: false,
        sticky_agent_report: "0",
        is_sticky_agent_report: false,
        omni_channel_report: "0",
        is_omni_channel_report: false,
        csat_report: "0",
        is_csat_report: false,

        prompts: "0",
        is_prompts: false,
        e_smtp: "0",
        is_e_smtp: false,
        telecomcircle: "0",
        is_telecomcircle: false,
        breakcode: "0",
        is_breakcode: false,
        webform: "0",
        is_webform: false,

        crm: "0",
        is_crm: false,
        // code: "0",
        // is_code: false,
        api_key: "0",
        is_api_key: false,
        webhooks: "0",
        is_webhooks: false,

        google_drive: "0",
        is_google_drive: false,
        google_sheet: "0",
        is_google_sheet: false,

        cdrs_report: "0",
        is_cdrs_report: false,

        email_configs: "0",
        is_email_configs: false,
        email_templates: "0",
        is_email_templates: false,

        mail_schedule: "0",
        is_mail_schedule: false,

    };

    const validationSchema = Yup.object<any>({
        role_name: Yup.string().required("Please Enter Role Name"),
    });

    // Create or Update Roles
    const onSubmit = (values: any) => {
        let payload: any = {};
        payload = {
            role_name: values.role_name,
            status: values.status,
            advanced_roles: {},
        };

        const addUserArray = ["user", "user_group", "user_role", "extension"];

        if (openUser) {
            payload["advanced_roles"]["users"] = {};
            addUserArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["users"][val] = values[val];
                }
            });
        }

        const addOutgoingRulesArray = ["trunk", "og_rules", "call_id_group"];

        if (openOutgoing) {
            payload["advanced_roles"]["outgoing_rules"] = {};
            addOutgoingRulesArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["outgoing_rules"][val] = values[val];
                }
            });
        }

        const addIncomingArray = [
            "did",
            "ip_mapping",
            "click_to_Call",
            "rg",
            "ivr",
            "tc",
            "cf",
            "cq",
            "fc",
            "block_ic",
        ];

        if (openIncoming) {
            payload["advanced_roles"]["incoming_rules"] = {};
            addIncomingArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["incoming_rules"][val] = values[val];
                }
            });
        }

        const addLmArray = ["leads", "lead_group", "follow_up", "custom_fields", "lead_churning"];

        if (openLeadManagement) {
            payload["advanced_roles"]["lead_management"] = {};
            addLmArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["lead_management"][val] = values[val];
                }
            });
        }

        const addCcArray = ["oc", "ic", "bc", "td", "dnc"];

        if (openCallCenter) {
            payload["advanced_roles"]["call_center"] = {};
            addCcArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["call_center"][val] = values[val];
                }
            });
        }

        const addBcArray = ["vb"];

        if (openBroadcasting) {
            payload["advanced_roles"]["broadcasting"] = {};
            addBcArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["broadcasting"][val] = values[val];
                }
            });
        }

        const addMsgArray = ["whatsapp", "instagram", "facebook", "sms"];
        if (openMessaging) {
            payload["advanced_roles"]["messaging"] = {};
            addMsgArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["messaging"][val] = values[val];
                }
            });
        }


        const addReportsArray = [
            "cdrs",
            "lc",
            "missedcall",
            "rr",
            "lead_report",
            "campaign_report",
            "up",
            "loginLogout",
            "voicemail",
            "recording",
            "voicebroadcast_report",
            "sticky_agent_report",
            "omni_channel_report",
            "csat_report",
            "sticky_agent_report",
            "omni_channel_report",
            "csat_report",
            "activity_log",
        ];

        if (openReports) {
            payload["advanced_roles"]["reports"] = {};
            addReportsArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["reports"][val] = values[val];
                }
            });
        }

        const addSettingArray = ["prompts", "e_smtp", "telecomcircle", "breakcode", "webform"];

        if (openSettings) {
            payload["advanced_roles"]["settings"] = {};
            addSettingArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["settings"][val] = values[val];
                }
            });
        }

        const addApiArray = ["webhooks", "zoho_id"];

        if (openApi) {
            payload["advanced_roles"]["api"] = {};
            addApiArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["api"][val] = values[val];
                }
            });
        }

        const addPluginsArray = ["google_drive", "google_sheet"];

        if (openPlugins) {
            payload["advanced_roles"]["plugins"] = {};
            addPluginsArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["plugins"][val] = values[val];
                }
            });
        }

        const addSchedulingReportArray = ["cdrs_report", "mail_schedule"];
        if (openSchedulingReport) {
            payload["advanced_roles"]["report_scheduling"] = {};
            addSchedulingReportArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["report_scheduling"][val] = values[val];
                }
            });
        }
         const addEmailArray = ["email_configs", "email_templates"];
        if (openEmail) {
            payload["advanced_roles"]["email"] = {};
            addEmailArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    payload["advanced_roles"]["email"][val] = values[val];
                }
            });
        }

        if (id) {
            onUpdateRole(payload);
        } else {
            onCreateRole(payload);
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

    useLayoutEffect(() => {
        if (!id) return;
        setValues({
            ...values,
            role_name: getSingleRole?.role_name || "",
            status: getSingleRole?.status || "0",

            user: getSingleRole?.module_permission?.users?.user || "0",
            is_user: !!getSingleRole?.module_permission?.users?.user,
            user_group: getSingleRole?.module_permission?.users?.user_group || "0",
            is_user_group: !!getSingleRole?.module_permission?.users?.user_group,
            user_role: getSingleRole?.module_permission?.users?.user_role || "0",
            is_user_role: !!getSingleRole?.module_permission?.users?.user_role,
            extension: getSingleRole?.module_permission?.users?.extension || "0",
            is_extension: !!getSingleRole?.module_permission?.users?.extension,

            trunk: getSingleRole?.module_permission?.outgoing_rules?.trunk || "0",
            is_trunk: !!getSingleRole?.module_permission?.outgoing_rules?.trunk,
            og_rules: getSingleRole?.module_permission?.outgoing_rules?.og_rules || "0",
            is_og_rules: !!getSingleRole?.module_permission?.outgoing_rules?.og_rules,
            call_id_group: getSingleRole?.module_permission?.outgoing_rules?.call_id_group || "0",
            is_call_id_group: !!getSingleRole?.module_permission?.outgoing_rules?.call_id_group,

            did: getSingleRole?.module_permission?.incoming_rules?.did || "0",
            is_did: !!getSingleRole?.module_permission?.incoming_rules?.did,
            ip_mapping: getSingleRole?.module_permission?.incoming_rules?.ip_mapping || "0",
            is_ip_mapping: !!getSingleRole?.module_permission?.incoming_rules?.ip_mapping,
            click_to_Call: getSingleRole?.module_permission?.incoming_rules?.click_to_Call || "0",
            is_click_to_Call: !!getSingleRole?.module_permission?.incoming_rules?.click_to_Call,
            rg: getSingleRole?.module_permission?.incoming_rules?.rg || "0",
            is_rg: !!getSingleRole?.module_permission?.incoming_rules?.rg,
            ivr: getSingleRole?.module_permission?.incoming_rules?.ivr || "0",
            is_ivr: !!getSingleRole?.module_permission?.incoming_rules?.ivr,
            tc: getSingleRole?.module_permission?.incoming_rules?.tc || "0",
            is_tc: !!getSingleRole?.module_permission?.incoming_rules?.tc,
            cf: getSingleRole?.module_permission?.incoming_rules?.cf || "0",
            is_cf: !!getSingleRole?.module_permission?.incoming_rules?.cf,
            cq: getSingleRole?.module_permission?.incoming_rules?.cq || "0",
            is_cq: !!getSingleRole?.module_permission?.incoming_rules?.cq,
            fc: getSingleRole?.module_permission?.incoming_rules?.fc || "0",
            is_fc: !!getSingleRole?.module_permission?.incoming_rules?.fc,
            block_ic: getSingleRole?.module_permission?.incoming_rules?.block_ic || "0",
            is_block_ic: !!getSingleRole?.module_permission?.incoming_rules?.block_ic,

            leads: getSingleRole?.module_permission?.lead_management?.leads || "0",
            is_leads: !!getSingleRole?.module_permission?.lead_management?.leads,
            lead_group: getSingleRole?.module_permission?.lead_management?.lead_group || "0",
            is_lead_group: !!getSingleRole?.module_permission?.lead_management?.lead_group,
            follow_up: getSingleRole?.module_permission?.lead_management?.follow_up || "0",
            is_follow_up: !!getSingleRole?.module_permission?.lead_management?.follow_up,
            custom_fields: getSingleRole?.module_permission?.lead_management?.custom_fields || "0",
            is_custom_fields: !!getSingleRole?.module_permission?.lead_management?.custom_fields,
            lead_churning: getSingleRole?.module_permission?.lead_management?.lead_churning || "0",
            is_lead_churning: !!getSingleRole?.module_permission?.lead_management?.lead_churning,

            oc: getSingleRole?.module_permission?.call_center?.oc || "0",
            is_oc: !!getSingleRole?.module_permission?.call_center?.oc,
            ic: getSingleRole?.module_permission?.call_center?.ic || "0",
            is_ic: !!getSingleRole?.module_permission?.call_center?.ic,
            bc: getSingleRole?.module_permission?.call_center?.bc || "0",
            is_bc: !!getSingleRole?.module_permission?.call_center?.bc,
            td: getSingleRole?.module_permission?.call_center?.td || "0",
            is_td: !!getSingleRole?.module_permission?.call_center?.td,
            dnc: getSingleRole?.module_permission?.call_center?.dnc || "0",
            is_dnc: !!getSingleRole?.module_permission?.call_center?.dnc,

            vb: getSingleRole?.module_permission?.broadcasting?.vb || "0",
            is_vb: !!getSingleRole?.module_permission?.broadcasting?.vb,

            whatsapp: getSingleRole?.module_permission?.messaging?.whatsapp || "0",
            is_whatsapp: !!getSingleRole?.module_permission?.messaging?.whatsapp,
            instagram: getSingleRole?.module_permission?.messaging?.instagram || "0",
            is_instagram: !!getSingleRole?.module_permission?.messaging?.instagram,

            facebook: getSingleRole?.module_permission?.messaging?.facebook || "0",
            is_facebook: !!getSingleRole?.module_permission?.messaging?.facebook,

            sms: getSingleRole?.module_permission?.messaging?.sms || "0",
            is_sms: !!getSingleRole?.module_permission?.messaging?.sms,

            cdrs: getSingleRole?.module_permission?.reports?.cdrs || "0",
            is_cdrs: !!getSingleRole?.module_permission?.reports?.cdrs,
            lc: getSingleRole?.module_permission?.reports?.lc || "0",
            is_lc: !!getSingleRole?.module_permission?.reports?.lc,
            missedcall: getSingleRole?.module_permission?.reports?.missedcall || "0",
            is_missedcall: !!getSingleRole?.module_permission?.reports?.missedcall,
            rr: getSingleRole?.module_permission?.reports?.rr || "0",
            is_rr: !!getSingleRole?.module_permission?.reports?.rr,
            lead_report:
                getSingleRole?.module_permission?.reports?.lead_report || "0",
            is_lead_report: !!getSingleRole?.module_permission?.reports?.lead_report,
            campaign_report:
                getSingleRole?.module_permission?.reports?.campaign_report || "0",
            is_campaign_report:
                !!getSingleRole?.module_permission?.reports?.campaign_report,
            voicebroadcast_report:
                getSingleRole?.module_permission?.reports?.voicebroadcast_report || "0",
            is_voicebroadcast_report:
                !!getSingleRole?.module_permission?.reports?.voicebroadcast_report,
            up: getSingleRole?.module_permission?.reports?.up || "0",
            is_up: getSingleRole?.module_permission?.reports?.up === "0",
            loginLogout: getSingleRole?.module_permission?.reports?.loginLogout || "0",
            is_loginLogout: !!getSingleRole?.module_permission?.reports?.loginLogout,
            voicemail: getSingleRole?.module_permission?.reports?.voicemail || "0",
            is_voicemail: !!getSingleRole?.module_permission?.reports?.voicemail,
            sticky_agent_report: getSingleRole?.module_permission?.reports?.sticky_agent_report || "0",
            is_sticky_agent_report: !!getSingleRole?.module_permission?.reports?.sticky_agent_report,
            recording: getSingleRole?.module_permission?.reports?.recording || "0",
            is_recording: !!getSingleRole?.module_permission?.reports?.recording,
            omni_channel_report: getSingleRole?.module_permission?.reports?.omni_channel_report || "0",
            is_omni_channel_report: !!getSingleRole?.module_permission?.reports?.omni_channel_report,
            csat_report: getSingleRole?.module_permission?.reports?.csat_report || "0",
            is_csat_report: !!getSingleRole?.module_permission?.reports?.csat_report,
            activity_log: getSingleRole?.module_permission?.reports?.activity_log || "0",
            is_activity_log: !!getSingleRole?.module_permission?.reports?.activity_log,


            prompts: getSingleRole?.module_permission?.settings?.prompts || "0",
            is_prompts: !!getSingleRole?.module_permission?.settings?.prompts,
            e_smtp: getSingleRole?.module_permission?.settings?.e_smtp || "0",
            is_e_smtp: !!getSingleRole?.module_permission?.settings?.e_smtp,
            telecomcircle: getSingleRole?.module_permission?.settings?.telecomcircle || "0",
            is_telecomcircle: !!getSingleRole?.module_permission?.settings?.telecomcircle,
            breakcode: getSingleRole?.module_permission?.settings?.breakcode || "0",
            is_breakcode: !!getSingleRole?.module_permission?.settings?.breakcode,
            webform: getSingleRole?.module_permission?.settings?.webform || "0",
            is_webform: !!getSingleRole?.module_permission?.settings?.webform,

            crm: getSingleRole?.module_permission?.api?.crm || "0",
            is_crm: !!getSingleRole?.module_permission?.api?.crm,
            // code: getSingleRole?.module_permission?.api?.code || "0",
            // is_code: !!getSingleRole?.module_permission?.api?.code,
            api_key: getSingleRole?.module_permission?.api?.api_key || "0",
            is_api_key: !!getSingleRole?.module_permission?.api?.api_key,
            webhooks: getSingleRole?.module_permission?.api?.webhooks || "0",
            is_webhooks: !!getSingleRole?.module_permission?.api?.webhooks,
            zoho_id: getSingleRole?.module_permission?.api?.zoho_id || "0",
            is_zoho_id: !!getSingleRole?.module_permission?.api?.zoho_id,

            google_drive: getSingleRole?.module_permission?.plugins?.google_drive || "0",
            is_google_drive: !!getSingleRole?.module_permission?.plugins?.google_drive,
            google_sheet: getSingleRole?.module_permission?.plugins?.google_sheet || "0",
            is_google_sheet: !!getSingleRole?.module_permission?.plugins?.google_sheet,

            cdrs_report: getSingleRole?.module_permission?.report_scheduling?.cdrs_report || "0",
            is_cdrs_report: !!getSingleRole?.module_permission?.report_scheduling?.cdrs_report,

            mail_schedule: getSingleRole?.module_permission?.report_scheduling?.mail_schedule || "0",
            is_mail_schedule: !!getSingleRole?.module_permission?.report_scheduling?.mail_schedule,

            email_configs: getSingleRole?.module_permission?.email?.email_configs || "0",
            is_email_configs: !!getSingleRole?.module_permission?.email?.email_configs,
            email_templates: getSingleRole?.module_permission?.email?.email_templates || "0",
            is_email_templates: !!getSingleRole?.module_permission?.email?.email_templates,
            email_channel: getSingleRole?.module_permission?.email?.email_channel || "0",
            is_email_channel: !!getSingleRole?.module_permission?.email?.email_channel,

        });
        setOpenUser(!!getSingleRole?.module_permission?.users)
        setOpenOutgoing(!!getSingleRole?.module_permission?.outgoing_rules)
        setOpenIncoming(!!getSingleRole?.module_permission?.incoming_rules)
        setOpenLeadManagement(!!getSingleRole?.module_permission?.lead_management)
        setOpenCallCenter(!!getSingleRole?.module_permission?.call_center);
        setOpenBroadcasting(!!getSingleRole?.module_permission?.broadcasting)
        setOpenMessaging(!!getSingleRole?.module_permission?.messaging)
        setOpenReports(!!getSingleRole?.module_permission?.reports);
        setOpenSettings(!!getSingleRole?.module_permission?.settings)
        setOpenApi(!!getSingleRole?.module_permission?.api)
        setOpenPlugins(!!getSingleRole?.module_permission?.plugins)
        setOpenSchedulingReport(!!getSingleRole?.module_permission?.report_scheduling)
        setOpenEmail(!!getSingleRole?.module_permission?.email)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSingleRole]);

    // Create Role & Navigate to Role Page
    const onCreateRole = async (val: any) => {
        setLoading(true);
        try {
            let payload = { ...val };
            const res: any = await dispatch(roleCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create roles Err --->", e?.message);
        }
    };

    // Update Role & Naviagate to Role Page
    const onUpdateRole = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                ...val,
                id,
            };
            const res: any = await dispatch(roleUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
                dispatch(updateSingleRoleData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Tenant Err --->", e?.message);
        }
    };

    const getIsAllChecked = (data: any[]) => {
        if (data?.length) {
            let isAllChecked = true;
            for (let index = 0; index < data.length; index++) {
                const val = data[index];
                if (!values[val.switchName]) {
                    isAllChecked = false;
                    break;
                }
            }
            return isAllChecked;
        } else {
            return false;
        }
    }

    const onSelectAllChange = (checked: boolean, data: any, setOpen: any) => {
        setOpen(true);
        for (let index = 0; index < data.length; index++) {
            const val = data[index];
            setFieldValue(val.switchName, checked);
        }
    };

    return (
        <>
            <CardForm
                id={id}
                title={id ? "Edit Tenant Roles" : "Create Tenant Roles"}
                loading={loading}
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    router.back();
                    id && dispatch(updateSingleRoleData({}));
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
                    <Input
                        name="role_name"
                        label="Role Name"
                        placeholder="Enter Name"
                        icon="UserOutline"
                        value={values.role_name}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Switch
                        className="pt-[2px]"
                        switchButtonClass="py-1.5"
                        label="Status"
                        value={values.status}
                        onClick={(value: string) => setFieldValue("status", value)}
                    />
                </div>
                {/* <div className="border-t border-dark-700 pt-7 pb-4 px-4">
                    <span className="text-sm font-bold">Basic Roles</span>
                </div>
                <div className="pb-7">
                    <div className="grid grid-cols-3">
                        <>
                            {basicRoleData.map((val: any, index: number) => {
                                return (
                                    <div className="px-4 pb-6" key={index}>
                                        <IncreaseDecreaseInput
                                            name={val.name}
                                            label={val.title}
                                            max={val?.max || 99}
                                            value={values[val.name]}
                                            onChange={(value: string) => {
                                                setFieldValue(val.name, value);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </>
                    </div>
                </div> */}
                <div className="border-t border-dark-700 pt-7 pb-4 px-4">
                    <span className="text-sm font-bold">Advance Roles</span>
                </div>
                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openUser ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Users"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(userRoleData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, userRoleData, setOpenUser)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openUser ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openUser ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenUser(!openUser)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openUser && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {userRoleData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && (val?.name !== "fc") && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            value={values[val.name]}
                                                            min={0}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {userRoleData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openOutgoing ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Outgoing Rules"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(outgoingRulesData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, outgoingRulesData, setOpenOutgoing)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openOutgoing ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openOutgoing ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenOutgoing(!openOutgoing)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openOutgoing && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {outgoingRulesData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && val?.name !== "fc" && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            value={values[val.name]}
                                                            min={0}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {outgoingRulesData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openIncoming ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Incoming Rules"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(incomingRulesData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, incomingRulesData, setOpenIncoming)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openIncoming ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openIncoming ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenIncoming(!openIncoming)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openIncoming && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {incomingRulesData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && (val?.name !== "fc") && (
                                                    // {values[val.switchName] && (val?.name !== "fc" && val?.name !== "block_ic") && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            value={values[val.name]}
                                                            min={0}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {incomingRulesData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openLeadManagement ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Lead management"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(leadManagementData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, leadManagementData, setOpenLeadManagement)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openLeadManagement ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openLeadManagement ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenLeadManagement(!openLeadManagement)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openLeadManagement && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {leadManagementData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && val?.name !== "follow_up" && val?.name !== "lead_churning" && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            value={values[val.name]}
                                                            min={0}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {leadManagementData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openCallCenter ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Contact Center"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(callCenterRoleData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, callCenterRoleData, setOpenCallCenter)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openCallCenter ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openCallCenter ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenCallCenter(!openCallCenter)}
                        />
                    </div>
                    <div className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openCallCenter && "hidden"}`}>
                        <div className="space-y-5">
                            <>
                                {callCenterRoleData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && val?.name !== "webform" && (
                                                    // {values[val.switchName] && (val?.name !== "dnc" && val?.name !== "webform" && val?.name !== "td") && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            min={0}
                                                            value={values[val.name]}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {callCenterRoleData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openBroadcasting ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Broadcasting"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(broadcastingData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, broadcastingData, setOpenBroadcasting)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openBroadcasting ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openBroadcasting ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenBroadcasting(!openBroadcasting)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openBroadcasting && "hidden"}`}
                    >
                        <div className="space-y-5">
                            <>
                                {broadcastingData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            min={0}
                                                            value={values[val.name]}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {broadcastingData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>

                {/* Messaging permission */}

                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openMessaging ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Messaging"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={openMessaging}
                            onChange={() => setOpenMessaging(!openMessaging)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openMessaging ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openMessaging ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenMessaging(!openMessaging)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openMessaging && "hidden"}`}
                    >
                        <div className="space-y-5">
                            <>
                                {messagingData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            min={0}
                                                            value={values[val.name]}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {messagingData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>

                {/* Messaging permission end */}

                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openReports ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Reports"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(reportsRolesData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, reportsRolesData, setOpenReports)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openReports ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openReports ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenReports(!openReports)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openReports && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {reportsRolesData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {reportsRolesData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openSettings ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Settings"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(settingData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, settingData, setOpenSettings)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openSettings ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openSettings ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenSettings(!openSettings)}
                        />
                    </div>
                    <div className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openSettings && "hidden"}`}>
                        <div className="space-y-5">
                            <>
                                {settingData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && (val?.name !== "e_smtp") && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            min={0}
                                                            value={values[val.name]}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {settingData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>

                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openPlugins ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Plugins"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(pluginsData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, pluginsData, setOpenPlugins)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openPlugins ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openPlugins ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenPlugins(!openPlugins)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openPlugins && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {pluginsData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {pluginsData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>

                      <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openEmail ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Email"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(emailData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, emailData, setOpenEmail)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openEmail ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openEmail ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenEmail(!openEmail)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openEmail && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {emailData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            min={0}
                                                            value={values[val.name]}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {emailData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>

                <div className="mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openSchedulingReport ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Report Scheduling"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(schedulingReportData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, schedulingReportData, setOpenSchedulingReport)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openSchedulingReport ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openSchedulingReport ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenSchedulingReport(!openSchedulingReport)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openSchedulingReport && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {schedulingReportData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {schedulingReportData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div>

                {/* <div className="mb-10 mx-4 bg-main-background border-dark-500 rounded-[40px]">
                    <div
                        className={`${openApi ? "bg-main-background text-primary" : ""
                            }  bg-main-background py-2 px-2 flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBox
                            label="Integration"
                            labelClassName="font-bold text-xs"
                            isAdmin={true}
                            checked={getIsAllChecked(apiData)}
                            onChange={(checked: boolean) => onSelectAllChange(checked, apiData, setOpenApi)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openApi ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openApi ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenApi(!openApi)}
                        />
                    </div>
                    <div
                        className={`px-6 bg-main-background py-6 transition-transform rounded-[20px] ${!openApi && "hidden"
                            }`}
                    >
                        <div className="space-y-5">
                            <>
                                {apiData
                                    ?.filter((val) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 space-x-10 ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setValues({
                                                                ...values,
                                                                [val.name]: 0,
                                                                [val.switchName]: e.target.checked,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {values[val.switchName] && (val?.name !== "fc" && val?.name !== "zoho_id" && val?.name !== "webhooks") && (
                                                    <div>
                                                        <IncreaseDecreaseInput
                                                            name={val.name}
                                                            value={values[val.name]}
                                                            min={0}
                                                            onChange={(value: string) => {
                                                                setFieldValue(val.name, value);
                                                            }}
                                                            isIconSuccess
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {apiData
                                    ?.filter((val) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-2 space-x-10">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-txt-primary font-bold text-xs">
                                                        {val.title}
                                                    </label>
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(
                                                                `${val.switchName}`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        </div>
                    </div>
                </div> */}

            </CardForm>
        </>
    );
};

export default CreateEditRolesForm;

