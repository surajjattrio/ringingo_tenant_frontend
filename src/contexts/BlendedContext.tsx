"use client";
import { createContext, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    blendedCreate,
    blendedFeatureUpdate,
    blendedUpdate,
} from "@/redux/slice/tenant-admin/blendedSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "./hooks/useAuth";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/blendedTypes";

// TYPES
interface BlendedContextTypes {
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
    auto_answer: "1",
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
    target_drop_percentage: "1",
    max_predictive_call_count: "1",
    answering_machine_detection: "1",
    custom_caller_id: "",
    cps: '1',
    amd_promptuuid: "",
    wrap_up_disposition: "",
    wrap_up_time: "",
    webform_uuid: [],
    agent_script: "1",
    agent_script_text: "",
    allowed_messaging_queue: [],
};

const BlendedContext = createContext<BlendedContextTypes | null>(null);

export const BlendedProvider = ({
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
        name: Yup.string().required("Please Enter Blended Campaign Name"),
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

    // Create or Update Blended
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateBlended(payload);
        } else {
            onCreateBlended(payload);
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

    // Create Blended & Navigate to Blended Page
    const onCreateBlended = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(blendedCreate(payload)).unwrap();
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
            console.error("Create Blended Err --->", e?.message);
        }
    };

    // Update Blended
    const onUpdateBlended = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(blendedUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Blended Err --->", e?.message);
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
            const res: any = await dispatch(blendedFeatureUpdate(payload)).unwrap();
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
        <BlendedContext.Provider
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
        </BlendedContext.Provider>
    );
};

export default BlendedContext;