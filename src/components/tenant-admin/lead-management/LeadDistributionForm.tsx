"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import LeadDistributionModal from "./LeadDistributionModal";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { Input, Select } from "@/components/forms";
import { CardForm, Icon } from "@/components/ui-components";
import {
    leadGroupOptionsGet,
    useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import { FilePicker } from "@/components/pickers";
import { leadDistribution } from "@/redux/slice/tenant-admin/leadManagementSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { downloadFile } from "@/helperFunctions";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/leadDistribution";
import { filterByOptions } from "@/config/options";

// ASSETS
const SampleCsv = "/assets/sample-files/lead_import_sample.csv";

const LeadDistributionForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>();

    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();
    const leadGroupOptions = useLeadGroupOptions();

    const initialValues: InitialValueType = {
        user_uuid: [],
        file: "",
        lead_group_uuid: "",
        filter_by: "0",
        phone_code: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        user_uuid: Yup.array()
            .min(1, "Please select user")
            .required("Please select user"),
        file: Yup.mixed().required("Please select file"),
        lead_group_uuid: Yup.string().required("Please select lead group"),
    });

    // Import Lead distribution
    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("file", values.file);
        payload.append("user_uuid", values.user_uuid);
        payload.append("lead_group_uuid", values.lead_group_uuid);
        payload.append("filter_by", values.filter_by);
        payload.append("phone_code", values.phone_code);
        onLeadDistribute(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
        setFieldValue,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetUserOptions();
        onGetLeadGroupOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching Lead Group Options
    const onGetLeadGroupOptions = async () => {
        try {
            await dispatch(leadGroupOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Lead Group Options Err =-=>", err);
        }
    };

    const onLeadDistribute = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(leadDistribution(values)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                setData(res?.message);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (err) {
            Danger("");
            setLoading(false);
            console.error("Lead Distribution Err =-=>", err);
        }
    };

    return (
        <>
            <CardForm
                doneText="Import"
                title="Lead Distribution"
                loading={loading}
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
                    <Select
                        name="user_uuid"
                        isMulti
                        label="User"
                        placeholder="Select User"
                        options={userOptions}
                        value={values.user_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("user_uuid", e);
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
                                downloadFile(SampleCsv, "lead_sample.csv");
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
            <LeadDistributionModal
                data={data}
                onHide={() => {
                    setData(null);
                    router.back();
                }}
            />
        </>
    );
};

export default LeadDistributionForm;
