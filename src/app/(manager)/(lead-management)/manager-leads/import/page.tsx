"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    leadGroupOptionsGet,
    useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import { LeadManagementImport } from "@/redux/slice/tenant-admin/leadManagementSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Icon } from "@/components/ui-components";
import { filterByOptions } from "@/config/options";
import { FilePicker } from "@/components/pickers";
import { downloadFile } from "@/helperFunctions";
import { useAppDispatch } from "@/redux/hooks";
import { Input, Select } from "@/components/forms";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { ImportInitialValueType } from "@/types/tenant-admin/leadManagementTypes";

// ASSETS
const SampleCsv = "/assets/sample-files/lead_import_sample.csv";

const Import = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const leadGroupOptions = useLeadGroupOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: ImportInitialValueType = {
        lead_group_uuid: "",
        filter_by: "0",
        file: "",
        phone_code: "",
    };

    const validationSchema = Yup.object<ImportInitialValueType>({
        lead_group_uuid: Yup.string().required("Please select lead group"),
        file: Yup.string().required("Please choose file"),
    });

    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("lead_group_uuid", values.lead_group_uuid);
        payload.append("filter_by", values.filter_by);
        payload.append("file", values.file);
        payload.append("phone_code", values.phone_code);

        onImportLeadManagement(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
        handleChange,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        onGetLeadGroupOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Lead Group Options
    const onGetLeadGroupOptions = async () => {
        try {
            await dispatch(leadGroupOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Lead Group Options Err =-=>", err);
        }
    };

    const onImportLeadManagement = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(LeadManagementImport(values)).unwrap();
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
            console.error("Import Lead menagement Err =-=>", err);
        }
    };

    return (
        <>
            <CardForm
                loading={loading}
                title="Import Lead Management"
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
                        name="lead_group_uuid"
                        label="Lead Group"
                        placeholder="Select Lead Group"
                        removable
                        options={leadGroupOptions}
                        value={values.lead_group_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("lead_group_uuid", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Select
                        name="filter_by"
                        label="Lead Duplicate Check"
                        placeholder="Select Filter By"
                        options={filterByOptions}
                        value={values.filter_by}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("filter_by", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        type="number"
                        name="phone_code"
                        label="Phone Code"
                        placeholder="Enter Phone Code"
                        value={values.phone_code}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
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
