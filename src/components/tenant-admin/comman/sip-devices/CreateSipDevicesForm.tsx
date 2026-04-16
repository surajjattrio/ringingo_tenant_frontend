"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    sipDevicesCreate,
    useSipDevicesData,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { didOptionsGet, useDidOptions } from "@/redux/slice/tenant-admin/didSlice";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Password, Select, Switch } from "@/components/forms";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/sipDevicesTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateSipDevicesForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const userOptions = useUserOptions();
    const sipDevices = useSipDevicesData();
    const didOptions = useDidOptions();
    
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        device_name: "",
        username: "",
        password: "",
        caller_id_name: "",
        caller_id_number: "",
        user_uuid: "",
        status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        device_name: Yup.string().required("Please Enter Your Device Name"),
        username: Yup.string().required("Please Enter Your UserName"),
        password: Yup.string().required("Please Enter Your Password"),
        user_uuid: Yup.string().required("Please Select User"),
    });

    const onSubmit = (values: any) => {
        const payload = { ...values };

        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        onCreateSip(payload);
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
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetUserOptions();
        onGetDidOptions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching DID Options
    const onGetDidOptions = async () => {
        try {
            await dispatch(didOptionsGet());
        } catch (err) {
            console.error("Get DID Options Err =-=>", err);
        }
    };

    const onCreateSip = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(sipDevicesCreate(payload)).unwrap();
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
            console.error("Create SIP Device Err --->", e?.message);
        }
    };

    return (
        <CardForm
            name="extension"
            managerName={managerName}
            length={sipDevices?.count}
            title="Create SIP Devices"
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="device_name"
                    label="Device Name"
                    placeholder="Enter device name"
                    value={values.device_name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="username"
                    label="Username"
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
                <Input
                    name="caller_id_name"
                    label="Caller ID Name"
                    placeholder="Enter caller id name"
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
                    icon="CallGray"
                    removable
                    options={didOptions}
                    value={values.caller_id_number}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("caller_id_number", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="user_uuid"
                    label="User"
                    placeholder="Select user"
                    removable
                    options={userOptions}
                    value={values.user_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("user_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
            </div>
        </CardForm>
    );
};

export default CreateSipDevicesForm;
