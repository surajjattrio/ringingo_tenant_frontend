"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import {
    sipNameOptionsGet,
    useSipNameOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
    tenantTrunkCreate,
    tenantTrunkSingleGet,
    tenantTrunkUpdate,
    useTenantTrunkData,
} from "@/redux/slice/tenant-admin/tenantTrunkSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import {
    Input,
    InputNumber,
    Password,
    Select,
    Switch,
} from "@/components/forms";
import { CardForm, Icon } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { InitialValueType } from "@/types/tenant-admin/trunkTypes";
import TrunkSipProfileSelect from "@/components/tenant-admin/trunk/TrunkSipProfileSelect";
import { ManagerNameTypes } from "@/types/formTypes";

/* ============================== CREATE & EDIT TRUNK FORM ============================== */

const CreateTenantTrunkForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const trunkData = useTenantTrunkData();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOptionalInfo, setIsOptionalInfo] = useState(false);

    const initialValues: InitialValueType = {
        name: "",
        sip_profile_uuid: "",
        register: "0",
        username: "",
        password: "",
        domain: "",
        outbound_proxy: "",
        status: "0",

        from_domain: "",
        from_user: "",
        realm: "",
        extension_in_contact: "1",
        extension: "",
        expire_seconds: "60",
        reg_transport: "",
        contact_params: "",
        ping: "60",
        retry_seconds: "60",
        register_proxy: "",
        dialplan_variable: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
        domain: Yup.string().required("Please enter domain"),
    });

    // Create or Update Trunk
    const onSubmit = (values: any) => {
        let payload = { ...values };
        onCreateTenantTrunk(payload);
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
        onGetSipNameOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (values?.register === "1") {
            touched["username"] = false;
            touched["password"] = false;
            delete errors["username"];
            delete errors["password"];
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values, errors, touched]);

    // Fetching SIP Devices Options for Extension
    const onGetSipNameOptions = async () => {
        try {
            await dispatch(sipNameOptionsGet());
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    // Create Trunk & Navigate to Trunk Page
    const onCreateTenantTrunk = async (val: InitialValueType) => {
        setLoading(true);
        try {
            const payload = { ...val };
            const res: any = await dispatch(tenantTrunkCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create trunk Err --->", e?.message);
        }
    };

    return (
        <CardForm
            name="trunk"
            managerName={managerName}
            length={trunkData?.count}
            title="Create SIP Trunks"
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="name"
                    label="Name"
                    icon="UserOutline"
                    placeholder="Enter Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    noSpace
                    isInfo
                />
                <TrunkSipProfileSelect
                    value={values.sip_profile_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(value: string) => setFieldValue("sip_profile_uuid", value)}
                />
                <Switch
                    trueName="Yes"
                    falseName="No"
                    className="pt-[2px]"
                    label="Register"
                    value={values.register}
                    onClick={(value: string) => setFieldValue("register", value)}
                />
                <Input
                    name="username"
                    label="Username"
                    icon="UserOutline"
                    placeholder="Enter Username"
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
                    name="domain"
                    label="Domain"
                    icon="Domain"
                    placeholder="Enter Domain"
                    value={values.domain}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="outbound_proxy"
                    label="Outbound Proxy"
                    placeholder="Enter Outbound Proxy"
                    value={values.outbound_proxy}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
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
            <div className="shadow-box mb-10">
                <div
                    className={`${isOptionalInfo ? "text-primary bg-primary-v10" : ""
                        } py-4 px-6 rounded-t-md flex justify-between items-center`}
                >
                    <span className="text-sm font-bold">Optional Information</span>
                    <Icon
                        name={isOptionalInfo ? "MinusCircleGreen" : "PlusCircle"}
                        className="cursor-pointer"
                        width={20}
                        height={20}
                        alt={isOptionalInfo ? "IconMinusCircle" : "IconPlusCircle"}
                        onClick={() => setIsOptionalInfo(!isOptionalInfo)}
                    />
                </div>
                <div
                    className={`py-6 px-4 bd-white gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 ${!isOptionalInfo ? "hidden" : ""
                        }`}
                >
                    <Input
                        name="from_domain"
                        label="From Domain"
                        placeholder="Enter domain"
                        value={values.from_domain}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        name="from_user"
                        label="From User"
                        placeholder="Enter User"
                        value={values.from_user}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        name="realm"
                        label="Realm"
                        placeholder="Enter Realm"
                        value={values.realm}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Switch
                        trueName="Yes"
                        falseName="No"
                        className="pt-[2px]"
                        label="Extension-In-contact"
                        value={values.extension_in_contact}
                        onClick={(value: string) =>
                            setFieldValue("extension_in_contact", value)
                        }
                    />
                    <Input
                        name="extension"
                        label="Extension"
                        placeholder="Enter extension"
                        value={values.extension}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <InputNumber
                        name="expire_seconds"
                        label="Expire Seconds"
                        value={values.expire_seconds}
                        touched={touched}
                        errors={errors}
                        onChange={(value: string) => setFieldValue("expire_seconds", value)}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        name="reg_transport"
                        label="Reg-Transport"
                        placeholder="Enter Reg-Transport"
                        value={values.reg_transport}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        name="contact_params"
                        label="Contact Params"
                        placeholder="Enter contact params"
                        value={values.contact_params}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        type="number"
                        name="ping"
                        label="Ping"
                        placeholder="Enter Ping"
                        value={values.ping}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <InputNumber
                        name="retry_seconds"
                        label="Retry Seconds"
                        value={values.retry_seconds}
                        touched={touched}
                        errors={errors}
                        onChange={(value: string) => setFieldValue("retry_seconds", value)}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        name="register_proxy"
                        label="Register-Proxy"
                        placeholder="Enter register domain"
                        value={values.register_proxy}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        name="dialplan_variable"
                        label="Dialplan Variable"
                        placeholder="Enter Dialplan Variable"
                        value={values.dialplan_variable}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                </div>
            </div>
        </CardForm>
    );
};

export default CreateTenantTrunkForm;
