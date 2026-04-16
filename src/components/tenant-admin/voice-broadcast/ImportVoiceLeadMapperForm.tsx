"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import { Icon, Loader, Stepper } from "@/components/ui-components";
import { Danger, Success } from "@/redux/services/toasterServices";
import { leadGroupOptionsGet } from "@/redux/slice/tenant-admin/leadGroupSlice";
import { leadMapperImport } from "@/redux/slice/tenant-admin/leadManagementSlice";
import { FilePicker } from "@/components/pickers";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Select } from "@/components/forms";
import { downloadFile } from "@/helperFunctions";

// THIRD - PARTY IMPORT
import * as Yup from "yup";
import { useFormik } from "formik";

// TYPS IMPORT
import { OptionTypes } from "@/types/formTypes";
import { filterByOptions } from "@/config/options";
import { voiceBroadcastLeadReset } from "@/redux/slice/tenant-admin/voiceBroadcastSlice";

// ASSETS
const SampleCsv = "/assets/sample-files/lead_import_sample.csv";

interface InitialValueType {
    file: any;
    filter_by: string;
    phone_code: string;
    lead_group_uuid: string;
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    province: string;
    postcal_code: string;
    dob: string;
    phone_number: string;
    alternate_phone_number: string;
    email: string;
    gender: string;
    description: string;
}

const stepperData = [
    { title: "Upload File", name: "Upload a file" },
    { title: "Match Fields", name: "Match Fields" },
    { title: "Process", name: "Process" },
    { title: "Complete", name: "Complete" },
];

const ImportVoiceLeadMapperForm = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { id, cid } = useParams();

    const [selected, setSelected] = useState<number>(0);
    const [options, setOptions] = useState<OptionTypes[]>([]);
    const [importMsg, setImportMsg] = useState<string>("");
    const initialValues: InitialValueType = {
        file: "",
        phone_code: "",
        filter_by: "0",
        lead_group_uuid: id,
        first_name: "",
        last_name: "",
        address: "",
        city: "",
        state: "",
        province: "",
        postcal_code: "",
        dob: "",
        phone_number: "",
        alternate_phone_number: "",
        email: "",
        gender: "",
        description: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        file: Yup.string().required("Please enter a file"),
        lead_group_uuid: Yup.string().required("Please enter a lead group"),
        first_name: Yup.string().required("Please enter a first name"),
        phone_number: Yup.string().required("Please enter a phone number"),
    });

    // Create or Update DID Nnumber
    const onSubmit = (values: any) => {
        const { file, lead_group_uuid, filter_by, phone_code, ...rest } = values;
        const payload = new FormData();
        payload.append("file", file);
        payload.append("filter_by", filter_by);
        payload.append("lead_group_uuid", lead_group_uuid);
        payload.append("phone_code", phone_code);
        payload.append("mapper_keys", JSON.stringify(rest));

        onImport(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
        setFieldValue,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetLeadGroupOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetLeadGroupOptions = async () => {
        try {
            await dispatch(leadGroupOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Lead Group Options =-=>", err);
        }
    };

    const hadleChange = (e: any) => {
        setFieldValue(e.target.name, e.target.value);
    };

    const onImport = async (payload: any) => {
        setSelected(2);
        try {
            const res: any = await dispatch(leadMapperImport(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                setImportMsg(res.data);
                onResetLead();
                setSelected(3);
            } else {
                Danger(res?.data);
                setImportMsg("");
                setSelected(1);
            }
        } catch (err) {
            setSelected(1);
            setImportMsg("");
            console.error("Import Err =-=>", err);
        }
    };

    const onResetLead = async () => {
        try {
            const payload = {
                voice_broadcast_uuid: cid,
                lead_group_uuid: id,
            };
            await dispatch(voiceBroadcastLeadReset(payload)).unwrap();
        } catch (err) {
            console.error("Rseet Lead Group Err =-=>", err);
        }
    };

    const onBack = () => {
        switch (selected) {
            case 0:
                router.back();
                break;

            default:
                setSelected((selected) => --selected);
                break;
        }
    };

    return (
        <>
            <form
                className="relative z-[1]"
                autoComplete="off"
                onSubmit={(e: any) => {
                    e.preventDefault();
                }}
            >
                <div
                    className={`relative z-[1] flex flex-col bg-white rounded-md h-[calc(100vh-123px)] tsm:h-[calc(100vh-183px)]`}
                >
                    <div className="flex items-center bg-secondary rounded-t-md justify-start px-8 py-3 tsm:px-4">
                        <Icon
                            className="mr-5"
                            name="ArrowLeftWhite"
                            width={20}
                            height={20}
                            onClick={onBack}
                        />
                        <span className="text-sm text-white font-bold">
                            Lead Import Mapper
                        </span>
                    </div>
                    <div
                        className={`px-11 tsm:px-4 h-full overflow-y-scroll relative z-[1] scrollbar-hide pt-10`}
                    >
                        <Stepper data={stepperData} selected={selected} />

                        {selected === 0 ? (
                            <>
                                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                                    <Select
                                        name="filter_by"
                                        label="Lead Duplicate Check"
                                        placeholder="Select Lead Duplicate Check"
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
                                        onChange={(file: any, data: any) => {
                                            setFieldValue("file", file);
                                            const options = data?.map(
                                                (value: string, index: number) => ({
                                                    value: index?.toString(),
                                                    label: value,
                                                })
                                            );
                                            setOptions(options);
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
                            </>
                        ) : selected === 1 ? (
                            <>
                                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                                    <Select
                                        name="first_name"
                                        label="First Name"
                                        placeholder="Select First Name"
                                        removable
                                        options={options}
                                        value={values.first_name}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="last_name"
                                        label="Last Name"
                                        placeholder="Select Last Name"
                                        removable
                                        options={options}
                                        value={values.last_name}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="phone_number"
                                        label="Phone Number"
                                        placeholder="Select Phone Number"
                                        removable
                                        options={options}
                                        value={values.phone_number}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="address"
                                        label="Address"
                                        placeholder="Select Address"
                                        removable
                                        options={options}
                                        value={values.address}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="city"
                                        label="City"
                                        placeholder="Select City"
                                        removable
                                        options={options}
                                        value={values.city}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="state"
                                        label="State"
                                        placeholder="Select State"
                                        removable
                                        options={options}
                                        value={values.state}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="province"
                                        label="Province"
                                        placeholder="Select Province"
                                        removable
                                        options={options}
                                        value={values.province}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="postcal_code"
                                        label="Postal Code"
                                        placeholder="Select Postal Code"
                                        removable
                                        options={options}
                                        value={values.postcal_code}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="dob"
                                        label="DOB"
                                        placeholder="Select DOB"
                                        removable
                                        options={options}
                                        value={values.dob}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="alternate_phone_number"
                                        label="Alternate Phone Number"
                                        placeholder="Select Alternate Phone Number"
                                        removable
                                        options={options}
                                        value={values.alternate_phone_number}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="email"
                                        label="Email"
                                        placeholder="Select Email"
                                        removable
                                        options={options}
                                        value={values.email}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="gender"
                                        label="Gender"
                                        placeholder="Select Gender"
                                        removable
                                        options={options}
                                        value={values.gender}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                    <Select
                                        name="description"
                                        label="Description"
                                        placeholder="Select Description"
                                        removable
                                        options={options}
                                        value={values.description}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                </div>
                            </>
                        ) : selected === 2 ? (
                            <>
                                <Loader />
                            </>
                        ) : selected === 3 ? (
                            <div className="w-full h-[calc(100vh-320px)] flex items-center justify-center">
                                <div className="flex flex-col justify-center items-center">
                                    <span className="text-lg text-primary font-bold">
                                        Lead Uploaded Successfully
                                    </span>
                                    <span className="text-sm text-primary font-normal">
                                        {importMsg ? importMsg : ""}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex justify-end items-center py-5 border-t shadow-box">
                        <div className="flex gap-4 px-10 tsm:px-4">
                            {selected !== 3 && (
                                <Button
                                    className="px-3 py-2"
                                    type="button"
                                    style="dark-outline"
                                    text="Back"
                                    onClick={onBack}
                                />
                            )}
                            <Button
                                className="px-3 py-2"
                                type={selected === 1 ? "submit" : "button"}
                                style="primary"
                                text={selected === 3 ? "Finish" : "Next"}
                                onClick={() => {
                                    switch (selected) {
                                        case 0:
                                            if (!values.lead_group_uuid || !values.file) {
                                                Danger("Please Select all data");
                                                return;
                                            }
                                            setSelected(1);
                                            break;
                                        case 1:
                                            handleSubmit();
                                            break;
                                        case 3:
                                            router.back();
                                            break;
                                        default:
                                            setSelected((selected) => ++selected);
                                            break;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ImportVoiceLeadMapperForm;
