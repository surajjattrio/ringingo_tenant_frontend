import { useState } from "react";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    tenantCallBarge,
    tenantCallMonitoring,
    tenantCallWhisper,
} from "@/redux/slice/tenant-admin/tenantLiveCallSlice";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Success } from "@/redux/services/toasterServices";
import { Select } from "@/components/forms";
import { ModalHeader } from "@/components/modals";
import { useSipNameOptions } from "@/redux/slice/tenant-admin/sipDevicesSlice";

//THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
interface AgentCallActionModalProps {
    title: string;
    visible: boolean;
    data?: string;
    onCancelClick?: any;
}

interface initialValues {
    extension: string;
}

const AgentCallActionModal = (props: AgentCallActionModalProps) => {
    const { data, title, visible = false, onCancelClick } = props;

    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const sipOptions = useSipNameOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: initialValues = {
        extension: "",
    };

    const validationSchema = Yup.object<initialValues>({
        extension: Yup.string().required("Please select any sip device"),
    });

    // Create or Update User Role
    const onSubmit = async (values: initialValues) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                call_uuid: data || "",
                domain: user?.tenant_detail?.domain,
            };

            if (title === "Monitor") {
                const res: any = await dispatch(tenantCallMonitoring(payload)).unwrap();
                if (res && res.statusCode === 200) {
                    Success(res?.data);
                    onCancelClick();
                    resetForm();
                    setLoading(false);
                }
            } else if (title === "Barge") {
                const res: any = await dispatch(tenantCallBarge(payload)).unwrap();
                if (res && res.statusCode === 200) {
                    Success(res?.data);
                    onCancelClick();
                    resetForm();
                    setLoading(false);
                }
            } else if (title === "Whisper") {
                const res: any = await dispatch(tenantCallWhisper(payload)).unwrap();
                if (res && res.statusCode === 200) {
                    Success(res?.data);
                    onCancelClick();
                    resetForm();
                    setLoading(false);
                }
            }
        } catch (error: any) {
            console.log("call action err: --->", error?.message);
            setLoading(false);
        }
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleSubmit,
        setValues,
        setFieldValue,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <>
            <ModalHeader
                isLoading={loading}
                visible={visible}
                title={`Call ${title}`}
                onCancelClick={() => {
                    onCancelClick();
                    resetForm();
                }}
                form="liveCall"
                type="submit"
            >
                <form onSubmit={handleSubmit} id="liveCall">
                    <div className="grid grid-cols-3">
                        <Select
                            label="SIP Device"
                            name="extension"
                            placeholder="Select SIP Device"
                            removable
                            options={sipOptions}
                            isPortal={false}
                            value={values.extension}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("extension", e.target.value);
                            }}
                            onBlur={handleBlur}
                        />
                    </div>
                </form>
            </ModalHeader>
        </>
    );
};

export default AgentCallActionModal;
