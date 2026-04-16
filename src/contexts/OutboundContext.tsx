"use client";
import { createContext, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    outboundCreate,
    outboundFeatureUpdate,
    outboundUpdate,
} from "@/redux/slice/tenant-admin/outboundSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "./hooks/useAuth";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/outboundTypes";

// TYPES
interface OutboundContextTypes {
    values: InitialValueType;
    touched: any;
    errors: any;
    loading: boolean;
    leadData: any;
    setLeadData: React.Dispatch<React.SetStateAction<any>>;
    handleBlur: (e: any) => any;
    handleChange: (e: any) => any;
    handleSubmit: (e: any, tab: number) => any;
    setValues: (e: any) => any;
    setFieldValue: (e: any, b: any) => any;
    resetForm: () => any;
}

const initialValues: InitialValueType = {
    name: "",
    dial_method: "",
    lead_group_uuid: "",
    outgoing_rule_uuid: "",
    lead_type: "0",
    status: "0",
    manual_outgoing_rule_uuid: "",
    threeway_outgoing_rule_uuid: "",

    call_id_type: "0",
    call_id_value: "",
    description: "",
    concurrent_call: "",
    call_retries: "0",
    timeout: "30",
    agent_timeout: "30",
    max_dial_level: "1",
    greeting_uuid: "",
    recording: "0",
    number_masking: "1",
    max_retries: "3",
    retries_time: "10",
    caller_id_time: "",
    three_way_caller_id: "0",
    call_queue_uuid: [],
    ring_group_uuid: [],
    allow_ring_group_transfer: [],
    allow_call_queue_transfer: [],
    allow_ivr_transfer: [],
    max_retries_disposition: [],
    wrap_up_disposition: "",
    wrap_up_time: "",
    target_drop_percentage: "1",
    max_predictive_call_count: "1",
    answering_machine_detection: "1",
    custom_caller_id: "",
    cps: '1',
    amd_promptuuid: "",
    webform_uuid: [],
    auto_answer: "0",
    agent_script: "1",
    agent_script_text: "",
};

const OutboundContext = createContext<OutboundContextTypes | null>(null);

export const OutboundProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { id } = useParams();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [leadData, setLeadData] = useState<any>([]);

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Outbound Campaign Name"),
        dial_method: Yup.string().required("Please Select Dial Method"),
        lead_group_uuid: Yup.string().required("Please Select Lead Group"),
        outgoing_rule_uuid: Yup.string().required("Please Select Outgoing Rules"),
        //call_id_value: Yup.string().required("Please enter/select caller id"),
        //amd_promptuuid: Yup.string().when("answering_machine_detection", { is: "0", then: (e) => e.required("Please select any amd prompt")}),
        call_id_value: Yup.string().when("call_id_type", {
            is: (value: any) => value === "0" || value === "1" || value === "2" || value === "3", // Apply validation when call_id_type is "0" or "2"
            then: (e) => e.required("Please Select Caller Id"),
            otherwise: (e) => e // No validation for other values of call_id_type

        })
    });

    // Create or Update Outbound
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateOutbound(payload);
        } else {
            onCreateOutbound(payload);
        }
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit: onFormikClick,
        setValues,
        setFieldValue,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const handleSubmit = (e: any) => {
        onFormikClick(e);
    };

    // Create Outbound & Navigate to Outbound Page
    const onCreateOutbound = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(outboundCreate(payload)).unwrap();
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
            console.error("Create Outbound Err --->", e?.message);
        }
    };

    // Update Outbound
    const onUpdateOutbound = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(outboundUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Outbound Err --->", e?.message);
        }
    };

    // Update Lead Group
    const onUpdateLeadGroup = async () => {
        setLoading(true);
        try {
            const payload = {
                leadData,
                feature: "disposition",
            };
            const res: any = await dispatch(outboundFeatureUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Lead Group Err --->", e?.message);
        }
    };

    return (
        <OutboundContext.Provider
            value={{
                values,
                touched,
                errors,
                loading,
                leadData,
                setLeadData,
                handleBlur,
                handleChange,
                handleSubmit,
                setValues,
                setFieldValue,
                resetForm,
            }}
        >
            {children}
        </OutboundContext.Provider>
    );
};

export default OutboundContext;
