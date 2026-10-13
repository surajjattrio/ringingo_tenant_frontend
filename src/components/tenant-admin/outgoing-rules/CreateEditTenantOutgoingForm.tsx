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
import { Input, Select, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";
import TenantAddRules from "./TenantAddRules";
import TenantCliRouteRules, { initialCliRouteValues } from "./TenantCliRouteRules";

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

const noCliModeOptions = [
    { value: "first", label: "First CLI of first route" },
    { value: "round_robin", label: "Round Robin on CLIs of first route" },
];

const routeTypeOptions = [
    { value: "prefix", label: "Prefix Based (Length / Prefix / Strip / Prepend)" },
    { value: "cli", label: "CLI Based (route by Caller ID)" },
];

const CreateEditTenantOutgoingForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const outgoingData = useSingleTenantOutgoing();
    const outgoing = useTenantOutgoing();

    const [rulesData, setRulesData] = useState([initialRulesValues]);
    const [cliRulesData, setCliRulesData] = useState<any[]>([{ ...initialCliRouteValues }]);
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        description: "",
        status: "0",
        route_type: "prefix",
        no_cli_mode: "first",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Outgoing Rule Name"),
    });

    // Create or Update Outgoing Rules
    const onSubmit = (values: any) => {
        const isCliRoute = values.route_type === "cli";
        const activeRules = isCliRoute ? cliRulesData : rulesData;
        if (isCliRoute) {
            const noCliRow = cliRulesData?.findIndex((r: any) => !r?.match_cli?.length || !r?.trunk_uuid);
            if (noCliRow !== -1) {
                Danger(`Route ${noCliRow + 1}: select CLIs and Trunk before saving.`);
                return;
            }
        }
        const missingRow = getMissingFailoverDidRow(activeRules);
        if (missingRow !== -1) {
            Danger(`Row ${missingRow + 1}: select the Caller ID for the selected Failover Trunk before saving.`);
            return;
        }
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["rules"] = activeRules;
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
            route_type: outgoingData?.route_type || "prefix",
            no_cli_mode: outgoingData?.no_cli_mode || "first",
        });
        if (outgoingData?.route_type === "cli") {
            setCliRulesData(outgoingData?.rules?.length ? outgoingData.rules : [{ ...initialCliRouteValues }]);
            setRulesData([initialRulesValues]);
        } else {
            setRulesData(outgoingData?.rules || [initialRulesValues]);
            setCliRulesData([{ ...initialCliRouteValues }]);
        }
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
                setCliRulesData([{ ...initialCliRouteValues }]);
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
                id && setCliRulesData([{ ...initialCliRouteValues }]);
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
                <Select
                    name="route_type"
                    label="Route Type"
                    icon="Trunk"
                    placeholder="Select Route Type"
                    options={routeTypeOptions}
                    value={values.route_type}
                    onChange={(e: any) => setFieldValue("route_type", e.target.value)}
                    isInfo
                />
                {values.route_type === "cli" && (
                    <Select
                        name="no_cli_mode"
                        label="No CLI Selected"
                        icon="CallerID"
                        placeholder="When agent / campaign has no CLI"
                        options={noCliModeOptions}
                        value={values.no_cli_mode}
                        onChange={(e: any) => setFieldValue("no_cli_mode", e.target.value)}
                        isInfo
                    />
                )}
            </div>
            {values.route_type === "cli" ? (
                <TenantCliRouteRules rulesData={cliRulesData} setRulesData={setCliRulesData} />
            ) : (
                <TenantAddRules rulesData={rulesData} setRulesData={setRulesData} />
            )}
        </CardForm>
    );
};

export default CreateEditTenantOutgoingForm;
