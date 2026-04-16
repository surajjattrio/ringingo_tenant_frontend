"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    fieldTypeOptions,
    rankNumberOptions,
} from "@/config/options";

// PROJECT IMPORT
import {
    customFieldsCreate,
    customFieldsUpdate,
    updateSingleCustomFieldsData,
    useSingleCustomFields
} from "@/redux/slice/tenant-admin/customFieldsSlice";
import {
    leadGroupOptionsGet,
    useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Textarea, Select, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/customFieldsTypes";
import { ManagerNameTypes } from "@/types/formTypes";
import MultiSelect from "@/components/forms/MultiSelect";

const CreateEditCustomFieldsForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const customFieldsData = useSingleCustomFields();
    const leadGroupOptions = useLeadGroupOptions();
    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";


    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        lead_group_uuid: "",
        field_label: "",
        field_name: "",
        field_type: "",
        field_rank: "",
        field_placeholder: "",
        field_options: "",
        required: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        lead_group_uuid: Yup.string().required("Please Enter Lead Group"),
        field_label: Yup.string().required("Please Enter Label"),
        // field_placeholder: Yup.string().required("Please enter Field Placeholder"),
        field_name: Yup.string().required("Please Enter Field Name"),
        //        .matches(/^[a-z_\-]+$/, "Only letters, hyphens, and underscores are allowed")
        //        .test('no-uppercase', 'Capital letters are not allowed', (value) => {
        //              return !/[A-Z]/.test(value || '');
        // }),
        field_rank: Yup.string().required("Please Enter Field Rank"),
        field_type: Yup.string().required("Please Enter Field Type"),
        field_options: Yup.string().when("field_type", {
            is: (value: any) => value === "2" || value === "3" || value === "4" || value === "5",
            then: (e) => e.required("Please Select Field Options").matches(
                /^(?:\w+,\s)*\w+$/,
                "String must have words separated by commas and spaces"
            ),
            otherwise: (e) => e

        })
    });


    //  // Create Disposition
    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("lead_group_uuid", values?.lead_group);
        payload.append("field_label", values?.field_label);
        payload.append("field_name", values?.field_name);
        payload.append("field_type", values?.field_type);
        payload.append("field_rank", values?.field_rank);
        payload.append("field_placeholder", values?.field_placeholder);
        payload.append("field_options", values?.field_options);
        payload.append("required", values?.required);
        payload.append("tenant_uuid", user?.tenant_detail?.uuid);
        if (id) {
            onUpdateCustomFields(values);
        } else {
            onCreateCustomFields(values);
        }
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setValues,
        setFieldValue,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetLeadGroupOptions();        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (!id) return;
        // onGetSingleDispositionData();
        setValues({
            ...values,
            lead_group_uuid: customFieldsData?.lead_group_uuid,
            field_label: customFieldsData?.field_label,
            field_name: customFieldsData?.field_name,
            field_type: customFieldsData?.field_type,
            field_rank: customFieldsData?.field_rank,
            field_placeholder: customFieldsData?.field_placeholder,
            field_options: customFieldsData?.field_options,
            required: customFieldsData?.required,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFieldsData, id]);


    // Fetching lead-group-Options Options
    const onGetLeadGroupOptions = async () => {
        try {
            await dispatch(leadGroupOptionsGet());
        } catch (err) {
            console.error("Get DID Options Err =-=>", err);
        }
    };

    // Create Custom Fields & Navigate to Custom Fields Page
    const onCreateCustomFields = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(customFieldsCreate(payload)).unwrap();
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
            console.error("Create Custom Fields Err --->", e?.message);
        }
    };

    // Update Custom Fields & Navigate to Custom Fields Page
    const onUpdateCustomFields = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(customFieldsUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleCustomFieldsData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Custom Fields Err --->", e?.message);
        }
    };

    const validateInput = (e: any) => {

        const regex = /^(?:\w+,\s)*\w+$/;
        const ID = e.target.id;
        const value = e.target.value;
        const textArea = document.getElementById(ID);

        //console.log(e.target.id);

        if (textArea && regex.test(value)) { // Optional chaining (?.)
            textArea.style.borderColor = "#66a286";
            textArea.classList.remove('error');
            textArea.classList.add('valid');
        } else if (textArea) {
            textArea.style.borderColor = "#ff0000";
            textArea.classList.remove('valid');
            textArea.classList.add('error');
        }
    }
  const convertUUIDsToOptions = (uuidString: string) => {
    if (!uuidString) return [];
    const uuids = uuidString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return leadGroupOptions.filter((option: any) =>
      uuids.includes(option.value)
    );
  };

  const convertOptionsToUUIDs = (options: any[]) => {
    if (!Array.isArray(options) || options.length === 0) return "";
    return options.map((opt: any) => opt.value).join(",");
  };
    return (
        <CardForm
            id={id}
            name="customFields"
            managerName={managerName}
            // length={disposition?.count}
            loading={loading}
            title={id ? "Edit Custom Fields" : "Create Custom Fields"}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleCustomFieldsData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">

                <MultiSelect
                    name="lead_group_uuid"
                    label={
                        <>
                            Lead Group <span className="text-red-500">*</span>
                        </>
                    }
                    icon="GroupLead"
                    placeholder="Select Lead Group"
                    //   isAdd
                    //   createName="Create Lead Group"
                    //   createPath={
                    //     isPathname
                    //       ? "/manager-outbound-campaign/lead-group/create"
                    //       : "/tenant-outbound-campaign/lead-group/create"
                    //   }
                    options={leadGroupOptions}
                    value={convertUUIDsToOptions(values.lead_group_uuid)}

                    touched={touched}
                    errors={errors}
                    onChange={(selected: any) => {
                        // Convert options back to comma-separated string
                        const uuidString = convertOptionsToUUIDs(selected || []);
                        setFieldValue("lead_group_uuid", uuidString);
                     }}
                    onBlur={handleBlur}
                    isSelectAll={true} 
                    isMulti={true}
                    isInfo
                />


                <Input
                    name="field_name"
                    label={
                        <>
                            Reference Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserGray"
                    placeholder="Enter Reference Name"
                    value={values.field_name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!!id} // Disable if id exists (indicating it's in edit mode)
                    isInfo
                />

                <Input
                    name="field_label"
                    label={
                        <>
                            Field Label <span className="text-red-500">*</span>
                        </>
                    }
                    icon="FieldLabel"
                    placeholder="Enter Field Label"
                    value={values.field_label}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />


                <Input
                    name="field_placeholder"
                    label="Placeholder Text"
                    icon="PlaceHolder"
                    placeholder="Enter Placeholder Text"
                    value={values.field_placeholder}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />



                <Select
                    name="field_type"
                    label={
                        <>
                            Field Type <span className="text-red-500">*</span>
                        </>
                    }
                    icon="FieldType"
                    placeholder="Select Field Type"
                    removable
                    options={fieldTypeOptions}
                    value={values.field_type}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("field_type", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isDisabled={!!id} // Disable if id exists (indicating it's in edit mode)
                    isInfo
                />

                <Select
                    name="field_rank"
                    label={
                        <>
                            Field Rank <span className="text-red-500">*</span>
                        </>
                    }
                    icon="FieldRank"
                    placeholder="Select Field Rank"
                    removable
                    options={rankNumberOptions}
                    value={values.field_rank}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("field_rank", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Required"
                    value={values.required}
                    onClick={(value: string) => setFieldValue("required", value)}
                />

                {values.field_type === '2' || values.field_type === '3' || values.field_type === '4' || values.field_type === '5' ? (

                    <Textarea
                        // className="!px-2"
                        label="Field Options"
                        name="field_options"
                        placeholder="e.g: opt1, opt2, opt3"
                        rows={3}
                        value={values.field_options}
                        onChange={handleChange}
                        touched={touched}
                        errors={errors}
                        onBlur={handleBlur}
                        onInput={(e: any) => {
                            validateInput(e);
                        }}
                    />

                ) : null}

            </div>
        </CardForm>
    );
};

export default CreateEditCustomFieldsForm;

