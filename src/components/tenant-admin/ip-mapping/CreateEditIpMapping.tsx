"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    ipMappingCreate,
    ipMappingUpdate,
    updateSingleIpMappingData,
    useIpMapping,
    useSingleIpMapping,
} from "@/redux/slice/tenant-admin/ipMappingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/ipMappingTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditIpMappingForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const ipMappingData = useSingleIpMapping();
    const ipMapping = useIpMapping();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        ip: "",
        prefix: "",
        status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        ip: Yup.string().required("Please Enter Your IP"),
    });

    // Create or Update IP Mapping
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateIpMapping(payload);
        } else {
            onCreateIpMapping(payload);
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
        setValues({
            ...values,
            ip: ipMappingData?.ip,
            prefix: ipMappingData?.prefix,
            status: ipMappingData?.status || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ipMappingData, id]);

    // Create IP Mapping & Navigate to IP Mapping Page
    const onCreateIpMapping = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(ipMappingCreate(payload)).unwrap();
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
            console.error("Create IP Mapping Err --->", e?.message);
        }
    };

    // Update IP Mapping & Navigate to IP Mapping Page
    const onUpdateIpMapping = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(ipMappingUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleIpMappingData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update IP Mapping Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="ip_mapping"
            managerName={managerName}
            length={id ? 0 : ipMapping?.count}
            title={id ? "Edit IP Mapping" : "Create IP Mapping"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleIpMappingData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="ip"
                    label={
                        <>
                            IP <span className="text-red-500">*</span>
                        </>
                    }
                    icon="Id"
                    placeholder="Enter IP"
                    value={values.ip}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="prefix"
                    label="Set Prefix"
                    icon="Prefix"
                    placeholder="Enter Prefix"
                    value={values.prefix}
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
        </CardForm>
    );
};

export default CreateEditIpMappingForm;
