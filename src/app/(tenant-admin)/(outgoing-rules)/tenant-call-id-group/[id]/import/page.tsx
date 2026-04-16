"use client";
import { useRouter , useParams } from "next/navigation";
import { useState } from "react";

// PROJECT IMPORT
import { CardForm } from "@/components/ui-components";
import { useAppDispatch } from "@/redux/hooks";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { callerIdImport } from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { FilePicker } from "@/components/pickers";

const Import = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { id } = useParams();


    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: any = {
        file: "",
    };

    const validationSchema = Yup.object<any>({
        file: Yup.string().required("Please select file"),
    });

    // Import Caller ID
    const onSubmit = (values: any) => {
        const payload = new FormData()
        payload.append('file', values.file)
        payload.append('caller_id_group_uuid', id)
        onImportCallerId(payload);
    };

    // Import Caller ID
    const onImportCallerId = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(callerIdImport(values)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Import Caller ID Err --->", e?.message);
        }
    };

    const {
        values,
        touched,
        errors,
        setFieldValue,
        handleBlur,
        handleSubmit,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <>
            <CardForm
                title="Import Caller ID"
                loading={loading}
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    resetForm();
                    router.back();
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                    <FilePicker
                        name="file"
                        label="Select File"
                        placeholder="Choose file to import"
                        value={values.file}
                        accept=".csv"
                        touched={touched}
                        errors={errors}
                        onChange={(file: any) => {
                            setFieldValue("file", file);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                </div>
            </CardForm>
        </>
    );
};

export default Import;
