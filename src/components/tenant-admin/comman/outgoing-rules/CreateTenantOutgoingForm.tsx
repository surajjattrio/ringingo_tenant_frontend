"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    tenantOutgoingCreate,
    useTenantOutgoing,
} from "@/redux/slice/tenant-admin/tenantOutgoingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";
import TenantAddRules from "./TenantAddRules";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/tenantOutgoingTypes";

interface CreateTenantOutgoingFormProps {
    trunkPath: string;
    managerName?: string;
}

// DATA
const initialRulesValues = {
    length: "0",
    prefix: "",
    strip: "",
    prepend: "",
    trunk_uuid: "",
    failover_trunk_1_uuid: "",
    failover_trunk_1_call_id: "",
    failover_trunk_2_uuid: "",
    failover_trunk_2_call_id: "",
};

// A Failover Trunk's Caller ID becomes required the moment that failover trunk is selected on a rule row
// (main Trunk's Caller ID is unaffected — it keeps coming from the campaign/extension as today).
const getMissingFailoverDidRow = (rules: any[]) => {
    const idx = rules?.findIndex(
        (r: any) =>
            (r?.failover_trunk_1_uuid && !r?.failover_trunk_1_call_id) ||
            (r?.failover_trunk_2_uuid && !r?.failover_trunk_2_call_id)
    );
    return idx ?? -1;
};

const CreateTenantOutgoingForm = (props: CreateTenantOutgoingFormProps) => {
    const { trunkPath, managerName } = props;

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const outgoing = useTenantOutgoing();

    const [rulesData, setRulesData] = useState([initialRulesValues]);
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        description: "",
        status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
    });

    // Create or Update Outgoing Rules
    const onSubmit = (values: any) => {
        const missingRow = getMissingFailoverDidRow(rulesData);
        if (missingRow !== -1) {
            Danger(`Row ${missingRow + 1}: select the Caller ID for the selected Failover Trunk before saving.`);
            return;
        }
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["rules"] = rulesData;
        onCreateOutgoing(payload);
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

    return (
        <CardForm
            name="og_rules"
            managerName={managerName}
            length={outgoing?.count}
            title="Create Outgoing Rule"
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
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
                <Input
                    name="description"
                    label="Description"
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
            <TenantAddRules
                rulesData={rulesData}
                setRulesData={setRulesData}
                trunkPath={trunkPath}
            />
        </CardForm>
    );
};

export default CreateTenantOutgoingForm;
