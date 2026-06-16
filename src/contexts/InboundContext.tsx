"use client";
import { createContext, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    inboundCreate,
    inboundUpdate,
} from "@/redux/slice/tenant-admin/inboundSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "./hooks/useAuth";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/inboundTypes";

// TYPES
interface InboundContextTypes {
    values: InitialValueType;
    touched: any;
    errors: any;
    loading: boolean;
    handleBlur: (e: any) => any;
    handleChange: (e: any) => any;
    handleSubmit: (e: any, tab: number) => any;
    setValues: (e: any) => any;
    setFieldValue: (e: any, b: any) => any;
    resetForm: () => any;
}

const InboundContext = createContext<InboundContextTypes | null>(null);

export const InboundProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { id } = useParams();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
      name: "",
      outgoing_rule_uuid: "",
      status: "0",

      description: "",
      call_queue_uuid: [],
      recording: "0",
      number_masking: "1",
      allow_ring_group_transfer: [],
      allow_call_queue_transfer: [],
      allow_ivr_transfer: [],
      three_way_caller_id: "0",
      custom_caller_id: "",
      webform_uuid: [],
      wrap_up_disposition: "",
      wrap_up_time: "",
      auto_answer: "0",
      agent_script: "1",
      agent_script_text: "",
      email_config_uuid: "",
      api_config_uuid: "",
      email_type: "none",
      message_config_uuid: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Inbound Campaign Name"),
        outgoing_rule_uuid: Yup.string().required("Please Select Outgoing Rule"),
    });

    // Create or Update Inbound
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateInbound(payload);
        } else {
            onCreateInbound(payload);
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

    // Create Inbound & Navigate to Inbound Page
    const onCreateInbound = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(inboundCreate(payload)).unwrap();
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
            console.error("Create Inbound Err --->", e?.message);
        }
    };

    // Update Inbound
    const onUpdateInbound = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(inboundUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Inbound Err --->", e?.message);
        }
    };

    return (
        <InboundContext.Provider
            value={{
                values,
                touched,
                errors,
                loading,
                handleBlur,
                handleChange,
                handleSubmit,
                setValues,
                setFieldValue,
                resetForm,
            }}
        >
            {children}
        </InboundContext.Provider>
    );
};

export default InboundContext;
