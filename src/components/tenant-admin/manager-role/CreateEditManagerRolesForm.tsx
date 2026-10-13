"use client";
// PROJECT IMPORTS
import { Danger, Success } from "@/redux/services/toasterServices";
import {
    CheckBoxv2,
    Input,
    LabelSwitch,
    Select,
    Switch,
} from "@/components/forms";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    updateSingleRoleData,
    roleCreate,
    roleUpdate,
    useSingleRoleData,
} from "@/redux/slice/tenant-admin/managerRoleSlice";

import { CardForm, Icon } from "@/components/ui-components";
import { useParams, useRouter } from "next/navigation";
import { useLayoutEffect, useState, useEffect } from "react";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { InitialValueType } from "@/types/tenant-admin/managerRolesTypes";

// DATA IMPORT
import {
    apiData,
    broadcastingData,
    callCenterRoleData,
    incomingRulesData,
    leadManagementData,
    outgoingRulesData,
    reportsRolesData,
    userRoleData,
    settingData,

} from "./mock";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import {
    sipOptionsGet,
    useSipOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
    outboundOptionsGet,
    useOutboundOptions,
} from "@/redux/slice/tenant-admin/outboundSlice";
import {
    inboundOptionsGet,
    useInboundOptions,
} from "@/redux/slice/tenant-admin/inboundSlice";
import {
    blendedOptionsGet,
    useBlendedOptions,
} from "@/redux/slice/tenant-admin/blendedSlice";
import { useSideBarData } from "@/redux/slice/commonSlice";

/* ============================== CREATE & EDIT MANAGER ROLES FORM ============================== */

const CreateEditManagerRolesForm = () => {
    const { id }: any = useParams();
    const router = useRouter();
    const dispatch: any = useAppDispatch();
    const getSingleRole = useSingleRoleData();
    const userOptions = useUserOptions();
    const sipOptions = useSipOptions();
    const outboundCampaignOptions = useOutboundOptions();
    const inboundCampaignOptions = useInboundOptions();
    const blendedCampaignOptions = useBlendedOptions();
    const sideBarData = useSideBarData();

    const [loading, setLoading] = useState<boolean>(false);
    const [openApi, setOpenApi] = useState<boolean>(false);
    const [openUser, setOpenUser] = useState<boolean>(false);
    const [openOutgoing, setOpenOutgoing] = useState<boolean>(false);
    const [openIncoming, setOpenIncoming] = useState<boolean>(false);
    const [openLeadManagement, setOpenLeadManagement] = useState<boolean>(false);
    const [openCallCenter, setOpenCallCenter] = useState<boolean>(false);
    const [openBroadcasting, setOpenBroadcasting] = useState<boolean>(false);
    const [openSetting, setOpenSetting] = useState<boolean>(false);
    const [openReports, setOpenReports] = useState<boolean>(false);

    const [userRoleDatas, setUserRoleDatas] = useState<any>();
    const [outgoingRulesDatas, setOutgoingRulesDatas] = useState<any>();
    const [incomingRulesDatas, setIncomingRulesDatas] = useState<any>();
    const [leadManagementDatas, setLeadManagementDatas] = useState<any>();
    const [callCenterRoleDatas, setCallCenterRoleDatas] = useState<any>();
    const [broadcastingDatas, setBroadcastingDatas] = useState<any>();
    const [reportsRolesDatas, setReportsRolesDatas] = useState<any>();
    const [settingDatas, setSettingDatas] = useState<any>();
    const [apiDatas, setApiDatas] = useState<any>();

    useEffect(() => {
        setUserRoleDatas(checkData("users", userRoleData));
        setOutgoingRulesDatas(checkData("outgoing_rules", outgoingRulesData));
        setIncomingRulesDatas(checkData("incoming_rules", incomingRulesData));
        setLeadManagementDatas(checkData("lead_management", leadManagementData));
        setCallCenterRoleDatas(checkData("call_center", callCenterRoleData));
        setBroadcastingDatas(checkData("broadcasting", broadcastingData));
        setReportsRolesDatas(checkData("reports", reportsRolesData));
        setSettingDatas(checkData("settings", settingData));
        setApiDatas(checkData("api", apiData));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sideBarData]);

    const checkData = (name: string, roleData: any) => {
        let data = sideBarData?.sideBarData?.filter((x: any) => x.name === name);
        let filterData: any = [];
        data?.[0]?.subItems?.map((val: any) => filterData?.push(val?.name));
        let final = roleData?.filter((x: any) => filterData?.includes(x.name));
        return [...final];
    };

    const validationSchema = Yup.object<any>({
        role_name: Yup.string().required("Please Enter Role Name"),
    });

    const initialValues: InitialValueType = {
        role_name: "",
        status: "0",

        //User Module
        user: "0",
        is_user: false,
        is_create_user: false,
        is_list_user: true,
        is_edit_user: false,
        is_delete_user: false,
        is_add_user: false,
        add_user_value: [],

        //User Group Module
        user_group: "0",
        is_user_group: false,
        is_create_user_group: false,
        is_list_user_group: true,
        is_edit_user_group: false,
        is_delete_user_group: false,

        //User Role Module
        user_role: "0",
        is_user_role: false,
        is_create_user_role: false,
        is_list_user_role: true,
        is_edit_user_role: false,
        is_delete_user_role: false,

        //Extension Module
        extension: "0",
        is_extension: false,
        is_create_extension: false,
        is_list_extension: true,
        is_edit_extension: false,
        is_delete_extension: false,
        is_add_extension: false,
        add_extension_value: [],

        //Trunk Module
        trunk: "0",
        is_trunk: false,
        is_create_trunk: false,
        is_list_trunk: true,
        is_edit_trunk: false,
        is_delete_trunk: false,

        //Outgoing Rules Module
        og_rules: "0",
        is_og_rules: false,
        is_create_og_rules: false,
        is_list_og_rules: true,
        is_edit_og_rules: false,
        is_delete_og_rules: false,

        //Caller ID Group Module
        call_id_group: "0",
        is_call_id_group: false,
        is_create_call_id_group: false,
        is_list_call_id_group: true,
        is_edit_call_id_group: false,
        is_delete_call_id_group: false,

        //DID Module
        did: "0",
        is_did: false,
        is_create_did: false,
        is_list_did: true,
        is_edit_did: false,
        is_delete_did: false,

        //IP Mapping Module
        ip_mapping: "0",
        is_ip_mapping: false,
        is_create_ip_mapping: false,
        is_list_ip_mapping: true,
        is_edit_ip_mapping: false,
        is_delete_ip_mapping: false,

        //Click To Call Module
        click_to_Call: "0",
        is_click_to_Call: false,
        is_create_click_to_Call: false,
        is_list_click_to_Call: true,
        is_edit_click_to_Call: false,
        is_delete_click_to_Call: false,

        //Ring Group Module
        rg: "0",
        is_rg: false,
        is_create_rg: false,
        is_list_rg: true,
        is_edit_rg: false,
        is_delete_rg: false,

        //IVR Module
        ivr: "0",
        is_ivr: false,
        is_create_ivr: false,
        is_list_ivr: true,
        is_edit_ivr: false,
        is_delete_ivr: false,

        //Time Condition Module
        tc: "0",
        is_tc: false,
        is_create_tc: false,
        is_list_tc: true,
        is_edit_tc: false,
        is_delete_tc: false,

        //Conference Module
        cf: "0",
        is_cf: false,
        is_create_cf: false,
        is_list_cf: true,
        is_edit_cf: false,
        is_delete_cf: false,

        //Call Queue Module
        cq: "0",
        is_cq: false,
        is_create_cq: false,
        is_list_cq: true,
        is_edit_cq: false,
        is_delete_cq: false,

        //Feature Code
        fc: "0",
        is_fc: false,
        is_create_fc: false,
        is_list_fc: true,
        is_edit_fc: false,
        is_delete_fc: false,

        //Block Inbound Calls
        block_ic: "0",
        is_block_ic: false,
        is_create_block_ic: false,
        is_list_block_ic: true,
        is_edit_block_ic: false,
        is_delete_block_ic: false,

        //Lead Management Module
        leads: "0",
        is_leads: false,
        is_create_leads: false,
        is_list_leads: true,
        is_edit_leads: false,
        is_delete_leads: false,

        //Lead Group Module
        lead_group: "0",
        is_lead_group: false,
        is_create_lead_group: false,
        is_list_lead_group: true,
        is_edit_lead_group: false,
        is_delete_lead_group: false,

        //Follow Up Module
        follow_up: "0",
        is_follow_up: false,
        is_create_follow_up: false,
        is_list_follow_up: true,
        is_edit_follow_up: false,
        is_delete_follow_up: false,

        //Custom Fields Module

        custom_fields: "0",
        is_custom_fields: false,
        is_create_custom_fields: false,
        is_list_custom_fields: true,
        is_edit_custom_fields: false,
        is_delete_custom_fields: false,

        //Outbound Campaign Module
        oc: "0",
        is_oc: false,
        is_create_oc: false,
        is_list_oc: true,
        is_edit_oc: false,
        is_delete_oc: false,
        is_add_oc: false,
        add_oc_value: [],

        //Inbound Campaign Module
        ic: "0",
        is_ic: false,
        is_create_ic: false,
        is_list_ic: true,
        is_edit_ic: false,
        is_delete_ic: false,
        is_add_ic: false,
        add_ic_value: [],

        //Blended Campaign Module
        bc: "0",
        is_bc: false,
        is_create_bc: false,
        is_list_bc: true,
        is_edit_bc: false,
        is_delete_bc: false,
        is_add_bc: false,
        add_bc_value: [],

        //Disposition Module
        td: "0",
        is_td: false,
        is_create_td: false,
        is_list_td: true,
        is_edit_td: false,
        is_delete_td: false,

        //DNC Module
        dnc: "0",
        is_dnc: false,
        is_create_dnc: false,
        is_list_dnc: true,
        is_edit_dnc: false,
        is_delete_dnc: false,


        webform: "0",
        is_webform: false,
        is_create_webform: false,
        is_list_webform: true,
        is_edit_webform: false,
        is_delete_webform: false,

        //Voice Broadcasting Module
        vb: "0",
        is_vb: false,
        is_create_vb: false,
        is_list_vb: true,
        is_edit_vb: false,
        is_delete_vb: false,

        //Cdrs Report Module
        cdrs: "0",
        is_cdrs: false,
        is_list_cdrs: true,

        //Live Calls Module
        lc: "0",
        is_lc: false,
        is_list_lc: true,

        //Realtime Report
        rr: "0",
        is_rr: false,
        is_list_rr: true,

        //Lead Report Module
        lead_report: "0",
        is_lead_report: false,
        is_list_lead_report: true,

        //Campaign Report Module
        campaign_report: "0",
        is_campaign_report: false,
        is_list_campaign_report: true,

        //User Perfomance Report Module
        up: "0",
        is_up: false,
        is_list_up: true,

        //Voicemail Report Module
        voicemail: "0",
        is_voicemail: false,
        is_list_voicemail: true,

        //Recording Module
        recording: "0",
        is_recording: false,
        is_list_recording: true,

        //Voicebroadcast Report Module
        voicebroadcast_report: "0",
        is_voicebroadcast_report: false,
        is_list_voicebroadcast_report: true,

        //Missed Call report Module
        missedcall: "0",
        is_missedcall: false,
        is_list_missedcall: true,

        //Missed Call report Module
        loginLogout: "0",
        is_loginLogout: false,
        is_list_loginLogout: true,

        //Greeting Module
        prompts: "0",
        is_prompts: false,
        is_list_prompts: true,
        is_create_prompts: false,
        is_edit_prompts: false,
        is_delete_prompts: false,

        e_smtp: "0",
        is_e_smtp: false,
        is_list_e_smtp: true,
        // is_create_e_smtp: false,
        // is_edit_e_smtp: false,
        // is_delete_e_smtp: false,

        telecomcircle: "0",
        is_telecomcircle: false,
        is_create_telecomcircle: false,
        is_list_telecomcircle: true,
        is_edit_telecomcircle: false,
        is_delete_telecomcircle: false,

        breakcode: "0",
        is_breakcode: false,
        is_list_breakcode: true,
        is_create_breakcode: false,
        is_edit_breakcode: false,
        is_delete_breakcode: false,



        crm: "0",
        is_crm: false,
        is_create_crm: false,
        is_list_crm: true,
        is_edit_crm: false,
        is_delete_crm: false,


        api_key: "0",
        is_api_key: false,
        is_create_api_key: false,
        is_list_api_key: true,
        is_edit_api_key: false,
        is_delete_api_key: false,

        webhooks: "0",
        is_webhooks: false,
        is_create_webhooks: false,
        is_list_webhooks: true,
        is_edit_webhooks: false,
        is_delete_webhooks: false,

    };

    const onSubmit = (values: any) => {
        let payload: any = {};
        payload = {
            role_name: values.role_name,
            status: values.status,
            advanced_roles: {},
        };

        let userObj;
        payload["advanced_roles"] = {};

        //Add user section data in payload
        const addUserArray = ["user", "user_group", "user_role", "extension"];

        if (openUser && !!userRoleDatas?.length) {
            addUserArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };
                    if (val === "user")
                        userObj = { ...userObj, "user-uuids": values.add_user_value };
                    if (val === "extension")
                        userObj = {
                            ...userObj,
                            "extension-uuids": values.add_extension_value,
                        };
                    if (val == "user_group") val = "user-group";
                    if (val == "user_role") val = "user-role";
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        //Add outgoing rules section data in payload
        const addOutgoingRulesArray = ["trunk", "og_rules", "call_id_group"];

        if (openOutgoing && !!outgoingRulesDatas?.length) {
            addOutgoingRulesArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };
                    if (val == "og_rules") val = "outgoing-rules";
                    if (val == "call_id_group") val = "caller-id-group";
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        //Add incoming rules data in payload
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

        if (openIncoming && !!incomingRulesDatas?.length) {
            addIncomingArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };
                    switch (val) {
                        case "ip_mapping":
                            val = "ip-mapping";
                            break;
                        case "click_to_Call":
                            val = "click-to-call";
                            break;
                        case "rg":
                            val = "ringgroup";
                            break;
                        case "tc":
                            val = "timecondition";
                            break;
                        case "cf":
                            val = "conference";
                            break;
                        case "cq":
                            val = "call-queue";
                            break;
                        case "fc":
                            val = "feature-code";
                            break;
                        case "block_ic":
                            val = "block-inbound-campaign";
                            break;
                    }
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        //Add lead management section data into payload
        const addLmArray = ["leads", "lead_group", "follow_up", "custom_fields"];

        if (openLeadManagement && !!leadManagementDatas?.length) {
            addLmArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };
                    if (val == "lead_group") val = "lead-group";
                    if (val == "follow_up") val = "follow-up";
                    if (val == "custom_fields") val = "custom-fields";
                    if (val == "leads") val = "lead-management";
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        //Add contact center section data in payload
        const addCcArray = ["oc", "ic", "bc", "td", "dnc", "webform"];

        if (openCallCenter && !!callCenterRoleDatas?.length) {
            addCcArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };

                    switch (val) {
                        case "oc":
                            val = "outbound-campaign";
                            userObj = {
                                ...userObj,
                                "outbound-campaign-uuids": values.add_oc_value,
                            };
                            break;
                        case "ic":
                            val = "inbound-campaign";
                            userObj = {
                                ...userObj,
                                "inbound-campaign-uuids": values.add_ic_value,
                            };
                            break;
                        case "bc":
                            val = "blended-campaign";
                            userObj = {
                                ...userObj,
                                "blended-campaign-uuids": values.add_bc_value,
                            };
                            break;
                        case "td":
                            val = "disposition";
                            break;
                    }
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        //Add voicebroadcast section data in payload
        const addBcArray = ["vb"];

        if (openBroadcasting && !!broadcastingDatas?.length) {
            addBcArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };
                    if (val == "vb") val = "voice-broadcast";
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        //Add cdrs section data in payload
        const addReportsArray = [
            "cdrs",
            "lc",
            "rr",
            "lead_report",
            "campaign_report",
            "up",
            "voicemail",
            "recording",
            "voicebroadcast_report",
            "missedcall",
            "loginLogout",
            "activity_log"
        ];

        if (openReports && !!reportsRolesDatas?.length) {
            addReportsArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                    };
                    switch (val) {
                        case "lc":
                            val = "live-calls";
                            break;
                        case "td":
                            val = "disposition";
                            break;
                        case "up":
                            val = "user_performance_report";
                            break;
                        case "voicebroadcast_report":
                            val = "voicebroadcast_report";
                            break;
                        case "missedcall":
                            val = "missedcall";
                            break;
                        case "loginLogout":
                            val = "loginLogout";
                            break;
                        case "activity_log":
                            val = "activity_log";
                            break;
                    }
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        //Add voicebroadcast section data in payload
        const addSettingArray = ["prompts", "e_smtp", "telecomcircle", "breakcode"];

        if (openSetting && !!settingDatas?.length) {
            addSettingArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };
                    switch (val) {
                        case "prompts":
                            val = "greeting";
                            break;
                        case "e_smtp":
                            val = "mail-configuration";
                            break;
                        case "telecomcircle":
                            val = "telecomcircle";
                            break;
                        case "breakcode":
                            val = "breakcode";
                            break;
                        // case "webform":
                        //     val = "webform";
                        //     break;    
                    }
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }


        //Add lead management section data into payload
        const addApiArray = ["crm", "api_key", "webhooks"];

        if (openApi && !!apiDatas?.length) {
            addApiArray.forEach((val: any) => {
                if (values[`is_${val}`]) {
                    userObj = {
                        create: values[`is_create_${val}`] == true ? "0" : "1",
                        list: values[`is_list_${val}`] == true ? "0" : "1",
                        edit: values[`is_edit_${val}`] == true ? "0" : "1",
                        delete: values[`is_delete_${val}`] == true ? "0" : "1",
                    };
                    if (val == "crm") val = "crm";
                    if (val == "api_key") val = "api_key";
                    if (val == "webhooks") val = "webhooks";
                    payload["advanced_roles"][val] = userObj;
                }
            });
        }

        console.log("payload", payload);

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

    useEffect(() => {
        onGetSipOptions();
        onGetUserOptions();
        onGetOutboundOptions();
        OnInboundOptionsGet();
        OnBlendedOptionsGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (!id) return;
        const checkValue = getSingleRole?.module_permission;
        setValues({
            ...values,
            role_name: getSingleRole?.role_name || "",
            status: getSingleRole?.status || "0",

            //User Module
            user: checkValue?.user || "0",
            is_user: !!checkValue?.user,
            is_create_user: checkValue?.user?.create === "0" ? true : false,
            is_list_user: checkValue?.user?.list == "1" ? false : true,
            is_edit_user: checkValue?.user?.edit === "0" ? true : false,
            is_delete_user: checkValue?.user?.delete === "0" ? true : false,
            is_add_user: checkValue?.user?.["user-uuids"].length ? true : false,
            add_user_value: checkValue?.user?.["user-uuids"].length
                ? checkValue?.user?.["user-uuids"]
                : [],

            //User Group Module
            user_group: checkValue?.["user-group"] || "0",
            is_user_group: !!checkValue?.["user-group"],
            is_create_user_group:
                checkValue?.["user-group"]?.create === "0" ? true : false,
            is_list_user_group:
                checkValue?.["user-group"]?.list === "0" ? true : false,
            is_edit_user_group:
                checkValue?.["user-group"]?.edit === "0" ? true : false,
            is_delete_user_group:
                checkValue?.["user-group"]?.delete === "0" ? true : false,

            //User Role Module
            user_role: checkValue?.["user-role"] || "0",
            is_user_role: !!checkValue?.["user-role"],
            is_create_user_role:
                checkValue?.["user-role"]?.create === "0" ? true : false,
            is_list_user_role: checkValue?.["user-role"]?.list === "0" ? true : false,
            is_edit_user_role: checkValue?.["user-role"]?.edit === "0" ? true : false,
            is_delete_user_role:
                checkValue?.["user-role"]?.delete === "0" ? true : false,

            //Extension Module
            extension: checkValue?.extension || "0",
            is_extension: !!checkValue?.extension,
            is_create_extension: checkValue?.extension?.create === "0" ? true : false,
            is_list_extension: checkValue?.extension?.list === "0" ? true : false,
            is_edit_extension: checkValue?.extension?.edit === "0" ? true : false,
            is_delete_extension: checkValue?.extension?.delete === "0" ? true : false,
            is_add_extension: checkValue?.extension?.["extension-uuids"].length
                ? true
                : false,
            add_extension_value: checkValue?.extension?.["extension-uuids"].length
                ? checkValue?.extension?.["extension-uuids"]
                : [],

            //Trunk Module
            trunk: checkValue?.trunk ? "0" : "1",
            is_trunk: !!checkValue?.trunk ? true : false,
            is_create_trunk: checkValue?.trunk?.create === "0" ? true : false,
            is_list_trunk: checkValue?.trunk?.list === "0" ? true : false,
            is_edit_trunk: checkValue?.trunk?.edit === "0" ? true : false,
            is_delete_trunk: checkValue?.trunk?.delete === "0" ? true : false,

            //Outgoing Rules Module
            og_rules:
                checkValue?.["outgoing-rules"] !== undefined
                    ? checkValue?.["outgoing-rules"]
                    : "0",
            is_og_rules: checkValue?.["outgoing-rules"] !== undefined ? true : false,
            is_create_og_rules:
                checkValue?.["outgoing-rules"] !== undefined
                    ? checkValue?.["outgoing-rules"]["create"] === "0"
                        ? true
                        : false
                    : false,
            is_list_og_rules: checkValue?.["outgoing-rules"]
                ? checkValue?.["outgoing-rules"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_og_rules: checkValue?.["outgoing-rules"]
                ? checkValue?.["outgoing-rules"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_og_rules: checkValue?.["outgoing-rules"]
                ? checkValue?.["outgoing-rules"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Caller ID Group Module
            call_id_group:
                checkValue?.["caller-id-group"] !== undefined
                    ? checkValue?.["caller-id-group"]
                    : "0",
            is_call_id_group:
                checkValue?.["caller-id-group"] !== undefined ? true : false,
            is_create_call_id_group: checkValue?.["caller-id-group"]
                ? checkValue?.["caller-id-group"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_call_id_group: checkValue?.["caller-id-group"]
                ? checkValue?.["caller-id-group"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_call_id_group: checkValue?.["caller-id-group"]
                ? checkValue?.["caller-id-group"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_call_id_group: checkValue?.["caller-id-group"]
                ? checkValue?.["caller-id-group"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //DID Module
            did: checkValue?.did ? "0" : "1",
            is_did: !!checkValue?.did,
            is_create_did: checkValue?.did?.create === "0" ? true : false,
            is_list_did: checkValue?.did?.list === "0" ? true : false,
            is_edit_did: checkValue?.did?.edit === "0" ? true : false,
            is_delete_did: checkValue?.did?.delete === "0" ? true : false,

            //IP Mapping Module
            ip_mapping:
                checkValue?.["ip-mapping"] !== undefined
                    ? checkValue?.["ip-mapping"]
                    : "0",
            is_ip_mapping: checkValue?.["ip-mapping"] !== undefined ? true : false,
            is_create_ip_mapping:
                checkValue?.["ip-mapping"] != undefined
                    ? checkValue?.["ip-mapping"]["create"] === "0"
                        ? true
                        : false
                    : false,
            is_list_ip_mapping: checkValue?.["ip-mapping"]
                ? checkValue?.["ip-mapping"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_ip_mapping: checkValue?.["ip-mapping"]
                ? checkValue?.["ip-mapping"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_ip_mapping: checkValue?.["ip-mapping"]
                ? checkValue?.["ip-mapping"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Click To Call Module
            click_to_Call:
                checkValue?.["click-to-call"] !== undefined
                    ? checkValue?.["click-to-call"]
                    : "0",
            is_click_to_Call:
                checkValue?.["click-to-call"] !== undefined ? true : false,
            is_create_click_to_Call: checkValue?.["click-to-call"]
                ? checkValue?.["click-to-call"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_click_to_Call: checkValue?.["click-to-call"]
                ? checkValue?.["click-to-call"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_click_to_Call: checkValue?.["click-to-call"]
                ? checkValue?.["click-to-call"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_click_to_Call: checkValue?.["click-to-call"]
                ? checkValue?.["click-to-call"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Ringgroup Module
            rg: checkValue?.ringgroup !== undefined ? checkValue?.ringgroup : "0",
            is_rg: checkValue?.ringgroup !== undefined ? true : false,
            is_create_rg: checkValue?.ringgroup
                ? checkValue?.ringgroup.create === "0"
                    ? true
                    : false
                : false,
            is_list_rg: checkValue?.ringgroup
                ? checkValue?.ringgroup.list === "0"
                    ? true
                    : false
                : false,
            is_edit_rg: checkValue?.ringgroup
                ? checkValue?.ringgroup.edit === "0"
                    ? true
                    : false
                : false,
            is_delete_rg: checkValue?.ringgroup
                ? checkValue?.ringgroup.delete === "0"
                    ? true
                    : false
                : false,

            //Ivr Module
            ivr: checkValue?.ivr !== undefined ? checkValue?.ivr : "0",
            is_ivr: checkValue?.ivr !== undefined ? true : false,
            is_create_ivr: checkValue?.ivr
                ? checkValue?.ivr.create === "0"
                    ? true
                    : false
                : false,
            is_list_ivr: checkValue?.ivr
                ? checkValue?.ivr.list === "0"
                    ? true
                    : false
                : false,
            is_edit_ivr: checkValue?.ivr
                ? checkValue?.ivr.edit === "0"
                    ? true
                    : false
                : false,
            is_delete_ivr: checkValue?.ivr
                ? checkValue?.ivr.delete === "0"
                    ? true
                    : false
                : false,

            //Timecondition Module
            tc:
                checkValue?.timecondition !== undefined
                    ? checkValue?.timecondition
                    : "0",
            is_tc: checkValue?.timecondition !== undefined ? true : false,
            is_create_tc: checkValue?.timecondition
                ? checkValue?.timecondition.create === "0"
                    ? true
                    : false
                : false,
            is_list_tc: checkValue?.timecondition
                ? checkValue?.timecondition.list === "0"
                    ? true
                    : false
                : false,
            is_edit_tc: checkValue?.timecondition
                ? checkValue?.timecondition.edit === "0"
                    ? true
                    : false
                : false,
            is_delete_tc: checkValue?.timecondition
                ? checkValue?.timecondition.delete === "0"
                    ? true
                    : false
                : false,

            //Conference Module
            cf: checkValue?.conference !== undefined ? checkValue?.conference : "0",
            is_cf: checkValue?.conference !== undefined ? true : false,
            is_create_cf: checkValue?.conference
                ? checkValue?.conference.create === "0"
                    ? true
                    : false
                : false,
            is_list_cf: checkValue?.conference
                ? checkValue?.conference.list === "0"
                    ? true
                    : false
                : false,
            is_edit_cf: checkValue?.conference
                ? checkValue?.conference.edit === "0"
                    ? true
                    : false
                : false,
            is_delete_cf: checkValue?.conference
                ? checkValue?.conference.delete === "0"
                    ? true
                    : false
                : false,

            //Call Queue Module
            cq:
                checkValue?.["call-queue"] !== undefined
                    ? checkValue?.["call-queue"]
                    : "0",
            is_cq: checkValue?.["call-queue"] !== undefined ? true : false,
            is_create_cq: checkValue?.["call-queue"]
                ? checkValue?.["call-queue"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_cq: checkValue?.["call-queue"]
                ? checkValue?.["call-queue"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_cq: checkValue?.["call-queue"]
                ? checkValue?.["call-queue"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_cq: checkValue?.["call-queue"]
                ? checkValue?.["call-queue"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Feature Code Module
            fc:
                checkValue?.["feature-code"] !== undefined
                    ? checkValue?.["feature-code"]
                    : "0",
            is_fc: checkValue?.["feature-code"] !== undefined ? true : false,
            is_create_fc: checkValue?.["feature-code"]
                ? checkValue?.["feature-code"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_fc: checkValue?.["feature-code"]
                ? checkValue?.["feature-code"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_fc: checkValue?.["feature-code"]
                ? checkValue?.["feature-code"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_fc: checkValue?.["feature-code"]
                ? checkValue?.["feature-code"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Block Inbound Campaign Module
            block_ic:
                checkValue?.["block-inbound-campaign"] !== undefined
                    ? checkValue?.["block-inbound-campaign"]
                    : "0",
            is_block_ic:
                checkValue?.["block-inbound-campaign"] !== undefined ? true : false,
            is_create_block_ic: checkValue?.["block-inbound-campaign"]
                ? checkValue?.["block-inbound-campaign"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_block_ic: checkValue?.["block-inbound-campaign"]
                ? checkValue?.["block-inbound-campaign"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_block_ic: checkValue?.["block-inbound-campaign"]
                ? checkValue?.["block-inbound-campaign"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_block_ic: checkValue?.["block-inbound-campaign"]
                ? checkValue?.["block-inbound-campaign"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Lead Managemet Module
            leads:
                checkValue?.["lead-management"] !== undefined
                    ? checkValue?.["lead-management"]
                    : "0",
            is_leads: checkValue?.["lead-management"] !== undefined ? true : false,
            is_create_leads: checkValue?.["lead-management"]
                ? checkValue?.["lead-management"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_leads: checkValue?.["lead-management"]
                ? checkValue?.["lead-management"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_leads: checkValue?.["lead-management"]
                ? checkValue?.["lead-management"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_leads: checkValue?.["lead-management"]
                ? checkValue?.["lead-management"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Lead Group Module
            lead_group:
                checkValue?.["lead-group"] !== undefined
                    ? checkValue?.["lead-group"]
                    : "0",
            is_lead_group: checkValue?.["lead-group"] !== undefined ? true : false,
            is_create_lead_group: checkValue?.["lead-group"]
                ? checkValue?.["lead-group"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_lead_group: checkValue?.["lead-group"]
                ? checkValue?.["lead-group"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_lead_group: checkValue?.["lead-group"]
                ? checkValue?.["lead-group"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_lead_group: checkValue?.["lead-group"]
                ? checkValue?.["lead-group"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Follow Up Module
            follow_up:
                checkValue?.["follow-up"] !== undefined
                    ? checkValue?.["follow-up"]
                    : "0",
            is_follow_up: checkValue?.["follow-up"] !== undefined ? true : false,
            is_create_follow_up: checkValue?.["follow-up"]
                ? checkValue?.["follow-up"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_follow_up: checkValue?.["follow-up"]
                ? checkValue?.["follow-up"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_follow_up: checkValue?.["follow-up"]
                ? checkValue?.["follow-up"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_follow_up: checkValue?.["follow-up"]
                ? checkValue?.["follow-up"]["delete"] === "0"
                    ? true
                    : false
                : false,

            //Custom Fields Module
            custom_fields:
                checkValue?.["custom-fields"] !== undefined
                    ? checkValue?.["custom-fields"]
                    : "0",
            is_custom_fields: checkValue?.["custom-fields"] !== undefined ? true : false,
            is_create_custom_fields: checkValue?.["custom-fields"]
                ? checkValue?.["custom-fields"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_custom_fields: checkValue?.["custom-fields"]
                ? checkValue?.["custom-fields"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_custom_fields: checkValue?.["custom-fields"]
                ? checkValue?.["custom-fields"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_custom_fields: checkValue?.["custom-fields"]
                ? checkValue?.["custom-fields"]["delete"] === "0"
                    ? true
                    : false
                : false,


            //Outbound Campaign Module
            oc:
                checkValue?.["outbound-campaign"] !== undefined
                    ? checkValue?.["outbound-campaign"]
                    : "0",
            is_oc: checkValue?.["outbound-campaign"] !== undefined ? true : false,
            is_create_oc: checkValue?.["outbound-campaign"]
                ? checkValue?.["outbound-campaign"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_oc: checkValue?.["outbound-campaign"]
                ? checkValue?.["outbound-campaign"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_oc: checkValue?.["outbound-campaign"]
                ? checkValue?.["outbound-campaign"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_oc: checkValue?.["outbound-campaign"]
                ? checkValue?.["outbound-campaign"]["delete"] === "0"
                    ? true
                    : false
                : false,
            is_add_oc: checkValue?.["outbound-campaign"]?.["outbound-campaign-uuids"]
                .length
                ? true
                : false,
            add_oc_value: checkValue?.["outbound-campaign"]?.[
                "outbound-campaign-uuids"
            ].length
                ? checkValue?.["outbound-campaign"]?.["outbound-campaign-uuids"]
                : [],

            //Inbound Campaign Module
            ic:
                checkValue?.["inbound-campaign"] !== undefined
                    ? checkValue?.["inbound-campaign"]
                    : "0",
            is_ic: checkValue?.["inbound-campaign"] !== undefined ? true : false,
            is_create_ic: checkValue?.["inbound-campaign"]
                ? checkValue?.["inbound-campaign"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_ic: checkValue?.["inbound-campaign"]
                ? checkValue?.["inbound-campaign"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_ic: checkValue?.["inbound-campaign"]
                ? checkValue?.["inbound-campaign"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_ic: checkValue?.["inbound-campaign"]
                ? checkValue?.["inbound-campaign"]["delete"] === "0"
                    ? true
                    : false
                : false,
            is_add_ic: checkValue?.["inbound-campaign"]?.["inbound-campaign-uuids"]
                .length
                ? true
                : false,
            add_ic_value: checkValue?.["inbound-campaign"]?.["inbound-campaign-uuids"]
                .length
                ? checkValue?.["inbound-campaign"]?.["inbound-campaign-uuids"]
                : [],

            //Blended Campaign Module
            bc:
                checkValue?.["blended-campaign"] !== undefined
                    ? checkValue?.["blended-campaign"]
                    : "0",
            is_bc: checkValue?.["blended-campaign"] !== undefined ? true : false,
            is_create_bc: checkValue?.["blended-campaign"]
                ? checkValue?.["blended-campaign"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_bc: checkValue?.["blended-campaign"]
                ? checkValue?.["blended-campaign"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_bc: checkValue?.["blended-campaign"]
                ? checkValue?.["blended-campaign"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_bc: checkValue?.["blended-campaign"]
                ? checkValue?.["blended-campaign"]["delete"] === "0"
                    ? true
                    : false
                : false,
            is_add_bc: checkValue?.["blended-campaign"]?.["blended-campaign-uuids"]
                .length
                ? true
                : false,
            add_bc_value: checkValue?.["blended-campaign"]?.["blended-campaign-uuids"]
                .length
                ? checkValue?.["blended-campaign"]?.["blended-campaign-uuids"]
                : [],

            //Disposition Module
            td: checkValue?.disposition !== undefined ? checkValue?.disposition : "0",
            is_td: checkValue?.disposition !== undefined ? true : false,
            is_create_td: checkValue?.disposition
                ? checkValue?.disposition.create === "0"
                    ? true
                    : false
                : false,
            is_list_td: checkValue?.disposition
                ? checkValue?.disposition.list === "0"
                    ? true
                    : false
                : false,
            is_edit_td: checkValue?.disposition
                ? checkValue?.disposition.edit === "0"
                    ? true
                    : false
                : false,
            is_delete_td: checkValue?.disposition
                ? checkValue?.disposition.delete === "0"
                    ? true
                    : false
                : false,

            //DNC Module
            dnc: checkValue?.dnc !== undefined ? checkValue?.dnc : "0",
            is_dnc: checkValue?.dnc !== undefined ? true : false,
            is_create_dnc: checkValue?.dnc
                ? checkValue?.dnc.create === "0"
                    ? true
                    : false
                : false,
            is_list_dnc: checkValue?.dnc
                ? checkValue?.dnc.list === "0"
                    ? true
                    : false
                : false,
            is_edit_dnc: checkValue?.dnc
                ? checkValue?.dnc.edit === "0"
                    ? true
                    : false
                : false,
            is_delete_dnc: checkValue?.dnc
                ? checkValue?.dnc.delete === "0"
                    ? true
                    : false
                : false,

            //Voicebroadcast Module
            vb:
                checkValue?.["voice-broadcast"] !== undefined
                    ? checkValue?.["voice-broadcast"]
                    : "0",
            is_vb: checkValue?.["voice-broadcast"] !== undefined ? true : false,
            is_create_vb: checkValue?.["voice-broadcast"]
                ? checkValue?.["voice-broadcast"]["create"] === "0"
                    ? true
                    : false
                : false,
            is_list_vb: checkValue?.["voice-broadcast"]
                ? checkValue?.["voice-broadcast"]["list"] === "0"
                    ? true
                    : false
                : false,
            is_edit_vb: checkValue?.["voice-broadcast"]
                ? checkValue?.["voice-broadcast"]["edit"] === "0"
                    ? true
                    : false
                : false,
            is_delete_vb: checkValue?.["voice-broadcast"]
                ? checkValue?.["voice-broadcast"]["delete"] === "0"
                    ? true
                    : false
                : false,


            //Cdrs Report Module
            cdrs: checkValue?.cdrs || "0",
            is_cdrs: !!checkValue?.cdrs,
            is_list_cdrs: checkValue?.cdrs
                ? checkValue?.cdrs.list === "0"
                    ? true
                    : false
                : false,

            //Live calls Module
            lc: checkValue?.["live-calls"] || "0",
            is_lc: !!checkValue?.["live-calls"],
            is_list_lc: checkValue?.["live-calls"]
                ? checkValue?.["live-calls"]["list"] === "0"
                    ? true
                    : false
                : false,

            //Realtime Report Module
            rr: checkValue?.rr || "0",
            is_rr: !!checkValue?.rr,

            //Lead Report Module
            lead_report: checkValue?.lead_report || "0",
            is_lead_report: !!checkValue?.lead_report,
            is_list_lead_report: checkValue?.lead_report
                ? checkValue?.lead_report.list === "0"
                    ? true
                    : false
                : false,

            //Campaign Report Module
            campaign_report: checkValue?.campaign_report || "0",
            is_campaign_report: !!checkValue?.campaign_report,
            is_list_campaign_report: checkValue?.campaign_report
                ? checkValue?.campaign_report.list === "0"
                    ? true
                    : false
                : false,

            //Voicebroadcast Report Module
            voicebroadcast_report: checkValue?.voicebroadcast_report || "0",
            is_voicebroadcast_report: !!checkValue?.voicebroadcast_report,
            is_list_voicebroadcast_report: checkValue?.voicebroadcast_report
                ? checkValue?.voicebroadcast_report.list === "0"
                    ? true
                    : false
                : false,

            //Missed Call report Module
            missedcall: checkValue?.missedcall || "0",
            is_missedcall: !!checkValue?.missedcall,
            is_list_missedcall: checkValue?.missedcall
                ? checkValue?.missedcall.list === "0"
                    ? true
                    : false
                : false,

            //Login Logout report Module
            loginLogout: checkValue?.loginLogout || "0",
            is_loginLogout: !!checkValue?.loginLogout,
            is_list_loginLogout: checkValue?.loginLogout
                ? checkValue?.loginLogout.list === "0"
                    ? true
                    : false
                : false,

            //User Perfomance Report
            up: checkValue?.user_performance_report || "0",
            is_up: !!checkValue?.user_performance_report,
            is_list_up: checkValue?.user_performance_report
                ? checkValue?.user_performance_report.list === "0"
                    ? true
                    : false
                : false,

            //Voicemail Report Module
            voicemail: checkValue?.voicemail || "0",
            is_voicemail: !!checkValue?.voicemail,
            is_list_voicemail: checkValue?.voicemail
                ? checkValue?.voicemail.list === "0"
                    ? true
                    : false
                : false,

            //Recording Report Module
            recording: checkValue?.recording || "0",
            is_recording: !!checkValue?.recording,
            is_list_recording: checkValue?.recording
                ? checkValue?.recording.list === "0"
                    ? true
                    : false
                : false,

            //Greeting Module
            prompts: checkValue?.greeting || "0",
            is_prompts: !!checkValue?.greeting,
            is_list_prompts: checkValue?.greeting
                ? checkValue?.greeting.list === "0"
                    ? true
                    : false
                : false,
            is_create_prompts: checkValue?.greeting?.create === "0" ? true : false,
            is_edit_prompts: checkValue?.greeting?.edit === "0" ? true : false,
            is_delete_prompts: checkValue?.greeting?.delete === "0" ? true : false,

            e_smtp: checkValue?.["mail-configuration"] || "0",
            is_e_smtp: !!checkValue?.["mail-configuration"],
            is_list_e_smtp: checkValue?.["mail-configuration"]
                ? checkValue?.["mail-configuration"]?.["list"] === "0"
                    ? true
                    : false
                : false,
            // is_create_e_smtp:
            //     checkValue?.["mail-configuration"]?.["create"] === "0" ? true : false,
            // is_edit_e_smtp:
            //     checkValue?.["mail-configuration"]?.["edit"] === "0" ? true : false,
            // is_delete_e_smtp:
            //     checkValue?.["mail-configuration"]?.["delete"] === "0" ? true : false,

            telecomcircle: checkValue?.telecomcircle || "0",
            is_telecomcircle: !!checkValue?.telecomcircle,
            is_list_telecomcircle: checkValue?.telecomcircle
                ? checkValue?.telecomcircle.list === "0"
                    ? true
                    : false
                : false,
            is_create_telecomcircle: checkValue?.telecomcircle?.create === "0" ? true : false,
            is_edit_telecomcircle: checkValue?.telecomcircle?.edit === "0" ? true : false,
            is_delete_telecomcircle: checkValue?.telecomcircle?.delete === "0" ? true : false,



            breakcode: checkValue?.breakcode || "0",
            is_breakcode: !!checkValue?.breakcode,
            is_list_breakcode: checkValue?.breakcode
                ? checkValue?.breakcode.list === "0"
                    ? true
                    : false
                : false,
            is_create_breakcode: checkValue?.breakcode?.create === "0" ? true : false,
            is_edit_breakcode: checkValue?.breakcode?.edit === "0" ? true : false,
            is_delete_breakcode: checkValue?.breakcode?.delete === "0" ? true : false,

            webform: checkValue?.webform || "0",
            is_webform: !!checkValue?.webform,
            is_list_webform: checkValue?.webform
                ? checkValue?.webform.list === "0"
                    ? true
                    : false
                : false,
            is_create_webform: checkValue?.webform?.create === "0" ? true : false,
            is_edit_webform: checkValue?.webform?.edit === "0" ? true : false,
            is_delete_webform: checkValue?.webform?.delete === "0" ? true : false,

            //Api Module
            crm: checkValue?.["crm"] !== undefined ? checkValue?.["crm"] : "0",
            is_crm: checkValue?.["crm"] !== undefined ? true : false,
            is_create_crm: checkValue?.["crm"] ? checkValue?.["crm"]["create"] === "0"
                ? true
                : false
                : false,
            is_list_crm: checkValue?.["crm"] ? checkValue?.["crm"]["list"] === "0"
                ? true
                : false
                : false,
            is_edit_crm: checkValue?.["crm"] ? checkValue?.["crm"]["edit"] === "0"
                ? true
                : false
                : false,
            is_delete_crm: checkValue?.["crm"] ? checkValue?.["crm"]["delete"] === "0"
                ? true
                : false
                : false,

            //api key Module
            api_key: checkValue?.["api_key"] !== undefined ? checkValue?.["api_key"]
                : "0",
            is_api_key: checkValue?.["api_key"] !== undefined ? true : false,
            is_create_api_key: checkValue?.["api_key"] ? checkValue?.["api_key"]["create"] === "0"
                ? true
                : false
                : false,
            is_list_api_key: checkValue?.["api_key"] ? checkValue?.["api_key"]["list"] === "0"
                ? true
                : false
                : false,
            is_edit_api_key: checkValue?.["api_key"] ? checkValue?.["api_key"]["edit"] === "0"
                ? true
                : false
                : false,
            is_delete_api_key: checkValue?.["api_key"] ? checkValue?.["api_key"]["delete"] === "0"
                ? true
                : false
                : false,

            //zoho id Module
            webhooks: checkValue?.["webhooks"] !== undefined ? checkValue?.["webhooks"] : "0",
            is_webhooks: checkValue?.["webhooks"] !== undefined ? true : false,
            is_create_webhooks: checkValue?.["webhooks"] ? checkValue?.["webhooks"]["create"] === "0"
                ? true
                : false
                : false,
            is_list_webhooks: checkValue?.["webhooks"] ? checkValue?.["webhooks"]["list"] === "0"
                ? true
                : false
                : false,
            is_edit_webhooks: checkValue?.["webhooks"] ? checkValue?.["webhooks"]["edit"] === "0"
                ? true
                : false
                : false,
            is_delete_webhooks: checkValue?.["webhooks"] ? checkValue?.["webhooks"]["delete"] === "0"
                ? true
                : false
                : false,


        });
        setOpenUser(
            !!checkValue?.user ||
            !!checkValue?.["user-group"] ||
            !!checkValue?.["user-role"] ||
            !!checkValue?.extension
        );
        setOpenOutgoing(
            !!checkValue?.["outgoing-rules"] ||
            !!checkValue?.["caller-id-group"] ||
            !!checkValue?.trunk
        );
        setOpenIncoming(
            !!checkValue?.did ||
            !!checkValue?.["ip-mapping"] ||
            !!checkValue?.["click-to-call"] ||
            !!checkValue?.ringgroup ||
            !!checkValue?.ivr ||
            !!checkValue?.timecondition ||
            !!checkValue?.conference ||
            !!checkValue?.["call-queue"] ||
            !!checkValue?.["feature-code"] ||
            !!checkValue?.["block-inbound-campaign"]
        );
        setOpenLeadManagement(
            !!checkValue?.["lead-management"] ||
            !!checkValue?.["lead-group"] ||
            !!checkValue?.["follow-up"] ||
            !!checkValue?.["custom-fields"]
        );
        setOpenCallCenter(
            !!checkValue?.["outbound-campaign"] ||
            !!checkValue?.["inbound-campaign"] ||
            !!checkValue?.["blended-campaign"] ||
            !!checkValue?.disposition ||
            !!checkValue?.dnc ||
            !!checkValue?.webform
        );
        setOpenBroadcasting(!!checkValue?.["voice-broadcast"]);
        setOpenReports(
            !!checkValue?.campaign_report ||
            !!checkValue?.cdrs ||
            !!checkValue?.lead_report ||
            !!checkValue?.["live-calls"] ||
            !!checkValue?.recording ||
            !!checkValue?.rr ||
            !!checkValue?.user_performance_report ||
            !!checkValue?.voicebroadcast_report ||
            !!checkValue?.missedcall ||
            !!checkValue?.voicemail ||
            !!checkValue?.loginLogout
        );
        setOpenSetting(
            !!checkValue?.greeting ||
            !!checkValue?.e_smtp ||
            !!checkValue?.telecomcircle ||
            !!checkValue?.breakcode

        );
        setOpenApi(
            !!checkValue?.api_key ||
            !!checkValue?.webhooks ||
            !!checkValue?.crm
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSingleRole]);

    // Create Role & Navigate to Manager Role Page
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
        console.log("updatePayload", val);
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

    const getOptions = (name: string) => {
        switch (name) {
            case "user":
                return userOptions;
            case "extension":
                return sipOptions;
            case "oc":
                return outboundCampaignOptions;
            case "ic":
                return inboundCampaignOptions;
            case "bc":
                return blendedCampaignOptions;
            default:
                return [];
        }
    };

    // Fetching SIP Options
    const onGetSipOptions = async () => {
        try {
            await dispatch(sipOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching Outbound Options
    const onGetOutboundOptions = async () => {
        try {
            await dispatch(outboundOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outbound Options Err =-=>", err);
        }
    };

    // Fetching Inbound Options
    const OnInboundOptionsGet = async () => {
        try {
            await dispatch(inboundOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outbound Options Err =-=>", err);
        }
    };

    // Fetching Blended Options
    const OnBlendedOptionsGet = async () => {
        try {
            await dispatch(blendedOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outbound Options Err =-=>", err);
        }
    };

    //Get Label Name
    const getLabel = (label: string, text: string = "") => {
        text = text != "" ? "Select" : "Allow";
        switch (label) {
            case "user":
                return `${text} user`;
            case "extension":
                return `${text} extension`;
            case "oc":
                return `${text} outbound campaign`;
            case "ic":
                return `${text} inbound campaign`;
            case "bc":
                return `${text} blended campaign`;
        }
    };

    const getIsAllChecked = (type: string, data: any[]) => {
        if (data?.length) {
            let isAllChecked = true;
            for (let index = 0; index < data.length; index++) {
                const val = data[index];
                const crudModules = ['user', 'outgoing', 'incoming', 'leadManagement', 'callCenter', 'broadCasting', 'setting', 'api'];
                if (crudModules.includes(type)) {
                    if (!values[val.switchName] || !values[val.is_create] || !values[val.is_list] || !values[val.is_edit] || !values[val.is_delete]) {
                        if (val.add_value) {
                            isAllChecked = values[val.is_add];
                        }
                        isAllChecked = false;
                        break;
                    }
                } else if (type === 'report') {
                    if (!values[val.switchName] || !values[val.is_list]) {
                        isAllChecked = false;
                        break;
                    }
                }
            }
            return isAllChecked;
        } else {
            return false;
        }
    }

    const onSelectAllChange = (type: string, checked: boolean, data: any, setOpen: any) => {
        setOpen(true);
        for (let index = 0; index < data.length; index++) {
            const val = data[index];
            setFieldValue(val.switchName, checked);
            setFieldValue(val.is_list, checked);
            if (type !== 'report') {
                setFieldValue(val.is_create, checked);
                setFieldValue(val.is_edit, checked);
                setFieldValue(val.is_delete, checked);
                if (val.add_value) {
                    setFieldValue(val.is_add, checked);
                }
            }
        }
    };

    return (
        <>
            <CardForm
                id={id}
                title={id ? "Edit Manager Roles" : "Create Manager Roles"}
                loading={loading}
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    router.back();
                    id && dispatch(updateSingleRoleData({}));
                }}
            >
                <div className="pt-5 px-6 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
                    <Input
                        name="role_name"
                        label={
                            <>
                                &nbsp;&nbsp;&nbsp;Role Name <span className="text-red-500">*</span>
                            </>
                        }
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

                {/* Advanced Roles Section */}

                {/* User Section Start */}

                <div
                    className={`${!userRoleDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openUser ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Users"
                            isManager={true}
                            checked={getIsAllChecked('user', userRoleDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('user', checked, userRoleDatas, setOpenUser)}
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
                                {userRoleDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        if (val.switchName == "is_user") {
                                            values["is_extensions"];
                                        }
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            if (val?.switchName === "is_user") {
                                                                setValues({
                                                                    ...values,
                                                                    [val.name]: 0,
                                                                    [val.switchName]: e.target.checked,
                                                                    extension: 0,
                                                                    is_extension: e.target.checked,
                                                                });
                                                            } else {
                                                                setValues({
                                                                    ...values,
                                                                    [val.name]: 0,
                                                                    [val.switchName]: e.target.checked,
                                                                });
                                                            }
                                                        }}
                                                    />

                                                    <CheckBoxv2
                                                        label="Create"
                                                        checked={values[val.is_create]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_create, e);
                                                        }}
                                                    />
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                    <CheckBoxv2
                                                        label="Edit"
                                                        checked={values[val.is_edit]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_edit, e);
                                                        }}
                                                    />
                                                    <CheckBoxv2
                                                        label="Delete"
                                                        checked={values[val.is_delete]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_delete, e);
                                                        }}
                                                    />
                                                    {val.add_value ? (
                                                        <CheckBoxv2
                                                            label={`Allow ${val.name}`}
                                                            checked={values[val.is_add]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_add, e);
                                                            }}
                                                        />
                                                    ) : null}
                                                    {val.add_value && values[val.is_add] ? (
                                                        <Select
                                                            className="whitespace-nowrap"
                                                            isShowLabel={false}
                                                            name={val.add_value}
                                                            placeholder={`Select ${val.name}`}
                                                            removable
                                                            isMulti
                                                            value={values[val.add_value]}
                                                            options={getOptions(val.name)}
                                                            onChange={(e: any) => {
                                                                console.log(e);
                                                                setFieldValue(val.add_value, e);
                                                            }}
                                                        />
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {userRoleDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex items-center col-span-8">
                                                    <LabelSwitch
                                                        checked={values[val.switchName]}
                                                        onChange={(e: any) => {
                                                            if (val?.switchName === "is_user") {
                                                                setValues({
                                                                    ...values,
                                                                    [val.switchName]: e.target.checked,
                                                                    is_extension: e.target.checked,
                                                                });
                                                            } else {
                                                                setFieldValue(
                                                                    `${val.switchName}`,
                                                                    e.target.checked
                                                                );
                                                            }
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
                {/* User Section End */}

                {/* Outgoing Rules Section Start */}
                <div
                    className={`${!outgoingRulesDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openOutgoing ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Outgoing Rules"
                            isManager={true}
                            checked={getIsAllChecked('outgoing', outgoingRulesDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('outgoing', checked, outgoingRulesDatas, setOpenOutgoing)}
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
                                {outgoingRulesDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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

                                                    <CheckBoxv2
                                                        label="Create"
                                                        checked={values[val.is_create]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_create, e);
                                                        }}
                                                    />
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>

                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                    <CheckBoxv2
                                                        label="Edit"
                                                        checked={values[val.is_edit]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_edit, e);
                                                        }}
                                                    />
                                                    <CheckBoxv2
                                                        label="Delete"
                                                        checked={values[val.is_delete]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_delete, e);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {outgoingRulesDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex items-center col-span-8">
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
                {/* Outgoing Rules Section End */}

                {/* Incoming Rules Section Start */}
                <div
                    className={`${!incomingRulesDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openIncoming ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Incoming Rules"
                            isManager={true}
                            checked={getIsAllChecked('incoming', incomingRulesDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('incoming', checked, incomingRulesDatas, setOpenIncoming)}
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
                                {incomingRulesDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                                                    <CheckBoxv2
                                                        label="Create"
                                                        checked={values[val.is_create]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_create, e);
                                                        }}
                                                    />
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                    <CheckBoxv2
                                                        label="Edit"
                                                        checked={values[val.is_edit]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_edit, e);
                                                        }}
                                                    />
                                                    <CheckBoxv2
                                                        label="Delete"
                                                        checked={values[val.is_delete]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_delete, e);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {incomingRulesDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex items-center col-span-8">
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
                {/* Incoming Rules Section End */}

                {/* Lead Management Section Start */}
                <div
                    className={`${!leadManagementDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openLeadManagement ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Lead management"
                            isManager={true}
                            checked={getIsAllChecked('leadManagement', leadManagementDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('leadManagement', checked, leadManagementDatas, setOpenLeadManagement)}
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
                                {leadManagementDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                                                    <CheckBoxv2
                                                        label="Create"
                                                        checked={values[val.is_create]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_create, e);
                                                        }}
                                                    />
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                    <CheckBoxv2
                                                        label="Edit"
                                                        checked={values[val.is_edit]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_edit, e);
                                                        }}
                                                    />
                                                    <CheckBoxv2
                                                        label="Delete"
                                                        checked={values[val.is_delete]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_delete, e);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {leadManagementDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                {/* Lead Management Section End */}

                {/* Contact Center Section Start */}
                <div
                    className={`${!callCenterRoleDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px] `}
                >
                    <div
                        className={`${openCallCenter ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Contact Center"
                            isManager={true}
                            checked={getIsAllChecked('callCenter', callCenterRoleDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('callCenter', checked, callCenterRoleDatas, setOpenCallCenter)}
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
                    <div className={`px-6 bg-main-background rounded-[20px] py-6 ${!openCallCenter && "hidden"}`}>
                        <div className="space-y-5">
                            <>
                                {callCenterRoleDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                                                    <CheckBoxv2
                                                        label="Create"
                                                        checked={values[val.is_create]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_create, e);
                                                        }}
                                                    />
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                    <CheckBoxv2
                                                        label="Edit"
                                                        checked={values[val.is_edit]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_edit, e);
                                                        }}
                                                    />
                                                    <CheckBoxv2
                                                        label="Delete"
                                                        checked={values[val.is_delete]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_delete, e);
                                                        }}
                                                    />
                                                    {val.add_value ? (
                                                        <CheckBoxv2
                                                            label={getLabel(val.name)}
                                                            checked={values[val.is_add]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_add, e);
                                                            }}
                                                        />
                                                    ) : null}
                                                    {val.add_value && values[val.is_add] ? (
                                                        <Select
                                                            className="whitespace-nowrap"
                                                            isShowLabel={false}
                                                            name={val.add_value}
                                                            placeholder={getLabel(val.name, "Select")}
                                                            removable
                                                            isMulti
                                                            value={values[val.add_value]}
                                                            options={getOptions(val.name)}
                                                            onChange={(e: any) => {
                                                                console.log(e);
                                                                setFieldValue(val.add_value, e);
                                                            }}
                                                        />
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {callCenterRoleDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex items-center col-span-8">
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
                {/* Contact Center Section End */}

                {/* Voice Broadcast Section Section Start */}
                <div
                    className={`${!broadcastingDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openBroadcasting ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Broadcasting"
                            isManager={true}
                            checked={getIsAllChecked('broadCasting', broadcastingDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('broadCasting', checked, broadcastingDatas, setOpenBroadcasting)}
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
                        className={`px-6 bg-main-background py-6 rounded-[20px] ${!openBroadcasting && "hidden"}`}
                    >
                        <div className="space-y-5">
                            <>
                                {broadcastingDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                                                    <CheckBoxv2
                                                        label="Create"
                                                        checked={values[val.is_create]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_create, e);
                                                        }}
                                                    />
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                    <CheckBoxv2
                                                        label="Edit"
                                                        checked={values[val.is_edit]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_edit, e);
                                                        }}
                                                    />
                                                    <CheckBoxv2
                                                        label="Delete"
                                                        checked={values[val.is_delete]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_delete, e);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {broadcastingDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex items-center col-span-8">
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
                {/* Voice Broadcast Section End */}

                {/* Reports Section Start */}
                <div
                    className={`${!reportsRolesDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openReports ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Reports"
                            isManager={true}
                            checked={getIsAllChecked('report', reportsRolesDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('report', checked, reportsRolesDatas, setOpenReports)}
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
                                {reportsRolesDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {reportsRolesDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex items-center col-span-8">
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
                {/* Reports Section End */}
                {/* Setting Section Section Start */}
                <div
                    className={`${!settingDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openSetting ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Settings"
                            isManager={true}
                            checked={getIsAllChecked('setting', settingDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('setting', checked, settingDatas, setOpenSetting)}
                        />
                        <Icon
                            className="absolute right-4"
                            name={openSetting ? "UpsideArrowWhite" : "DownsideArrowWhite"}
                            width={24}
                            height={24}
                            alt={openSetting ? "IconMinus" : "IconPlus"}
                            onClick={() => setOpenSetting(!openSetting)}
                        />
                    </div>
                    <div className={`px-6 bg-main-background py-6 rounded-[20px] ${!openSetting && "hidden"}`}>
                        <div className="space-y-5">
                            <>
                                {settingDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                                                    {val.switchName !== 'is_e_smtp' && (
                                                        <>
                                                            <CheckBoxv2
                                                                label="Create"
                                                                checked={values[val.is_create]}
                                                                onChange={(e: any) => {
                                                                    setFieldValue(val.is_create, e);
                                                                }}
                                                            />
                                                            <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                                <CheckBoxv2
                                                                    label="List"
                                                                    checked={values[val.is_list]}
                                                                    onChange={(e: any) => {
                                                                        setFieldValue(val.is_list, e);
                                                                    }}
                                                                />
                                                            </div>
                                                            <CheckBoxv2
                                                                label="Edit"
                                                                checked={values[val.is_edit]}
                                                                onChange={(e: any) => {
                                                                    setFieldValue(val.is_edit, e);
                                                                }}
                                                            />
                                                            <CheckBoxv2
                                                                label="Delete"
                                                                checked={values[val.is_delete]}
                                                                onChange={(e: any) => {
                                                                    setFieldValue(val.is_delete, e);
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {settingDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex items-center col-span-8">
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
                {/* Setting Section End */}

                {/* Api Section Section Start */}

                <div
                    className={`${!apiDatas?.length && "hidden"
                        } mb-4 mx-4 bg-main-background border-dark-500 rounded-[40px]`}
                >
                    <div
                        className={`${openApi ? "bg-main-background text-primary " : ""
                            } bg-main-background py-2 px-2  flex justify-between items-center relative rounded-[40px]`}
                    >
                        <CheckBoxv2
                            label="Integration"
                            isManager={true}
                            checked={getIsAllChecked('api', apiDatas)}
                            onChange={(checked: boolean) => onSelectAllChange('api', checked, apiDatas, setOpenApi)}
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
                                {apiDatas
                                    ?.filter((val: any) => values[val.switchName])
                                    ?.map((val: any, index: number, array: any[]) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-10 space-x-3 items-center ${array?.length - 1 === index &&
                                                    "border-b border-dark-700 pb-6"
                                                    }`}
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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
                                                    <CheckBoxv2
                                                        label="Create"
                                                        checked={values[val.is_create]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_create, e);
                                                        }}
                                                    />
                                                    <div style={{ display: values[val.is_list] ? 'none' : 'block' }}>
                                                        <CheckBoxv2
                                                            label="List"
                                                            checked={values[val.is_list]}
                                                            onChange={(e: any) => {
                                                                setFieldValue(val.is_list, e);
                                                            }}
                                                        />
                                                    </div>
                                                    <CheckBoxv2
                                                        label="Edit"
                                                        checked={values[val.is_edit]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_edit, e);
                                                        }}
                                                    />
                                                    <CheckBoxv2
                                                        label="Delete"
                                                        checked={values[val.is_delete]}
                                                        onChange={(e: any) => {
                                                            setFieldValue(val.is_delete, e);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                            <>
                                {apiDatas
                                    ?.filter((val: any) => !values[val.switchName])
                                    ?.map((val: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-10 space-x-3 items-center"
                                            >
                                                <label className="text-txt-primary font-bold text-xs col-span-2">
                                                    {val.title}
                                                </label>
                                                <div className="flex gap-4 items-center col-span-8">
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

                {/* Api Section End */}
            </CardForm>
        </>
    );
};
export default CreateEditManagerRolesForm;
