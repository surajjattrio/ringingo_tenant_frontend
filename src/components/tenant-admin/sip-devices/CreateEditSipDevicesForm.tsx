"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import {
    sipDevicesCreate,
    sipDevicesSingleGet,
    sipDevicesUpdate,
    useSipDevicesData,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
    didOptionsGet,
    useDidOptions,
} from "@/redux/slice/tenant-admin/didSlice";
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

const CreateEditSipDevicesForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { user } = useAuth();
    const { id } = useParams();
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
        if (id) {
            onUpdateSip(payload);
        } else {
            onCreateSip(payload);
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
    }, [id]);

    useEffect(() => {
        onGetUserOptions();
        onGetDidOptions();
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

    const onGetSingleUserData = async () => {
        try {
            const res: any = await dispatch(sipDevicesSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const sipDevicesData = res?.data;
                setValues({
                    ...values,
                    device_name: sipDevicesData?.device_name,
                    username: sipDevicesData?.username,
                    password: sipDevicesData?.password,
                    caller_id_name: sipDevicesData?.caller_id_name,
                    caller_id_number: sipDevicesData?.caller_id_number,
                    user_uuid: sipDevicesData?.user_uuid,
                    status: sipDevicesData?.status || "0",
                });
            }
        } catch (err) {
            console.error("Get Single SIP Devices Data Err =-=>", err);
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

    const onUpdateSip = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(sipDevicesUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update SIP Device Err --->", e?.message);
        }
    };
    return (
        <CardForm
            id={id}
            name="extension"
            managerName={managerName}
            length={id ? 0 : sipDevices?.count}
            title={id ? "Edit SIP Devices" : "Create SIP Devices"}
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
                    label={
                        <>
                            Device Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="DeviceName"
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
                    label={
                        <>
                            &nbsp;&nbsp;&nbsp;User Name <span className="text-red-500">*</span>
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
                    name="caller_id_name"
                    label="Caller ID Name"
                    icon="CallerID"
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
                    label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Caller ID Number"
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
                    label={
                        <>
                            User <span className="text-red-500">*</span>
                        </>
                    }
                     icon="UserOutline"
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

export default CreateEditSipDevicesForm;
