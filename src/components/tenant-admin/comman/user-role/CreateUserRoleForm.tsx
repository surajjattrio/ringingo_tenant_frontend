"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

//THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    useSingleUserRole,
    useUserRole,
    userRoleCreate,
} from "@/redux/slice/tenant-admin/userRoleSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/userRoleTypes";
import { ManagerNameTypes } from "@/types/formTypes";
import Cookies from "js-cookie";

const CreateUserRoleForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const userRole = useUserRole();
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
        sms: "1",
        unallocated_leads: "1",
        instagram: "1",
        facebook: "1",
        force_login:"1",
        callqueue_selection: "1"
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
    });

    // Create or Update User Role
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        onCreateUserRole(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

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

    return (
        <CardForm
            name="user_role"
            managerName={managerName}
            length={userRole?.count}
            title="Create User Role"
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
                resetForm();
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
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
                            value={values.whatsapp}
                            onClick={(value: string) => setFieldValue("whatsapp", value)}
                        /> : <></>
                }
                {
                    userTenantData?.tenant_detail?.roles?.[0]?.module_permission?.messaging?.sms ?
                        <Switch
                            className="pt-[2px]"
                            switchButtonClass="py-1.5"
                            trueName="Yes"
                            falseName="No"
                            label="SMS"
                            value={values.sms}
                            onClick={(value: string) => setFieldValue("sms", value)}
                        /> : <></>
                }
            </div>
        </CardForm>
    );
};

export default CreateUserRoleForm;
