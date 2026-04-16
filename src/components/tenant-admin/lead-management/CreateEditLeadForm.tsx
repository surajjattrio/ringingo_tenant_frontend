"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MultiSelect, { Option } from "../../forms/MultiSelect";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { format } from "date-fns";

// PROJECT IMPORT
import {
  getSingleLead,
  leadCreate,
  leadUpdate,
  useLead,
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
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { DatePicker, TimePicker } from "@/components/pickers";
import { Input, Select, Textarea } from "@/components/forms";
import { CardForm, Loader } from "@/components/ui-components";
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
import { ManagerNameTypes } from "@/types/formTypes";
import DispositionTree from "../outbound-campaign/DispositionTree";
// import { useTenantDispositionOptions } from "@/redux/slice/tenant-admin/leadStatusSlice";

const CreateEditLeadForm = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const userOptions = useUserOptions();
  const leadGroupOptions = useLeadGroupOptions();
  // const leadStatusOptions = useDispositionOptions();
  const countryOptions = useCountryOptions();
  // const dispositionOptions = useTenantDispositionOptions();
  const dispositionOptions = useDispositionOptions();
  const lead = useLead();

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

  // Trigger When - Time Picker Value Change
  const handleTimeChange = (
    key: string,
    secondKey: string,
    hour: string,
    minute: string,
    name: string
  ) => {
    var time = {
      [key]: hour,
      [secondKey]: minute,
    };
    setFieldValue(`custom_fields.${name}`, time);
  };

  // const getDefaultValue = () => {
  //   let val = leadStatusOptions.filter((x: any) => x?.label === "NEW");
  //   return val[0]?.value.toString() || "";
  // };
  //   const getDefaultValue = () => {
  //   let val = leadStatusOptions.filter((x: any) => x?.label === "NEW");
  //   return val[0]?.value.toString() || "";
  // };
  useEffect(() => {
    if (!values.lead_status && dispositionOptions?.length) {
      const def = dispositionOptions.find(
        (x: any) => x.label === "NEW"
      );
      if (def) {
        setFieldValue("lead_status", def.value);
        setDispoName(def.label);
      }
    }
  }, [dispositionOptions]);



  const initialValues: InitialValueType = {
    first_name: "",
    last_name: "",
    phone_code: "",
    phone_number: "",
    lead_group_uuid: "",
    lead_status: "",
    country_uuid: "",
    address: "",
    city: "",
    state: "",
    province: "",
    postal_code: "",
    dob: "",
    alternate_phone_number: "",
    email: "",
    user_uuid: "",
    gender: "",
    description: "",
    custom_fields: {},
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

  // Create or Update Lead Management
  const onSubmit = (values: any) => {
    const payload = { ...values };
    console.log("valuesss apyload leaad form submit", values);
    // payload["DebtorAccount"] = values.custom_fields.DebtorAccount ?? "";
    // payload["Employee"] = values.custom_fields.Employee ?? "";
    // payload["MiddleName"] = values.custom_fields.MiddleName ?? "";
    // payload["SSN"] = values.custom_fields.SSN ?? "";
    // payload["ClientName"] = values.custom_fields.ClientName ?? "";
    // payload["Balance"] = values.custom_fields.Balance ?? "";
    // payload["AmountPlaced"] = values.custom_fields.AmountPlaced ?? "";
    // payload["AmountPaid"] = values.custom_fields.AmountPaid ?? "";
    // payload["HomePhone"] = values.custom_fields.HomePhone ?? "";
    // payload["NumberMultiples"] = values.custom_fields.NumberMultiples ?? "";
    // payload["ScheduleDate"] = values.custom_fields.ScheduleDate ?? "";
    // payload["DialerList"] = values.custom_fields.DialerList ?? "";
    payload["custom_fields"] = values?.custom_fields || {};
    payload["tenant_uuid"] = user?.tenant_detail?.uuid;
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
          // lead_status: "",
          country_uuid: leadData?.country_uuid || "",
          address: leadData?.address || "",
          city: leadData?.city || "",
          state: leadData?.state || "",
          province: leadData?.province || "",
          postal_code: leadData?.postal_code || "",
          dob: leadData?.dob ? new Date(leadData?.dob) : "",
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

  // useLayoutEffect(() => {
  //   getSingleLeadCustomFieldsDetail();
  // }, [values]);
  useEffect(() => {
    if (!values?.lead_group_uuid) return;
    getSingleLeadCustomFieldsDetail();
  }, [values.lead_group_uuid]);
  useEffect(() => {
    onGetUserOptions();
    onGetLeadGroupOptions();
    onGetLeadStatusOptions();
    onGetCountryOptions();
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

  // Fetching User Options
  const onGetUserOptions = async () => {
    try {
      await dispatch(userOptionsGet()).unwrap();
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

  // Fetching Lead Status Options
  const onGetLeadStatusOptions = async () => {
    try {
      await dispatch(dispositionOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Lead Status Options Err =-=>", err);
    }
  };

  // Fetching Country Options
  const onGetCountryOptions = () => {
    try {
      dispatch(countryOptionsGet()).unwrap();
    } catch (e: any) {
      console.error("Get Country Options Err --->", e?.message);
    }
  };

  // Create Lead Management & Navigate to Lead Management Page
  const onCreateLead = async (values: any) => {
    setLoading(true);
    try {
      // delete values.custom_fields;
      const payload = { ...values };
      const res: any = await dispatch(leadNewCreate(payload)).unwrap();
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
      console.error("Create Lead Management Err --->", e?.message);
    }
  };

  // Update Lead Management & Navigate to Lead Management Page
  const onUpdateLead = async (values: any) => {
    setLoading(true);
    try {
      // delete values.custom_fields;
      const payload = {
        ...values,
        id,
      };
      const res: any = await dispatch(leadNewUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        router.back();
        Success(res.data);
        resetForm();
        // dispatch(updateSingleLeadData({}));
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
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
    const options = optionsString.split(", ").map((item: any) => ({
      value: item,
      label: item.charAt(0).toUpperCase() + item.slice(1), // Capitalize the first letter
    }));

    return options;
  };

  return (
    <>
      <CardForm
        className="border bg-gray-5"
        id={id}
        name="lm"
        managerName={managerName}
        length={id ? 0 : lead?.count}
        title={id ? "Edit Lead Management" : "Create Lead Management"}
        loading={loading}
        handleSubmit={handleSubmit}
        onDoneClick={handleSubmit}
        onCancelClick={() => {
          resetForm();
          router.back();
          // id && dispatch(updateSingleLeadData({}));
        }}
      >
        {isLoading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
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
              {/* <Select
                name="lead_status"
                label="Lead Status"
                placeholder="Select Lead Status"
                removable
                options={dispositionOptions}
                value={values?.lead_status}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("lead_status", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              /> */}
              <Input
                type="text"
                name="lead_status"
                label="Lead Status"
                icon="LeadManagement"
                placeholder="Select Lead Status"
                value={dispoName}
                touched={touched}
                // readOnly
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
                label="User"
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
              {showDispoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div
                    ref={modalRef}
                    className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto"
                  >
                    <h2 className="text-lg font-semibold mb-4">Select Lead Status</h2>
                    <DispositionTree
                      items={dispositionOptions}
                      selectedValue={values.lead_status}
                      onSelect={(item: any) => {
                        setDispoName(item?.label || item?.name)
                        setFieldValue("lead_status", item.value || item.disposition_uuid);
                        setShowDispoModal(false);
                      }}
                    />

                    {/* <div className="mt-4 text-right">
                      <button
                        type="button"
                        className="text-sm text-red-500"
                        onClick={() => setShowDispoModal(false)}
                      >
                        Cancel
                      </button>
                    </div> */}
                  </div>
                </div>
              )}
            </div>

            {customFieldData && customFieldData.length > 0 ? (
              <div className="shadow-box mb-10">
                <div className="py-4 px-6 rounded-t-md flex justify-between items-center bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm">
                  <span className="text-sm font-bold text-primary">Custom Fields</span>
                </div>

                {/* Meta Fields Start */}
                <div
                  className={`py-6 px-4 bd-white gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 `}
                >
                  {customFieldData?.map((item: any) => {
                    // if(item?.field_type === "5"){
                    //     setCheckedOptions(values?.custom_fields?.[item?.field_name]);
                    // }
                    switch (item?.field_type) {
                      case "0":
                        return (
                          <Input
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
                            name={item?.field_name}
                            label={item?.field_label}
                            value={values?.custom_fields?.[item?.field_name]}
                            options={createOptionsFromString(
                              item?.field_options
                            )}
                            onChange={handleCustomChange}
                          />
                        );
                      case "3":
                        return (
                          <MultiSelect
                            name={item?.field_name}
                            label={item?.field_label}
                            options={createOptionsFromString(
                              item?.field_options
                            )}
                            onChange={handleOptionChange}
                            value={values?.custom_fields?.[item?.field_name]}
                            isSelectAll={true}
                            menuPlacement={"bottom"}
                          />
                        );
                      case "4":
                        return (
                          <Radio
                            name={item?.field_name}
                            label={item?.field_label}
                            value={values?.custom_fields?.[item?.field_name]}
                            options={createOptionsFromString(
                              item?.field_options
                            )}
                            onChange={handleCustomChange}
                          />
                        );
                      case "5":
                        return (
                          <Checkbox
                            name={item?.field_name}
                            label={item?.field_label}
                            selectedValues={
                              values?.custom_fields?.[item?.field_name]
                            }
                            options={createOptionsFromString(
                              item?.field_options
                            )}
                            onChange={(e: any) => {
                              handleCheckboxChange(e);
                            }}
                          />
                        );
                      case "6":
                        return (
                          <DatePicker
                            name={item?.field_name}
                            label={item?.field_label}
                            value={
                              values?.custom_fields?.[item?.field_name]
                                ? new Date(
                                  values?.custom_fields?.[item?.field_name]
                                )
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
                    }
                  })}
                </div>
                {/* Meta Fields End */}
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </CardForm>

    </>
  );
};

export default CreateEditLeadForm;  