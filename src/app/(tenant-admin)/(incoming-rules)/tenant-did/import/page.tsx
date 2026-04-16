"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { didImport } from "@/redux/slice/tenant-admin/didSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Icon } from "@/components/ui-components";
import { Select } from "@/components/forms";
import { FilePicker } from "@/components/pickers";
import { downloadFile } from "@/helperFunctions";

// ASSETS
const SampleCsv = "/assets/sample-files/did_import_sample.csv";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { ImportInitialValueType } from "@/types/tenant-admin/didTypes";

const Import = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: ImportInitialValueType = {
        user_uuid: "",
        file: "",
    };

    const validationSchema = Yup.object<ImportInitialValueType>({
        user_uuid: Yup.string().required("Please select user"),
        file: Yup.string().required("Please choose file"),
    });

    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("user_uuid", values.user_uuid);
        payload.append("file", values.file);
        onImportDid(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        onGetUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    const onImportDid = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(didImport(values)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                resetForm();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Import DID Err =-=>", err);
        }
    };

    return (
        <>
            <CardForm
                loading={loading}
                title="Import DID"
                doneText="Import"
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    resetForm();
                    router.back();
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                    <Select
                        name="user_uuid"
                        label="User"
                        placeholder="Select User"
                        removable
                        options={userOptions}
                        value={values.user_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("user_uuid", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
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
                    <div className="flex flex-col items-start">
                        <div className="text-xs font-semibold pb-2 flex items-center">
                            <label>Download Sample CSV</label>
                            <Icon
                                tooltip="Download Sample CSV"
                                className="ml-3 cursor-pointer"
                                name="InfoCircle"
                                width={15}
                                height={15}
                                alt="Download Sample CSV"
                            />
                        </div>
                        <div
                            className="pl-5"
                            onClick={() => {
                                downloadFile(SampleCsv, "Download_sample");
                            }}
                        >
                            <Icon
                                className="cursor-pointer"
                                name="Download"
                                width={30}
                                height={30}
                                alt="Download"
                            />
                        </div>
                    </div>
                </div>
            </CardForm>
        </>
    );
};

export default Import;
