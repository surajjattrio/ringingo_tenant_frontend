"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

//THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    updateSingleUserRoleData,
    useSingleUserRole,
    useUserRole,
    userRoleCreate,
    userRoleUpdate,
} from "@/redux/slice/tenant-admin/userRoleSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Switch, Select } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/userRoleTypes";
import { ManagerNameTypes } from "@/types/formTypes";
import Cookies from "js-cookie";

const CreateEditUserRoleForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const userRole = useUserRole();
    const userRoleData = useSingleUserRole();
    const cookie = Cookies.get("user");
    console.log(cookie);
    const userTenantData = JSON.parse(cookie ? cookie : "{}");


    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        status: "0",
        pbx_mode: "1",
        call_center_mode: "1",
        call_report: "1",
        login_logout_report: "1",
        recording: "1",
        follow_up: "1",
        sticky_agent: "1",
        number_masking: "1",
        settings: "1",
        breakcode: "1",
        allow_black_list: "1",
        whatsapp: "1",
        instagram: "1",
        facebook: "1",
        sms: "1",
        unallocated_leads: "1",
        force_login: "1",
        auto_logout: "1",
        idle_timeout: "30",
        callqueue_selection: "1"
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter User Role"),
    });

    // Create or Update User Role
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateUserRole(payload);
        } else {
            onCreateUserRole(payload);
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
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        console.log(userRoleData,'force_login');
        
        setValues({
            ...values,
            name: userRoleData?.name || "",
            status: userRoleData?.status || "0",
            pbx_mode: userRoleData?.pbx_mode || "1",
            call_center_mode: userRoleData?.call_center_mode || "1",
            call_report: userRoleData?.call_report || "1",
            login_logout_report: userRoleData?.login_logout_report || "1",
            recording: userRoleData?.recording || "1",
            follow_up: userRoleData?.follow_up || "1",
            sticky_agent: userRoleData?.sticky_agent || "1",
            number_masking: userRoleData?.number_masking || "1",
            settings: userRoleData?.settings || "1",
            breakcode: userRoleData?.breakcode || "1",
            allow_black_list: userRoleData?.allow_black_list || "1",
            whatsapp: userRoleData?.whatsapp || "1",
            instagram: userRoleData?.instagram || "1",
            facebook: userRoleData?.facebook || "1",
            sms: userRoleData?.sms || "1",
            force_login:userRoleData?.force_login||"1",
            auto_logout: userRoleData?.auto_logout || "1",
            idle_timeout: userRoleData?.idle_timeout || "30",
            callqueue_selection: userRoleData?.callqueue_selection || "1",

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRoleData, id]);

    // Create User Role & Naviagte to User Role Page
    const onCreateUserRole = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(userRoleCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                resetForm();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create User Role Err --->", e?.message);
        }
    };

    // Update User Role & Naviagte to User Role Page
    const onUpdateUserRole = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(userRoleUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleUserRoleData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update IVR Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            managerName={managerName}
            name="user_role"
            length={id ? 0 : userRole?.count}
            title={id ? "Edit User Role" : "Create User Role"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
                resetForm();
                id && dispatch(updateSingleUserRoleData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="name"
                    label={
                        <>
                             Name <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Enter Name"
                    icon="UserOutline"
                    value={values.name}
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
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-2 gap-x-4 px-4">
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="PBX Mode"
                    value={values.pbx_mode}
                    onClick={(value: string) => setFieldValue("pbx_mode", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="CDR Report"
                    value={values.call_report}
                    onClick={(value: string) => setFieldValue("call_report", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Login/Logout Report"
                    value={values.login_logout_report}
                    onClick={(value: string) =>
                        setFieldValue("login_logout_report", value)
                    }
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Call Center Mode"
                    value={values.call_center_mode}
                    onClick={(value: string) => setFieldValue("call_center_mode", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Recording"
                    value={values.recording}
                    onClick={(value: string) => setFieldValue("recording", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Follow Up"
                    value={values.follow_up}
                    onClick={(value: string) => setFieldValue("follow_up", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Sticky Agent"
                    value={values.sticky_agent}
                    onClick={(value: string) => setFieldValue("sticky_agent", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Number Masking"
                    value={values.number_masking}
                    onClick={(value: string) => setFieldValue("number_masking", value)}
                />
                  <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Setting"
                    value={values.settings}
                    onClick={(value: string) => setFieldValue("settings", value)}
                />
                 <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Breakcode"
                    value={values.breakcode}
                    onClick={(value: string) => setFieldValue("breakcode", value)}
                />
                 <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Allow Black List"
                    value={values.allow_black_list}
                    onClick={(value: string) => setFieldValue("allow_black_list", value)}
                />

                 <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Unallocated Leads"
                    value={values.unallocated_leads}
                    onClick={(value: string) => setFieldValue("unallocated_leads", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Force Login"
                    value={values.force_login}
                    onClick={(value: string) => setFieldValue("force_login", value)}
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Automatic Logout"
                    value={values.auto_logout}
                    onClick={(value: string) => setFieldValue("auto_logout", value)}
                />
                {values.auto_logout === "0" && (
                    <Select
                        label="Idle Timeout"
                        name="idle_timeout"
                        options={[
                            // { label: "1 Minutes", value: "1" },
                            // { label: "2 Minutes", value: "2" },
                            // { label: "15 Minutes", value: "15" },
                            { label: "30 Minutes", value: "30" },
                            { label: "1 Hour", value: "60" },
                            { label: "2 Hours", value: "120" },
                            { label: "3 Hours", value: "180" },
                            { label: "6 Hours", value: "360" },
                            { label: "9 Hours", value: "540" },

                        ]}
                        value={values.idle_timeout}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                )}
                  <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Call Queue Selection"
                    value={values.callqueue_selection}
                    onClick={(value: string) => setFieldValue("callqueue_selection", value)}
                />
 
                {                
                 userTenantData?.tenant_detail?.roles?.[0]?.module_permission?.messaging?.whatsapp ?
                        <Switch
                            className="pt-[2px]"
                            switchButtonClass="py-1.5"
                            trueName="Yes"
                            falseName="No"
                            label="WhatsApp"
                            value={values?.whatsapp}
                    onClick={(value: string) => setFieldValue("whatsapp", value)}
                /> : <></>
                }
                 {
                    userTenantData?.tenant_detail?.roles?.[0]?.module_permission?.messaging?.instagram  ?
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Instagram"
                    value={values?.instagram}
                    onClick={(value: string) => setFieldValue("instagram", value)}
                /> : <></>
                }
                 {
                    userTenantData?.tenant_detail?.roles?.[0]?.module_permission?.messaging?.facebook  ?
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Facebook"
                    value={values?.facebook}
                    onClick={(value: string) => setFieldValue("facebook", value)}
                /> : <></>
                }
                 {
                    userTenantData?.tenant_detail?.roles?.[0]?.module_permission?.messaging?.sms  ?
                   <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="SMS"
                    value={values?.sms}
                    onClick={(value: string) => setFieldValue("sms", value)}
                />: <></>
            }
            </div>
        </CardForm>
    );
};

export default CreateEditUserRoleForm;
