"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    tenantCreate,
    tenantHeaderGetAll,
    tenantSingleGet,
    tenantSyncWaba,
    tenantUpdate,
} from "@/redux/slice/master-admin/tenantSlice";
import {
    timezoneCountryWiseGet,
    useTimezoneCountryWiseOptions,
} from "@/redux/slice/master-admin/timezoneSlice";
import {
    countryOptionsGet,
    useCountryOptions,
} from "@/redux/slice/master-admin/countrySlice";
import {
    sipProfileOptionsGet,
    useSipProfileOptions,
} from "@/redux/slice/master-admin/sipProfileSlice";
import {
    rolesGet,
    rolesOptionsGet,
    useRoleData,
    useRolesOptions,
} from "@/redux/slice/master-admin/roleSlice";
import { outgoingOptionsGet, useOutgoingOptions } from "@/redux/slice/master-admin/outgoingSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Password, Select, Switch } from "@/components/forms";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { InitialValueType } from "@/types/master-admin/tenantTypes";

/* ============================== CREATE & EDIT TENANT FORM ============================== */

const CreateEditTenantForm = () => {
    const { id }: any = useParams();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const rolesOptions = useRolesOptions();
    const countryOptions = useCountryOptions();
    const timezoneOptions = useTimezoneCountryWiseOptions();
    const sipProfileOptions = useSipProfileOptions();
    const outgoingOptions = useOutgoingOptions();
    const roleData = useRoleData();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        tenant_name: "",
        username: "",
        password: "",
        domain: "",
        status: "0",
        time_zone_uuid: "",
        role_uuid: "",
        country_uuid: "",
        email: "",
        sip_profile_uuid: "",
        sip_profile_uuids: [],
        outgoing_rule_uuid: "",
        account_code: "",
        concurrent_calls: "0",
        add_anonymous_lead: "1",
        system_disposition: "0",
        company_code: "",
        mobile_number: "",
        vendor_uid: "",
        vendor_token: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        tenant_name: Yup.string().required("Please enter your name"),
        username: Yup.string().required("Please enter your username"),
        password: Yup.string().required("Please enter your password"),
        domain: Yup.string().required("Please enter your domain name"),
        time_zone_uuid: Yup.string().required("Please select timezone"),
        role_uuid: Yup.string().required("Please select roles"),
        country_uuid: Yup.string().required("Please select country"),
        // email: Yup.string()
        //     .email("Invalid Email"),
        //     .required("Please enter your email"),
        email: Yup.string().trim(),
        sip_profile_uuid: Yup.string().required("Please select sip profile"),
        concurrent_calls: Yup.string().required("Please enter dial level"),
        company_code: Yup.string().required("Please enter company code").matches(/^[a-zA-Z0-9]+$/, "Special characters are not allowed"),
        mobile_number: Yup.string().matches(/^[0-9]+$/, "Please enter valid mobile number").nullable(),
    });

    // Create or Update Tenant
    const onSubmit = (values: any) => {
        if (id) {
            onUpdateTenant(values);
        } else {
            onCreateTenant(values);
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
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        onGetSingleTenantData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        onGetRolesOptions();
        onGetCountryOptions();
        onGetSipProfileOptions();
        onGetOutgoingOptions();
        dispatch(rolesGet({ fill: "all" }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Roles Options
    const onGetRolesOptions = () => {
        try {
            dispatch(rolesOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get Roles Data Err --->", e?.message);
        }
    };

    // Fetching Country Options
    const onGetCountryOptions = () => {
        try {
            dispatch(countryOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get Country Options Err --->", e?.message);
        }
    };

    // Fetching SIP Profile Options
    const onGetSipProfileOptions = () => {
        try {
            dispatch(sipProfileOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get SIP Profile Options Err --->", e?.message);
        }
    };

    // Fetching Time Zones Options
    const onGetTimeZonesOptions = async (id: string) => {
        try {
            const param: any = { country_uuid: id };
            await dispatch(timezoneCountryWiseGet(param)).unwrap();
        } catch (e: any) {
            console.error("Get TimeZones Data Err --->", e?.message);
        }
    };

    // Fetching Outgoing Rules Master Admin Options
    const onGetOutgoingOptions = async () => {
        try {
            await dispatch(outgoingOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get Outgoing Rules Data Err --->", e?.message);
        }
    };

    const getTenantHeaderData = async () => {
        try {
            const payload = { search: "" };
            await dispatch(tenantHeaderGetAll(payload)).unwrap();
        } catch (e: any) {
            console.error("Get Tenant Error --->", e.message);
        }
    };

    // Fetching Single Tenant Data
    const onGetSingleTenantData = async () => {
        try {
            const res: any = await dispatch(tenantSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const tenantData = res?.data;
                onGetTimeZonesOptions(tenantData?.country_uuid);
                setValues({
                    ...values,
                    tenant_name: tenantData?.tenant_name || "",
                    username: tenantData?.username || "",
                    password: tenantData?.password || "",
                    domain: tenantData?.domain || "",
                    role_uuid: tenantData?.role_uuid || "",
                    country_uuid: tenantData?.country_uuid || "",
                    time_zone_uuid: tenantData?.time_zone_uuid || "",
                    status: tenantData?.status || "0",
                    email: tenantData?.email || "",
                    sip_profile_uuid: tenantData?.sip_profile_uuid || "",
                    sip_profile_uuids:
                        tenantData?.sip_profile_uuids?.length > 0
                            ? tenantData?.sip_profile_uuids
                            : tenantData?.sip_profile_uuid
                                ? [tenantData?.sip_profile_uuid]
                                : [],
                    outgoing_rule_uuid: tenantData?.outgoing_rule_uuid || "",
                    account_code: tenantData?.account_code || "",
                    concurrent_calls: tenantData?.concurrent_calls || "",
                    add_anonymous_lead: tenantData?.add_anonymous_lead || "1",
                    system_disposition: tenantData?.system_disposition || "0",
                    company_code: tenantData?.company_code || "",
                    mobile_number: tenantData?.mobile_number || "",
                    vendor_uid: tenantData?.vendor_uid || "",
                    vendor_token: tenantData?.vendor_token || "",
                });
            }
        } catch (err) {
            console.error("Get Single Tenant Data Err =-=>", err);
        }
    };

    // Create Tenant & Navigate to Tenant Page
    const onCreateTenant = async (val: InitialValueType) => {
        setLoading(true);
        try {
            const payload = { ...val };
            if (!val.email?.trim()) payload.email = '';
            const res: any = await dispatch(tenantCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            getTenantHeaderData();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create Tenant Err --->", e?.message);
        }
    };

    // Update Tenant & Navigate to Tenant Page
    const onUpdateTenant = async (val: InitialValueType) => {
        setLoading(true);
        try {
            const payload = {
                ...val,
                id,
            };
            if (!val.email?.trim()) payload.email = '';
            const res: any = await dispatch(tenantUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            getTenantHeaderData();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Tenant Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            loading={loading}
            title={id ? "Edit Tenant" : "Create Tenant"}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
                <Input
                    name="tenant_name"
                    label="Name"
                    placeholder="Enter Name"
                    icon="UserOutline"
                    value={values.tenant_name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="username"
                    label="Username"
                    icon="UserName"
                    placeholder="Enter Username"
                    value={values.username}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    noSpace
                    isInfo
                />
                <Input
                    name="email"
                    label="Your Email"
                    placeholder="Enter Email"
                    icon="Email"
                    value={values.email}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="mobile_number"
                    label="Mobile Number"
                    placeholder="Enter Mobile Number"
                    icon="PhoneNumber"
                    value={values.mobile_number}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Password
                    name="password"
                    label="Password"
                    placeholder="Enter Password"
                    value={values.password}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="country_uuid"
                    label="Country"
                    placeholder="Select Country"
                    options={countryOptions}
                    icon="Map"
                    value={values.country_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("country_uuid", e.target.value);
                        onGetTimeZonesOptions(e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="domain"
                    label="Domain"
                    placeholder="https://"
                    icon="Earth"
                    value={values.domain}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    type="number"
                    name="concurrent_calls"
                    label="Concurrent Calls"
                    placeholder="Enter Concurrent Calls"
                    value={values.concurrent_calls}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="role_uuid"
                    label="Roles"
                    placeholder="Select Role"
                    options={rolesOptions}
                    value={values.role_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("role_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="time_zone_uuid"
                    label="Time Zone"
                    placeholder="Select Time Zone"
                    options={timezoneOptions}
                    icon="Clock"
                    value={values.time_zone_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("time_zone_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="sip_profile_uuids"
                    isMulti
                    label="SIP Profiles"
                    placeholder="Select SIP Profiles"
                    options={sipProfileOptions}
                    value={values.sip_profile_uuids}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        const selected: string[] = e || [];
                        setValues({
                            ...values,
                            sip_profile_uuids: selected,
                            // Default profile must be one of selected profiles
                            sip_profile_uuid: selected.includes(values.sip_profile_uuid)
                                ? values.sip_profile_uuid
                                : selected[0] || "",
                        });
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="sip_profile_uuid"
                    label="Default SIP Profile"
                    placeholder="Select Default SIP Profile"
                    options={
                        values.sip_profile_uuids?.length > 0
                            ? sipProfileOptions?.filter((val: any) => values.sip_profile_uuids.includes(val?.value))
                            : sipProfileOptions
                    }
                    value={values.sip_profile_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("sip_profile_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="outgoing_rule_uuid"
                    label="Outgoing Rule"
                    placeholder="Select Outgoing Rule"
                    icon="OutgoingRules"
                    options={outgoingOptions}
                    value={values.outgoing_rule_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("outgoing_rule_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="account_code"
                    label="Account code"
                    placeholder="Enter Account code"
                    value={values.account_code}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    noSpace
                    isInfo
                />
                <Input
                    name="company_code"
                    label="Company Code"
                    placeholder="Enter Company Code"
                    icon="UserTenant"
                    value={values.company_code}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    noSpace
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    trueName="Yes"
                    falseName="No"
                    label="Add Lead as Anonymous"
                    value={values.add_anonymous_lead}
                    onClick={(value: string) => setFieldValue("add_anonymous_lead", value)}
                />
                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
                <Switch
                    className="pt-[2px]"
                    label="System Disposition"
                    value={values.system_disposition}
                    onClick={(value: string) => setFieldValue("system_disposition", value)}
                />
                {(() => {
                    const selectedRole = roleData?.data?.find((r: any) => r.uuid === values.role_uuid);
                    const hasWhatsapp = Number(selectedRole?.module_permission?.messaging?.whatsapp) > 0 
                    
                    if (id && (!values.vendor_uid || !values.vendor_token) && hasWhatsapp) {
                        return (
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const res: any = await dispatch(tenantSyncWaba(id as string)).unwrap();
                                            if (res?.statusCode === 200) {
                                                Success(res.message || "Sync initiated successfully");
                                                onGetSingleTenantData(); // Refresh data to get vendor IDs
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
                        );
                    }
                    return null;
                })()}
            </div>
        </CardForm>
    );
};

export default CreateEditTenantForm;
