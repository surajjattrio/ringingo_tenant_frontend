"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import {
    useUsers,
    userCreate,
    userSingleGet,
    userSyncWaba,
    userUpdate,
} from "@/redux/slice/tenant-admin/userSlice";
import {
    useUserRoleAllData,
    useUserRoleOptions,
    userRoleOptionsGet,
} from "@/redux/slice/tenant-admin/userRoleSlice";
import {
    useUserGroupsOptions,
    userGroupOptionsGet,
} from "@/redux/slice/tenant-admin/userGroupSlice";
import {
    msgChannelWhatsapp,
    msgChannelSMS,
} from "@/redux/slice/tenant-admin/messagingChannelSlice";
import {
    didOptionsGet,
    useDidOptions,
} from "@/redux/slice/tenant-admin/didSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { getAllSipDevices } from "@/redux/services/tenant-admin/sipDevicesServices";
import { CardForm } from "@/components/ui-components";
import {
    Input,
    InputNumber,
    Password,
    Select,
    Switch,
} from "@/components/forms";

// THIRD PARTY IMPORT
import { isObject, useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/userTypes";
import { ManagerNameTypes, OptionTypes } from "@/types/formTypes";

// OPTIONS IMPORT
import { extensionTypeOptions } from "@/config/options";
import Cookies from "js-cookie";
import { campaignOptionsGet, useCampaignOptions } from "@/redux/slice/tenant-admin/campaignReportSlice";

const CreateEditUserForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAuth();
    const cookie = Cookies.get("user");
    const userTenantData = JSON.parse(cookie ? cookie : "{}");
    const userRoleOptions = useUserRoleOptions();
    const [isMessagingRestricted, setIsMessagingRestricted] = useState(false);
    const [selectedUserRole, setSelectedUserRole] = useState<any>(null);
    const userRoleData = useUserRoleAllData();
    const userGroupOptions = useUserGroupsOptions();
    let campaignOptions = useCampaignOptions();
    const didOptions = useDidOptions();
    const userData = useUsers();
    const [loading, setLoading] = useState<boolean>(false);
    const [sipOptions, setSipOptions] = useState<OptionTypes[]>([]);
    const [msgChannelOptionsForWhatsApp, setMsgChannelOptionsForWhatsApp] = useState([]);
    const [msgChannelOptionsForSMS, setMsgChannelOptionsForSMS] = useState([]);
    const [isWhatsAppPermission, setIsWhatsAppPermission] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        username: "",
        fullname: "",
        email: "",
        password: "",
        default_timeout: "30",
        user_role_uuid: "",
        user_group_uuid: "",
        // sms_messaging_channel_uuid: "",
        omni_messaging_channel_uuid: "",
        // instagram_messaging_channel_uuid: "",
        // facebook_messaging_channel_uuid: "",
        recording: "0",
        status: "0",
        extension_type: "0",
        default_extension: "",
        zoho_user_id: "",
        campaign_uuid: "",
        allowed_campaign: "",
        create_sip_device: "1",
        caller_id_name: "",
        caller_id_number: "",
        mobile_number: "",
        vendor_uid: "",
        team_user_uid: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        username: Yup.string().required("Please Enter Your User Name"),
        fullname: Yup.string().required("Please Enter Your Full Name"),
        email: Yup.string()
            .email("Invalid Email")
            .required("Please Enter Your Email"),
        password: Yup.string().required("Please Enter Your Password"),
        default_timeout: Yup.string().required("Please Select Default Timeout"),
        user_role_uuid: Yup.string().required("Please Select User Role"),
        user_group_uuid: Yup.string().required("Please Select User Group"),
    });

    // Create or Update User
    const onSubmit = (values: any) => {

        const flatCampaignOptions = campaignOptions.flatMap((group: any) => group.options);
        const allowed_campaign = Array.isArray(values?.allowed_campaign) && values?.allowed_campaign.map((selected: any) => {
            // If `selected` is just a value (UUID), find the label
            if (typeof selected === "string") {
                const option = flatCampaignOptions.find((opt: any) => opt.value === selected);
                return option || { label: "", value: selected };
            }
            // Already in correct format
            return selected;
        });
        const omni_messaging_channel_uuid = msgChannelOptionsForWhatsApp
            .filter((ch: any) =>
                values?.omni_messaging_channel_uuid.includes(ch?.value)
            )
            .map((ch: any) => ({
                label: ch.label,
                value: ch.value,
            }));

        const payload = { ...values, allowed_campaign };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["omni_messaging_channel_uuid"] = omni_messaging_channel_uuid
        if (id) {
            onUpdateUser(payload);
        } else {
            onCreateUser(payload);
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
        resetForm,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        onGetSingleUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, userRoleData]);

    useEffect(() => {
        onGetUserRoleOptions();
        onGetUserGroupOptions();
        // onGetMsgChannelOptionsForWhatsApp();
        onGetMsgChannelOptionsForSMS();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (values.create_sip_device == "0") {
            onGetDidOptions();
        }
    }, [values.create_sip_device]);
    useEffect(() => {
        if (selectedUserRole) {
            onGetMsgChannelOptionsForWhatsApp();
        }
    }, [selectedUserRole]);

    // Fetching SIP Devices Options
    const onGetSipOptions = async (id: string) => {
        try {
            const params = {
                extension_uuid: id,
                list: "all",
            };
            const res: any = await getAllSipDevices(params);
            const options = res?.data?.length
                ? res?.data?.map((val: any) => ({
                    value: val?.uuid,
                    label: `${val?.device_name} (${val?.username})`,
                }))
                : [];
            setSipOptions(options);
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    // Fetching User Role Options
    const onGetUserRoleOptions = () => {
        try {
            dispatch(userRoleOptionsGet());
        } catch (err) {
            console.error("Get User Role Options Err =-=>", err);
        }
    };

    // Fetching Msg Channel Options
    const onGetMsgChannelOptionsForWhatsApp = async () => {
        try {
            const res: any = await dispatch(msgChannelWhatsapp());
            const channels = res?.payload?.data || [];
            if (!selectedUserRole) {
                setMsgChannelOptionsForWhatsApp([]);
                return;
            }
            const allowedTypes = Object.keys(selectedUserRole).filter(
                (key) =>
                    ["whatsapp", "facebook", "instagram"].includes(key) &&
                    selectedUserRole[key] === "0"
            );
            const options = channels
                .filter((ch: any) =>
                    allowedTypes.includes(ch.type.toLowerCase())
                )
                .map((ch: any) => ({
                    label: ch.name,
                    value: ch.uuid,
                }));
            setMsgChannelOptionsForWhatsApp(options);
        } catch (err) {
            console.error("Get WhatsApp Messaging Channel Options Error:", err);
        }
    };

    // Fetching Msg Channel Options
    const onGetMsgChannelOptionsForSMS = async () => {
        try {
            const res: any = await dispatch(msgChannelSMS());
            const options = res.payload.data.map((channel: any) => ({
                label: channel.name,
                value: channel.uuid,
            }));
            setMsgChannelOptionsForSMS(options);
        } catch (err) {
            console.error("Get SMS Messaging Channel Options Error:", err);
        }
    };


    // Fetching User Group Options
    const onGetUserGroupOptions = () => {
        try {
            dispatch(userGroupOptionsGet());
        } catch (err) {
            console.error("Get User Group Options Err =-=>", err);
        }
    };

    // Fetching Single User Data
    const onGetSingleUserData = async () => {
        try {
            const res: any = await dispatch(userSingleGet(id as string)).unwrap();
            if (res?.statusCode === 200) {
                const userData = res?.data;
                const campaignUUIDs = userData?.allowed_campaign.map((item: any) => item.value);
                const omniChannelMessagingUUID = userData?.omni_messaging_channel_uuid?.map((item: any) => item.value);
                setValues({
                    ...values,
                    username: userData?.username,
                    fullname: userData?.fullname,
                    email: userData?.email,
                    password: userData?.password,
                    default_timeout: userData?.default_timeout,
                    recording: userData?.recording,
                    status: userData?.status || "0",
                    extension_type: userData?.extension_type || "0",
                    default_extension: userData?.default_extension,
                    user_role_uuid: userData?.user_role_uuid,
                    user_group_uuid: userData?.user_group_uuid,
                    // sms_messaging_channel_uuid: userData?.sms_messaging_channel_uuid,
                    // whatsapp_messaging_channel_uuid: userData?.whatsapp_messaging_channel_uuid,
                    zoho_user_id: userData?.zoho_user_id,
                    campaign_uuid: userData?.campaign_uuid,
                    allowed_campaign: campaignUUIDs,
                    omni_messaging_channel_uuid: omniChannelMessagingUUID,
                    mobile_number: userData?.mobile_number,
                    vendor_uid: userData?.vendor_uid,
                    team_user_uid: userData?.team_user_uid,
                });
                // ✅ FIX: set selectedUserRole on edit
                const role = userRoleData?.find(
                    (r: any) => r.uuid === userData?.user_role_uuid
                );

                setSelectedUserRole(role);
                setIsWhatsAppPermission(Number(res?.data?.tenant_role?.module_permission?.messaging?.whatsapp) > 1)

                // also sync restriction flag
                const restricted =
                    role &&
                    (role.whatsapp === "0" ||
                        role.instagram === "0" ||
                        role.facebook === "0");

                setIsMessagingRestricted(!!restricted);

                onGetSipOptions(userData?.default_extension);
            }
        } catch (err) {
            console.error("Get Single User Data Err =-=>", err);
        }
    };

    // Create User & Navigate to User Page
    const onCreateUser = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(userCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                resetForm();
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create User Err --->", e?.message);
        }
    };

    // Update User & Navigate to User Page
    const onUpdateUser = async (values: any) => {
        setLoading(true);

        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(userUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update User Err --->", e?.message);
        }
    };

    const onGetDidOptions = async () => {
        try {
            await dispatch(didOptionsGet());
        } catch (err) {
            console.error("Get DID Options Err =-=>", err);
        }
    };

    useEffect(() => {
        onGetCampaignOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetCampaignOptions = async () => {
        try {
            await dispatch(campaignOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get campaign Options Err =-=>", err);
        }
    };
    return (
        <CardForm
            id={id}
            name="user"
            managerName={managerName}
            length={id ? 0 : userData?.count}
            title={id ? "Edit User" : "Create User"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="username"
                    label={
                        <>
                            User Name <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Enter Username"
                    icon="UserOutline"
                    value={values.username}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    noSpace
                    isInfo
                />
                <Input
                    name="fullname"
                    label={
                        <>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Full Name <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Enter Full Name"
                    icon="UserOutline"
                    value={values.fullname}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // noSpace
                    isInfo
                />
                <Password
                    name="password"
                    label={
                        <>
                            Password <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Enter Password"
                    value={values.password}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="email"
                    label={
                        <>
                            Email <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Enter Email"
                    icon="GrayEmail"
                    value={values.email}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="mobile_number"
                    label={
                        <>
                            Mobile Number
                        </>
                    }
                    placeholder="Enter Mobile Number"
                    icon="CallGray"
                    value={values.mobile_number}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="user_role_uuid"
                    label={
                        <>
                            User Role <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Select User Role"
                    icon="UserOutline"
                    isAdd
                    createName="Create User Role"
                    createPath={
                        managerName
                            ? "/manager-user/role-user/create"
                            : "/tenant-user/role-user/create"
                    }
                    options={userRoleOptions}
                    value={values.user_role_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("user_role_uuid", e.target.value);
                        const selectedRole = userRoleData?.find(
                            (role: any) => role.uuid === e.target.value
                        );
                        setSelectedUserRole(selectedRole);
                        // 3️⃣ Check messaging permissions
                        const restricted =
                            selectedRole &&
                            (selectedRole?.whatsapp === "0" ||
                                selectedRole?.instagram === "0" ||
                                selectedRole?.facebook === "0");
                        console.log(selectedRole, "dd", restricted);

                        // 4️⃣ Save result (use anywhere in UI)
                        setIsMessagingRestricted(!!restricted);

                        // (optional) debug
                        console.log("Selected Role:", selectedRole);
                        console.log("Messaging Restricted:", restricted);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="user_group_uuid"
                    label={
                        <>
                            User Group <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserGroup"
                    placeholder="Select User Group"
                    isAdd
                    createName="Create User Group"
                    createPath={
                        managerName
                            ? "/manager-user/group-user/create"
                            : "/tenant-user/group-user/create"
                    }
                    options={userGroupOptions}
                    value={values.user_group_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("user_group_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <InputNumber
                    name="default_timeout"
                    label="Default Time-out"
                    placeholder="Enter Default Time-out"
                    value={values.default_timeout}
                    touched={touched}
                    errors={errors}
                    onChange={(value: string) => setFieldValue("default_timeout", value)}
                    onBlur={handleBlur}
                    isInfo
                />
                {isMessagingRestricted ?
                    <Select
                        name="omni_messaging_channel_uuid"
                        label="Omni Messaging Channel"
                        isMulti
                        icon="Group"
                        placeholder="Select Omni Messaging Channel"
                        options={msgChannelOptionsForWhatsApp}
                        value={values?.omni_messaging_channel_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("omni_messaging_channel_uuid", e);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                    // <Select
                    //     name="omni_messaging_channel_uuid"
                    //     label="Omni Messaging Channel"
                    //     icon="Whatsapp"
                    //     placeholder="Select Omni Messaging Channel"
                    //     isAdd
                    //     createName="Create Omni Messaging Channel"
                    //     createPath={
                    //         managerName
                    //             ? "/manager-messaging-channel/create"
                    //             : "/tenant-messaging-channel/create"
                    //     }
                    //     options={msgChannelOptionsForWhatsApp}
                    //     value={values?.omni_messaging_channel_uuid}
                    //     touched={touched}
                    //     errors={errors}
                    //     onChange={(e: any) => {
                    //         setFieldValue("omni_messaging_channel_uuid",  e);
                    //     }}
                    //     onBlur={handleBlur}
                    //     isInfo
                    // /> 
                    : <></>
                }
                {userTenantData?.tenant_detail?.roles?.[0]?.module_permission?.messaging?.sms ?
                    <Select
                        name="sms_messaging_channel_uuid"
                        label="SMS Messaging Channel"
                        icon="SMS"
                        placeholder="Select SMS Messaging Channel"
                        isAdd
                        createName="Create SMS Messaging Channel"
                        createPath={
                            managerName
                                ? "/manager-messaging-channel/create"
                                : "/tenant-messaging-channel/create"
                        }
                        options={msgChannelOptionsForSMS}
                        value={values?.omni_messaging_channel_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("sms_messaging_channel_uuid", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    /> : <></>
                }
                {id && (
                    <Select
                        name="extension_type"
                        label="Default Extension Type"
                        options={extensionTypeOptions}
                        value={values.extension_type}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("extension_type", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                )}
                {id && (
                    <>
                        {values.extension_type === "1" ? (
                            <Input
                                name="default_extension"
                                type="number"
                                label="Default Extension"
                                placeholder="Enter Default Extension"
                                value={values.default_extension}
                                touched={touched}
                                errors={errors}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInfo
                            />
                        ) : (
                            <Select
                                name="default_extension"
                                label="Default SIP Device"
                                placeholder="Select Default SIP Device"
                                removable
                                isAdd
                                createName="Create SIP Device"
                                createPath={
                                    managerName
                                        ? "/manager-user/sip-devices/create"
                                        : "/tenant-user/sip-devices/create"
                                }
                                options={sipOptions}
                                value={values.default_extension}
                                touched={touched}
                                errors={errors}
                                onChange={(e: any) => {
                                    setFieldValue("default_extension", e.target.value);
                                }}
                                onBlur={handleBlur}
                                isInfo
                            />
                        )}
                    </>
                )}
                {
                    userTenantData?.tenant_detail?.roles?.[0]?.module_permission?.api?.zoho_id === "0" ?
                        <Input
                            name="zoho_user_id"
                            label="Zoho User ID"
                            placeholder="Enter Zoho User ID"
                            icon="Zohologo"
                            value={values.zoho_user_id}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            noSpace
                            isInfo
                        /> : <></>
                }
                <Select
                    name="campaign_uuid"
                    label="Campaign Options"
                    icon="Group"
                    placeholder="Select Campaign"
                    options={campaignOptions}
                    value={values.campaign_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("campaign_uuid", e.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                    isManual
                    isGroup
                />
                <Select
                    name="allowed_campaign"
                    isMulti
                    isGroup
                    icon="Group"
                    label="Allowed Campaigns"
                    placeholder="Select campaigns"
                    options={campaignOptions}
                    value={values?.allowed_campaign}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("allowed_campaign", e);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />

                <Switch
                    trueName="Yes"
                    falseName="No"
                    className="pt-[2px]"
                    label="Call Recording"
                    value={values.recording}
                    onClick={(value: string) => setFieldValue("recording", value)}
                />
                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
                {!id && (
                    <Switch
                        trueName="Yes"
                        falseName="No"
                        className="pt-[2px]"
                        label="Auto Create SIP Device"
                        value={values.create_sip_device}
                        onClick={(value: string) =>
                            setFieldValue("create_sip_device", value)
                        }
                    />
                )}

                {!id && values.create_sip_device === "0" && (
                    <>
                        {" "}
                        <Input
                            name="caller_id_name"
                            label="Caller ID Name"
                            placeholder="Enter Caller ID Name"
                            icon="UserOutline"
                            value={values.caller_id_name}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                        <Select
                            name="caller_id_number"
                            label="Caller ID Number"
                            placeholder="Select Caller ID Number"
                            removable
                            icon="CallGray"
                            options={didOptions}
                            value={values.caller_id_number}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("caller_id_number", e.target.value);
                            }}
                            onBlur={handleBlur}
                            isInfo
                        />{" "}
                    </>
                )}

                {(!values.vendor_uid || !values.team_user_uid) && isWhatsAppPermission &&
                    (
                        <div className="flex items-end">
                            <button
                                type="button"
                                disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const res: any = await dispatch(userSyncWaba(id as string)).unwrap();
                                    if (res?.statusCode === 200) {
                                        Success(res.message || "Sync initiated successfully");
                                        onGetSingleUserData(); // Refresh data to get vendor IDs
                                    } else {
                                        Danger(res?.message || res?.data || "Sync failed");
                                    }
                                } catch (err: any) {
                                    Danger(err.message || "An error occurred");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors h-[42px] mb-[2px] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Syncing..." : "Sync WABA"}
                        </button>
                    </div>
                )}
            </div>
        </CardForm>
    );
};

export default CreateEditUserForm;

