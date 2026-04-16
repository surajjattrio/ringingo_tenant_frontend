"use client";
import { useEffect, useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { Icon, Loader, Stepper } from "@/components/ui-components";
import { Danger, Success } from "@/redux/services/toasterServices";
import { leadGroupOptionsGet } from "@/redux/slice/tenant-admin/leadGroupSlice";
import { useLeadGroupOptions } from "@/redux/slice/tenant-admin/leadGroupSlice";
import { leadMapperImport, getSingleLeadCustomFields } from "@/redux/slice/tenant-admin/leadManagementSlice";
import { FilePicker } from "@/components/pickers";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Select } from "@/components/forms";
import { downloadFile } from "@/helperFunctions";

// THIRD - PARTY IMPORT
import * as Yup from "yup";
import { useFormik } from "formik";

// ASSETS
const SampleCsv = "/assets/sample-files/lead_import_sample.csv";

// TYPS IMPORT
import { OptionTypes } from "@/types/formTypes";
import { filterByOptions } from "@/config/options";
// TYPES IMPORT
import { DynamicFormFields } from "@/types/tenant-admin/leadManagementTypes";

interface InitialValueType {
    file: any;
    filter_by: string;
    lead_group_uuid: string;
    phone_code: string;
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
    custom_fields?: DynamicFormFields;
}

const stepperData = [
    { title: "Upload File", name: "Upload a file" },
    { title: "Match Fields", name: "Match Fields" },
    { title: "Process", name: "Process" },
    { title: "Complete", name: "Complete" },
];

const ImportLeadManagement = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const leadGroupOptions = useLeadGroupOptions();

    const [selected, setSelected] = useState<number>(0);
    const [options, setOptions] = useState<OptionTypes[]>([]);
    const [customFieldData, setCustomFieldData] = useState<any>({});
    const [importMsg, setImportMsg] = useState<string>("");
    const initialValues: InitialValueType = {
        file: "",
        lead_group_uuid: "",
        phone_code: "",
        filter_by: "0",
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
        custom_fields: {},
    };

    const validationSchema = Yup.object<InitialValueType>({
        file: Yup.string().required("Please enter a file"),
        lead_group_uuid: Yup.string().required("Please enter a lead group"),
        first_name: Yup.string().required("Please enter a first name"),
        phone_number: Yup.string().required("Please enter a phone number"),
    });

    // Create or Update DID Nnumber
    const onSubmit = (values: any) => {
        const { file, lead_group_uuid, filter_by, phone_code, custom_fields, ...rest } = values;
        // console.log("import mappperrrr", values);
        
        const payload = new FormData();
        payload.append("file", file);
        payload.append("filter_by", filter_by);
        payload.append("lead_group_uuid", lead_group_uuid);
        payload.append("phone_code", phone_code);
        payload.append("custom_fields", JSON.stringify(custom_fields));
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
    const validateFieldMapping = (fieldName: string, selectedLabel: string, expectedLabel: string) => {
        const label = selectedLabel.toLowerCase().trim();
        const expected = expectedLabel.toLowerCase().trim();
        
        // Specific keyword rules for standard fields
        const keywordRules: Record<string, string[]> = {
            first_name: ["first", "fname"],
            last_name: ["last", "surname", "lname"],
            phone_number: ["phone", "mobile", "contact", "tel", "number"],
            address: ["address", "street", "location"],
            city: ["city", "town"],
            state: ["state", "region"],
            province: ["province", "area"],
            postcal_code: ["postal", "zip", "code"],
            dob: ["dob", "birth", "date"],
            alternate_phone_number: ["alternate", "alt", "phone", "mobile", "contact"],
            email: ["email", "mail"],
            gender: ["gender"],
            description: ["description", "remark", "note", "about"]
        };

        const keywords = keywordRules[fieldName];
        if (keywords) {
            // Priority 1: Prevent clear opposites for name and phone fields
            if (fieldName === 'first_name' && label.includes('last')) return false;
            if (fieldName === 'last_name' && label.includes('first')) return false;
            
            if (fieldName === 'phone_number' && (label.includes('alternate') || label.includes('alt'))) return false;
            if (fieldName === 'alternate_phone_number' && !label.includes('alternate') && !label.includes('alt')) return false;

            // Priority 2: Direct match with expected label
            if (label !== "" && (label.includes(expected) || expected.includes(label))) return true;

            // Priority 3: Keyword heuristic
            return keywords.some(key => label.includes(key));
        }

        // For custom fields, use a generic fuzzy match
        if (label !== "" && (label.includes(expected) || expected.includes(label))) return true;

        return false;
    };

    const hadleChange = (e: any) => {
        const { name, value } = e.target;
        const selectedOption = options.find((opt) => opt.value === value);
        const selectedLabel = selectedOption?.label || "";

        // Standard field labels mapping
        const fieldLabels: Record<string, string> = {
            first_name: "First Name",
            last_name: "Last Name",
            phone_number: "Phone Number",
            address: "Address",
            city: "City",
            state: "State",
            province: "Province",
            postcal_code: "Postal Code",
            dob: "DOB",
            alternate_phone_number: "Alternate Phone Number",
            email: "Email",
            gender: "Gender",
            description: "Description",
        };

        if (value && value !== "") {
            const isValid = validateFieldMapping(name, selectedLabel, fieldLabels[name] || name);
            if (!isValid) {
                Danger(`The selected column "${selectedLabel}" does not seem to match "${fieldLabels[name] || name}". Please select the correct column.`);
                return;
            }
        }

        setFieldValue(name, value);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const selectedOption = options.find((opt) => opt.value === value);
        const selectedLabel = selectedOption?.label || "";
        
        // Find the custom field label from customFieldData
        const customField = customFieldData.find((item: any) => item.field_name === name);
        const expectedLabel = customField?.field_label || name;

        if (value && value !== "") {
            const isValid = validateFieldMapping(name, selectedLabel, expectedLabel);
            if (!isValid) {
                Danger(`The selected column "${selectedLabel}" does not seem to match "${expectedLabel}". Please select the correct column.`);
                return;
            }
        }

        setFieldValue(`custom_fields.${name}`, value);
    };

    const getFilteredOptions = (currentFieldName: string, isCustom: boolean = false) => {
        const standardFields = [
            "first_name", "last_name", "phone_number", "address", "city", 
            "state", "province", "postcal_code", "dob", 
            "alternate_phone_number", "email", "gender", "description"
        ];
        
        const selectedValues = new Set();
        
        standardFields.forEach(field => {
            const key = field as keyof InitialValueType;
            if (field !== currentFieldName || isCustom) {
                if (values[key]) selectedValues.add(values[key]);
            }
        });

        if (values?.custom_fields) {
            Object.keys(values.custom_fields).forEach(field => {
                if (field !== currentFieldName || !isCustom) {
                    if (values?.custom_fields?.[field]) selectedValues.add(values?.custom_fields[field]);
                }
            });
        }

        const currentValue = isCustom ? values.custom_fields?.[currentFieldName] : values[currentFieldName as keyof InitialValueType];;
        return options.filter(opt => !selectedValues.has(opt.value) || opt.value === currentValue);
    };

    const onImport = async (payload: any) => {
        setSelected(2);
        try {
            const res: any = await dispatch(leadMapperImport(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                setImportMsg(res.data);
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

    useLayoutEffect(() => {
        getSingleLeadCustomFieldsDetail();
    }, [values]);

    const getSingleLeadCustomFieldsDetail = async () => {
        if(values?.lead_group_uuid){
            try {
                const res: any = await dispatch(getSingleLeadCustomFields(values?.lead_group_uuid)).unwrap();
                if (res?.statusCode === 200) {
                    setCustomFieldData(res?.data);
                }
            } catch (err) {
                console.error("Get Custom Field Data Err =-=>", err);
            }
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
                                                downloadFile(SampleCsv, "import_mapper_lead_sample.csv");
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
                                        options={getFilteredOptions("first_name")}
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
                                        options={getFilteredOptions("last_name")}
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
                                        options={getFilteredOptions("phone_number")}
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
                                        options={getFilteredOptions("address")}
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
                                        options={getFilteredOptions("city")}
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
                                        options={getFilteredOptions("state")}
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
                                        options={getFilteredOptions("province")}
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
                                        options={getFilteredOptions("postcal_code")}
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
                                        options={getFilteredOptions("dob")}
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
                                        options={getFilteredOptions("alternate_phone_number")}
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
                                        options={getFilteredOptions("email")}
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
                                        options={getFilteredOptions("gender")}
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
                                        options={getFilteredOptions("description")}
                                        value={values.description}
                                        touched={touched}
                                        errors={errors}
                                        onChange={hadleChange}
                                        onBlur={handleBlur}
                                        isInfo
                                    />
                                </div>
                                
                                {customFieldData && customFieldData.length > 0 ? 
                                    <div className="shadow-box mb-10">
                                        <div className="py-4 px-6 rounded-t-md flex justify-between items-center text-primary bg-primary-v10">
                                            <span className="text-sm font-bold">Custom Fields</span>
                                        </div>

                                        {/* Meta Fields Start */}
                                        <div className={`py-6 px-4 bd-white gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 `} >
                                            {customFieldData?.map((item : any, index: number) => {
                                                // if(item?.field_type === "5"){
                                                //     setCheckedOptions(values?.custom_fields?.[item?.field_name]);
                                                // }
                                                return <Select
                                                            key={item.id || index}
                                                            name={item?.field_name}
                                                            label={item?.field_label}
                                                            placeholder={item?.field_description}
                                                            removable
                                                            options={getFilteredOptions(item?.field_name, true)}
                                                            value={values?.custom_fields?.[item?.field_name]}
                                                            touched={touched}
                                                            errors={errors}
                                                            onChange={handleCustomChange}
                                                            onBlur={handleBlur}
                                                            isInfo
                                                        />
                                            })}
                                        </div>
                                        {/* Meta Fields End */}

                                    </div>
                                : ""}
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

export default ImportLeadManagement;