"use client";
import { createContext, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    voiceBroadcastAdd,
    voiceBroadcastUpdate,
} from "@/redux/slice/tenant-admin/voiceBroadcastSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { formatDate } from "@/helperFunctions";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/voiceBroadcastTypes";
import { format } from "date-fns";

// TYPES
interface VoiceBroadcastTypes {
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

const initialValues: InitialValueType = {
    name: "",
    caller_id_type: "0",
    caller_id: "",
    channel: "",
    max_retries: "3",
    max_retries_disposition_uuid: [],
    outgoing_rule_uuid: "",
    timeout: "",
    status: "0",
    amd: "1",
    recording: "1",
    start_date: "",
    end_date: "",
    skip: "",
    welcome_prompt_uuid: "",
    playfile_time: "",
    welcome_prompt_selected_value: [
        {
            digit: "0",
            value: "",
        },
        {
            digit: "1",
            value: "",
        },
        {
            digit: "2",
            value: "",
        },
    ],
    exit_prompt_uuid: "",
    broadcast_type: "0",
    ivr_uuid: "",
    survey_value: [
        {
            prompt_uuid: "",
            from: "",
            to: "",
            prompt_name: "",
        },
    ],
    lead_group_uuid: [],
};

const VoiceBroadcastContext = createContext<VoiceBroadcastTypes | null>(null);

export const VoiceBroadcastProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Your Name"),
        caller_id: Yup.string().required("Please Select Caller Id"),
        channel: Yup.string().required("Please Select Channel"),
        max_retries_disposition_uuid: Yup.array()
            .min(1, "Please Select Disposition")
            .required("Please Select Disposition"),
        welcome_prompt_uuid: Yup.string().required("Please Select Welcome Prompt"),
        exit_prompt_uuid: Yup.string().required("Please Select Exit Prompt"),
        start_date: Yup.string().required("Please Select Start Date"),
        end_date: Yup.string().required("Please Select End Date"),
        outgoing_rule_uuid: Yup.string().required("Please Select Outgoing Rule"),
    });

    // Create or Update Outbound
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["start_date"] = format(
            new Date(values?.start_date),
            "yyyy-MM-dd HH:mm:ss"
        );
        payload["end_date"] = format(
            new Date(values?.end_date),
            "yyyy-MM-dd HH:mm:ss"
        );
        if (payload["broadcast_type"] === "0") delete payload["ivr_uuid"];
        if (payload["broadcast_type"] === "1") payload["survey_value"] = [];

        if (id) {
            onUpdateVoiceBroadcast(payload);
        } else {
            onCreateVoiceBroadcast(payload);
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

    // Create voice broadcast & Navigate to voice broadcast Page
    const onCreateVoiceBroadcast = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(voiceBroadcastAdd(payload)).unwrap();
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
            console.error("Create voice broadcast Err --->", e?.message);
        }
    };

    // Update voice broadcast
    const onUpdateVoiceBroadcast = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(voiceBroadcastUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update voice broadcast Err --->", e?.message);
        }
    };

    return (
        <VoiceBroadcastContext.Provider
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
        </VoiceBroadcastContext.Provider>
    );
};

export default VoiceBroadcastContext;
