"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MultiSelect, { Option } from "../../forms/MultiSelect";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";

// PROJECT IMPORT
import {
  getSingleLead,
  getSingleLeadCustomFields,
  leadNewCreate,
  leadNewUpdate,
} from "@/redux/slice/tenant-admin/leadManagementSlice";
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";

import {
  leadGroupOptionsGet,
  useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import {
  dispositionOptionsGet,
  useDispositionOptions,
} from "@/redux/slice/master-admin/dispositionSlice";
import {
  outboundOptionsGet,
  useOutboundOptions,
} from "@/redux/slice/tenant-admin/outboundSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { DatePicker } from "@/components/pickers";
import { Input, Select, Textarea } from "@/components/forms";
import { Loader } from "@/components/ui-components";
import {
  countryOptionsGet,
  useCountryOptions,
} from "@/redux/slice/master-admin/countrySlice";
import Radio from "@/components/forms/Radio";
import Checkbox from "@/components/forms/CheckboxV2";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/leadManagementTypes";

// OPTIONS IMPORT
import { genderOptions } from "@/config/options";
import DispositionTree from "../outbound-campaign/DispositionTree";

export interface KanbanLeadModalProps {
  modalTitle?: string;
  defaultStageTitle?: string;
  defaultStageId?: string;
  onClose?: () => void;
  onSuccess?: (createdPayload: any, apiResponse?: any) => void;
  leadId?: string;
  initialData?: any;
}

const KanbanLeadModal = (props: KanbanLeadModalProps) => {
  const {
    modalTitle = "",
    defaultStageTitle = "",
    defaultStageId = "",
    onClose,
    onSuccess,
    leadId = "",
    initialData,
  } = props;
  const params = useParams();
  const id = leadId || (params?.id ? String(params.id) : "");
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const userOptions = useUserOptions();
  const leadGroupOptions = useLeadGroupOptions();
  const campaignOptions = useOutboundOptions();
  const countryOptions = useCountryOptions();
  const dispositionOptions = useDispositionOptions();

  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customFieldData, setCustomFieldData] = useState<any>({});
  const [showDispoModal, setShowDispoModal] = useState<boolean>(false);
  const [dispoName, setDispoName] = useState<string>();
  const modalRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowDispoModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionChange = (selected: Option[], name: string) => {
    setFieldValue(`custom_fields.${name}`, selected);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    const currentValues = values.custom_fields[name] || [];

    let updatedCheckboxOptions;

    if (currentValues && currentValues.length > 0) {
      if (currentValues?.includes(value)) {
        updatedCheckboxOptions = currentValues.filter(
          (option: string) => option !== value
        );
      } else {
        updatedCheckboxOptions = [...currentValues, value];
      }
    } else {
      updatedCheckboxOptions = [...currentValues, value];
    }

    setFieldValue(`custom_fields.${name}`, updatedCheckboxOptions);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValue(`custom_fields.${name}`, value);
  };

  useEffect(() => {
    if (!values.lead_status && dispositionOptions?.length) {
      let def: any = null;
      if (defaultStageTitle) {
        const findMatch = (items: any[]): any => {
          for (const item of items) {
            const lbl = String(item.label || item.name || "").trim().toLowerCase();
            const code = String(item.code || "").trim().toLowerCase();
            const target = String(defaultStageTitle).trim().toLowerCase();
            if (lbl === target || code === target) return item;
            if (item.children?.length) {
              const childMatch = findMatch(item.children);
              if (childMatch) return childMatch;
            }
          }
          return null;
        };
        def = findMatch(dispositionOptions);
      }
      if (!def) {
        def = dispositionOptions.find(
          (x: any) => x.label === "NEW" || x.code === "NEW"
        );
      }
      if (def) {
        setFieldValue("lead_status", def.value || def.disposition_uuid);
        setDispoName(def.label || def.name);
      }
    }
  }, [dispositionOptions, defaultStageTitle]);

  const initialValues: any = {
    first_name: initialData?.first_name || (initialData?.name ? String(initialData.name).split(" ")[0] : ""),
    last_name: initialData?.last_name || (initialData?.name ? String(initialData.name).split(" ").slice(1).join(" ") : ""),
    phone_code: initialData?.phone_code || "",
    phone_number: initialData?.phone_number || initialData?.phone || "",
    lead_group_uuid: initialData?.lead_group_uuid || "",
    lead_status: initialData?.lead_status || "",
    country_uuid: initialData?.country_uuid || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    province: initialData?.province || "",
    postal_code: initialData?.postal_code || "",
    dob: initialData?.dob
      ? (() => {
          const d = new Date(initialData.dob);
          return !isNaN(d.getTime()) ? d : "";
        })()
      : "",
    alternate_phone_number: initialData?.alternate_phone_number || "",
    email: initialData?.email || "",
    user_uuid: initialData?.user_uuid || "",
    gender: initialData?.gender || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "Medium",
    campaign_uuid: initialData?.campaign_uuid || "",
    custom_fields: initialData?.custom_fields || {},
  };

  const validationSchema = Yup.object<InitialValueType>({
    lead_group_uuid: Yup.string().required("Please Enter Lead Group"),
    first_name: Yup.string().required("Please Enter First Name"),
    phone_number: Yup.string()
      .min(4, "Please Enter Valid Phone Number")
      .required("Please Enter Phone Number"),
    alternate_phone_number: Yup.string().min(
      4,
      "Please Enter Valid Phone Number"
    ),
  });

  const onSubmit = (values: any) => {
    const payload = { ...values };
    payload["custom_fields"] = values?.custom_fields || {};
    payload["tenant_uuid"] = user?.tenant_detail?.uuid;
    const selectedCamp = (campaignOptions || []).find((c: any) => c.value === values.campaign_uuid);
    if (selectedCamp) {
      payload["campaign_name"] = selectedCamp.label;
    }
    if (id) {
      onUpdateLead(payload);
    } else {
      onCreateLead(payload);
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
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
  });

  const getSingleLeadDetail = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(getSingleLead(id)).unwrap();
      if (res && res.statusCode === 200) {
        const leadData = res?.data;
        setValues({
          ...values,
          first_name: leadData?.first_name || "",
          last_name: leadData?.last_name || "",
          phone_code: leadData?.phone_code || "",
          phone_number: leadData?.phone_number || "",
          lead_group_uuid: leadData?.lead_group_uuid || "",
          lead_status: leadData?.lead_status || "",
          country_uuid: leadData?.country_uuid || "",
          address: leadData?.address || "",
          city: leadData?.city || "",
          state: leadData?.state || "",
          province: leadData?.province || "",
          postal_code: leadData?.postal_code || "",
          dob: leadData?.dob
            ? (() => {
                const d = new Date(leadData.dob);
                return !isNaN(d.getTime()) ? d : "";
              })()
            : "",
          alternate_phone_number: leadData?.alternate_phone_number || "",
          email: leadData?.email || "",
          user_uuid: leadData?.user_uuid || "",
          gender: leadData?.gender
            ? leadData?.gender?.toLowerCase() === "male"
              ? "0"
              : leadData?.gender?.toLowerCase() === "female"
                ? "1"
                : leadData?.gender === "1"
                  ? "1"
                  : leadData?.gender === "0"
                    ? "0"
                    : ""
            : "",
          description: leadData?.description || "",
          priority: leadData?.priority || initialData?.priority || "Medium",
          campaign_uuid: leadData?.campaign_uuid || initialData?.campaign_uuid || "",
          custom_fields: leadData?.custom_fields || {},
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log("get Single lead details err --->", error?.message);
    }
  };

  useLayoutEffect(() => {
    if (!id) return;
    getSingleLeadDetail();
  }, [id]);

  useEffect(() => {
    if (!values?.lead_group_uuid) return;
    getSingleLeadCustomFieldsDetail();
  }, [values.lead_group_uuid]);

  useEffect(() => {
    onGetUserOptions();
    onGetLeadGroupOptions();
    onGetLeadStatusOptions();
    onGetCountryOptions();
    onGetCampaignOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSingleLeadCustomFieldsDetail = async () => {
    setLoading(true);
    if (values?.lead_group_uuid) {
      try {
        const res: any = await dispatch(
          getSingleLeadCustomFields(values?.lead_group_uuid)
        ).unwrap();
        if (res?.statusCode === 200) {
          setCustomFieldData(res?.data);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Get Custom Field Data Err =-=>", err);
      }
    }
  };

  const onGetUserOptions = async () => {
    try {
      await dispatch(userOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get User Options Err =-=>", err);
    }
  };

  const onGetLeadGroupOptions = async () => {
    try {
      await dispatch(leadGroupOptionsGet(undefined)).unwrap();
    } catch (err) {
      console.error("Get Lead Group Options Err =-=>", err);
    }
  };

  const onGetLeadStatusOptions = async () => {
    try {
      await dispatch(dispositionOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Lead Status Options Err =-=>", err);
    }
  };

  const onGetCountryOptions = () => {
    try {
      dispatch(countryOptionsGet()).unwrap();
    } catch (e: any) {
      console.error("Get Country Options Err --->", e?.message);
    }
  };

  const onGetCampaignOptions = async () => {
    try {
      await dispatch(outboundOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Campaign Options Err =-=>", err);
    }
  };

  const onCreateLead = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res: any = await dispatch(leadNewCreate(payload)).unwrap();
      if (res?.statusCode === 201 || res?.statusCode === 200) {
        Success(res?.data || res?.message || "Lead created successfully");
        resetForm();
        onSuccess?.(payload, res);
      } else {
        Danger(res?.data || res?.message || "Failed to create lead");
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      Danger(e?.message || "Error creating lead");
      console.error("Create Lead Management Err --->", e?.message);
    }
  };

  const onUpdateLead = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        id,
      };
      const res: any = await dispatch(leadNewUpdate(payload)).unwrap();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        Success(res?.data || res?.message || "Lead updated successfully");
        resetForm();
        onSuccess?.(payload, res);
      } else {
        Danger(res?.data || res?.message || "Failed to update lead");
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      Danger(e?.message || "Error updating lead");
      console.error("Update Lead Management Err --->", e?.message);
    }
  };

  useEffect(() => {
    if (!values.lead_status || !dispositionOptions?.length) return;

    const findLabel = (items: any[]): any => {
      for (const item of items) {
        if (
          item.value === values.lead_status ||
          item.disposition_uuid === values.lead_status
        ) {
          return item;
        }
        if (item.children?.length) {
          const found = findLabel(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    const selected = findLabel(dispositionOptions);
    if (selected) {
      setDispoName(selected.label || selected.name);
    }
  }, [values.lead_status, dispositionOptions]);

  const createOptionsFromString = (optionsString: any) => {
    return optionsString.split(", ").map((item: any) => ({
      value: item,
      label: item.charAt(0).toUpperCase() + item.slice(1),
    }));
  };

  const formBody = (
    <>
      <div className="pt-2 pb-6 gap-y-[24px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-1">
        <Select
          name="lead_group_uuid"
          label="Lead Group"
          icon="UserGroup"
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

        <Input
          name="first_name"
          label={
            <>
              First Name <span className="text-red-500">*</span>
            </>
          }
          icon="UserOutline"
          placeholder="Enter First Name"
          value={values.first_name}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="last_name"
          label="Last Name"
          icon="UserOutline"
          placeholder="Enter Last Name"
          value={values.last_name}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          type="number"
          name="phone_code"
          label="Phone Code"
          icon="PhoneCall"
          placeholder="Enter Phone Code"
          value={values.phone_code}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="phone_number"
          label={
            <>
              Phone Number <span className="text-red-500">*</span>
            </>
          }
          icon="PhoneCall"
          placeholder="Enter Phone Number"
          value={values.phone_number}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            let value = e.target.value;
            let val = value.replace(/[^0-9*#+]+/g, "");
            if (val?.length <= 15) setFieldValue("phone_number", val);
          }}
          onBlur={handleBlur}
          isInfo
        />
        <Select
          name="gender"
          label="Gender"
          icon="UserOutline"
          placeholder="Select Gender"
          removable
          options={genderOptions}
          value={values.gender}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            setFieldValue("gender", e.target.value);
          }}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="description"
          label="Description"
          placeholder="Enter Description"
          icon="Description"
          value={values.description}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          type="text"
          name="lead_status"
          label="Lead Status / Stage"
          icon="LeadManagement"
          placeholder="Select Lead Status"
          value={dispoName}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            setFieldValue("lead_status", e.target.value);
          }}
          onClick={() => setShowDispoModal(true)}
          onBlur={handleBlur}
          isInfo
        />
        <Select
          name="country_uuid"
          label="Country"
          placeholder="Select Country"
          icon="Globe"
          options={countryOptions}
          value={values.country_uuid}
          touched={touched}
          errors={errors}
          removable
          onChange={(e: any) => {
            setFieldValue("country_uuid", e.target.value);
          }}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="address"
          label="Address"
          icon="Address"
          placeholder="Enter Address"
          value={values.address}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="city"
          label="City"
          icon="City"
          placeholder="Enter City"
          value={values.city}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="state"
          label="State"
          placeholder="Enter State"
          icon="Address"
          value={values.state}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="province"
          label="Province"
          placeholder="Enter Province"
          icon="Home"
          value={values.province}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="postal_code"
          label="Postal code"
          placeholder="Enter Postal code"
          icon="Postalcode"
          value={values.postal_code}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <DatePicker
          name="dob"
          placeholder="Enter DOB"
          value={values.dob}
          touched={touched}
          errors={errors}
          onChange={(date: any) => {
            setFieldValue("dob", date);
          }}
          isInfo
        />
        <Input
          type="number"
          name="alternate_phone_number"
          label="Alternate phone number"
          placeholder="Enter Alternate phone number"
          icon="PhoneCall"
          value={values.alternate_phone_number}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            let value = e.target.value;
            let val = value.replace(/[^0-9*#+]+/g, "");
            if (val?.length <= 15)
              setFieldValue("alternate_phone_number", val);
          }}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="email"
          label="Email"
          placeholder="Enter Email"
          icon="Email"
          value={values.email}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Select
          name="user_uuid"
          label="Assign User"
          placeholder="Select User"
          icon="UserOutline"
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
        <Select
          name="campaign_uuid"
          label="Campaign"
          placeholder="Select Campaign"
          icon="Campaign"
          removable
          options={campaignOptions}
          value={values.campaign_uuid}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            setFieldValue("campaign_uuid", e.target.value);
          }}
          onBlur={handleBlur}
          isInfo
        />

        {/* Priority Selector for Kanban Leads */}
        <div className="flex flex-col justify-center">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
            Priority <span className="text-gray-400 font-normal text-[11px]">(Default: Medium)</span>
          </label>
          <div className="flex items-center gap-2 h-[46px]">
            {[
              { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
              { label: "Medium", color: "#d97706", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
              { label: "Low", color: "#059669", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
            ].map((p) => {
              const isSelected = (values.priority || "Medium") === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setFieldValue("priority", p.label)}
                  className="flex-1 h-full rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border"
                  style={{
                    background: isSelected ? p.bg : "#ffffff",
                    borderColor: isSelected ? p.border : "#e5e7eb",
                    color: isSelected ? p.color : "#64748b",
                    boxShadow: isSelected ? `0 2px 8px ${p.border}` : "none",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ background: isSelected ? p.color : "#cbd5e1" }}
                  />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {showDispoModal && (
          <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black bg-opacity-40">
            <div
              ref={modalRef}
              className="bg-white rounded-lg shadow-2xl p-6 w-[420px] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Select Lead Status / Stage</h2>
                <button
                  type="button"
                  onClick={() => setShowDispoModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ✕
                </button>
              </div>
              <DispositionTree
                items={dispositionOptions}
                selectedValue={values.lead_status}
                onSelect={(item: any) => {
                  setDispoName(item?.label || item?.name);
                  setFieldValue("lead_status", item.value || item.disposition_uuid);
                  setShowDispoModal(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {customFieldData && customFieldData.length > 0 ? (
        <div className="shadow-box mb-6">
          <div className="py-3 px-5 rounded-t-md flex justify-between items-center bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm">
            <span className="text-sm font-bold text-primary">Custom Fields</span>
          </div>

          <div className="py-5 px-4 bd-white gap-y-[24px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
            {customFieldData?.map((item: any) => {
              switch (item?.field_type) {
                case "0":
                  return (
                    <Input
                      key={item?.field_name}
                      name={item?.field_name}
                      label={item?.field_label}
                      placeholder={`${item?.field_placeholder}`}
                      value={values?.custom_fields?.[item?.field_name]}
                      onChange={handleCustomChange}
                    />
                  );
                case "1":
                  return (
                    <Textarea
                      key={item?.field_name}
                      name={item?.field_name}
                      label={item?.field_label}
                      placeholder={`${item?.field_placeholder}`}
                      value={values?.custom_fields?.[item?.field_name]}
                      onChange={handleCustomChange}
                    />
                  );
                case "2":
                  return (
                    <Select
                      key={item?.field_name}
                      name={item?.field_name}
                      label={item?.field_label}
                      value={values?.custom_fields?.[item?.field_name]}
                      options={createOptionsFromString(item?.field_options)}
                      onChange={handleCustomChange}
                    />
                  );
                case "3":
                  return (
                    <MultiSelect
                      key={item?.field_name}
                      name={item?.field_name}
                      label={item?.field_label}
                      options={createOptionsFromString(item?.field_options)}
                      onChange={handleOptionChange}
                      value={values?.custom_fields?.[item?.field_name]}
                      isSelectAll={true}
                      menuPlacement={"bottom"}
                    />
                  );
                case "4":
                  return (
                    <Radio
                      key={item?.field_name}
                      name={item?.field_name}
                      label={item?.field_label}
                      value={values?.custom_fields?.[item?.field_name]}
                      options={createOptionsFromString(item?.field_options)}
                      onChange={handleCustomChange}
                    />
                  );
                case "5":
                  return (
                    <Checkbox
                      key={item?.field_name}
                      name={item?.field_name}
                      label={item?.field_label}
                      selectedValues={values?.custom_fields?.[item?.field_name]}
                      options={createOptionsFromString(item?.field_options)}
                      onChange={(e: any) => {
                        handleCheckboxChange(e);
                      }}
                    />
                  );
                case "6":
                  return (
                    <DatePicker
                      key={item?.field_name}
                      name={item?.field_name}
                      label={item?.field_label}
                      value={
                        values?.custom_fields?.[item?.field_name]
                          ? new Date(values?.custom_fields?.[item?.field_name])
                          : ""
                      }
                      touched={touched}
                      errors={errors}
                      placeholder={`Select ${item?.field_label}`}
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      onChange={(date: any) => {
                        setFieldValue(
                          `custom_fields.${item?.field_name}`,
                          format(new Date(date), "yyyy-MM-dd HH:mm:ss")
                        );
                      }}
                      showTimeSelect
                      isInfo
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      ) : null}
    </>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={() => {
        resetForm();
        onClose?.();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          width: "100%",
          maxWidth: "960px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeUp .2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f8fafc",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>
              {modalTitle || (id ? "Edit Lead" : "Add New Lead")}
            </h3>
            {defaultStageTitle && (
              <p style={{ fontSize: "12px", color: "#64748b", margin: "3px 0 0 0" }}>
                Target Stage: <span style={{ fontWeight: 700, color: "#342df2" }}>{defaultStageTitle}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose?.();
            }}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
          {isLoading ? <Loader /> : formBody}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            background: "#f8fafc",
          }}
        >
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose?.();
            }}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              border: "1.5px solid #cbd5e1",
              background: "#fff",
              color: "#475569",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit()}
            style={{
              padding: "8px 24px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #342df2, #5b54f6)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(52,45,242,0.35)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : id ? "Update Lead" : "Create Lead"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanLeadModal;
