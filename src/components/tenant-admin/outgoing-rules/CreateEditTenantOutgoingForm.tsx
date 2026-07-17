"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    tenantOutgoingCreate,
    tenantOutgoingUpdate,
    updateSingleTenantOutgoingData,
    useTenantOutgoing,
    useSingleTenantOutgoing,
} from "@/redux/slice/tenant-admin/tenantOutgoingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";
import TenantAddRules from "./TenantAddRules";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/tenantOutgoingTypes";
import { ManagerNameTypes } from "@/types/formTypes";

// DATA
const initialRulesValues = {
    length: "0",
    prefix: "",
    strip: "",
    prepend: "",
    trunk_uuid: "",
    call_id_value: "",
    failover_trunk_1_uuid: "",
    failover_trunk_2_uuid: "",
};

const CreateEditTenantOutgoingForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const outgoingData = useSingleTenantOutgoing();
    const outgoing = useTenantOutgoing();

    const [rulesData, setRulesData] = useState([initialRulesValues]);
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        description: "",
        status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Outgoing Rule Name"),
    });

    // Create or Update Outgoing Rules
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["rules"] = rulesData;
        if (id) {
            onUpdateOutgoing(payload);
        } else {
            onCreateOutgoing(payload);
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
            name: outgoingData?.name,
            description: outgoingData?.description,
            status: outgoingData?.status || "0",
        });
        setRulesData(outgoingData?.rules || [initialRulesValues]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outgoingData, id]);

    // Create Outgoing Rules & Navigate to Outgoing Rules Page
    const onCreateOutgoing = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(tenantOutgoingCreate(payload)).unwrap();
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
            console.error("Create Outgoing Rules Err --->", e?.message);
        }
    };

    // Update Outgoing Rules & Navigate to Outgoing Rules Page
    const onUpdateOutgoing = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(tenantOutgoingUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleTenantOutgoingData({}));
                setRulesData([initialRulesValues]);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Outgoing Rules Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="og_rules"
            managerName={managerName}
            length={id ? 0 : outgoing?.count}
            title={id ? "Edit Outgoing Rule" : "Create Outgoing Rule"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleTenantOutgoingData({}));
                id && setRulesData([initialRulesValues]);
            }}
        >
            <div className="pt-5 pb-5 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="name"
                    label={
                        <>
                            Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserOutline"
                    placeholder="Enter Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="description"
                    label="Description"
                    icon="Description"
                    placeholder="Enter Description"
                    value={values.description}
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
            <TenantAddRules rulesData={rulesData} setRulesData={setRulesData} />
        </CardForm>
    );
};

export default CreateEditTenantOutgoingForm;
