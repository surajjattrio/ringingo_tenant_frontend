"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { areaCodeImport } from "@/redux/slice/tenant-admin/manageAreaCodeSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Icon } from "@/components/ui-components";
import { Select } from "@/components/forms";
import { FilePicker } from "@/components/pickers";
import { downloadFile } from "@/helperFunctions";

// ASSETS
const SampleCsv = "/assets/sample-files/Areacode_Download_sample.csv";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { ImportInitialValueType } from "@/types/tenant-admin/manageAreaCodeTypes";
import { stateOptionsGet, useStateOptions } from "@/redux/slice/tenant-admin/manageStateSlice";
import { timezoneOptionsGet, useTimezoneOptions } from "@/redux/slice/master-admin/timezoneSlice";

const Import = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    // const stateOptions = useStateOptions();
    const timezoneOptions = useTimezoneOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: ImportInitialValueType = {
        // state_id: "",
        timezone_uuid: "",
        file: "",
    };

    const validationSchema = Yup.object<ImportInitialValueType>({
        // state_id: Yup.string().required("Please select state"),
        timezone_uuid: Yup.string().required("Please select time zone"),
        file: Yup.string().required("Please choose file"),
    });

    const onSubmit = (values: any) => {
        const payload = new FormData();
        // payload.append("state_id", values.state_id);
        payload.append("timezone_uuid", values.timezone_uuid);
        payload.append("file", values.file);
        onImportAreaCode(payload);
    };
    // Fetching State Options
    const onGetStateOptions = async () => {
        try {
            await dispatch(stateOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get State Options Err =-=>", err);
        }
    };
    useLayoutEffect(() => {
        // onGetStateOptions();
        onGetTimeZonesOptions();
    }, []);

    // Fetching Time Zones Options
    const onGetTimeZonesOptions = async () => {
        try {
            await dispatch(timezoneOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get TimeZones Data Err --->", e?.message);
        }
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

    const onImportAreaCode = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(areaCodeImport(values)).unwrap();
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
            console.error("Import Area Code Err =-=>", err);
        }
    };

    return (
        <>
            <CardForm
                loading={loading}
                title="Import Area Code"
                doneText="Import"
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    resetForm();
                    router.back();
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                    {/* <Select
                        name="state_id"
                        label="State"
                        placeholder="Select State"
                        removable
                        options={stateOptions}
                        value={values.state_id}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("state_id", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    /> */}
                    <Select
                        name="timezone_uuid"
                        label="Time Zone"
                        placeholder="Select Time Zone"
                        options={timezoneOptions}
                        icon="Clock"
                        value={values.timezone_uuid}
                        touched={touched}
                        errors={errors}
                        removable
                        onChange={(e: any) => {
                            setFieldValue("timezone_uuid", e.target.value);
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
