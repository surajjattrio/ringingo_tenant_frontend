"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
  trunkCreate,
  trunkSingleGet,
  trunkUpdate,
} from "@/redux/slice/master-admin/trunkSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import {
  Input,
  InputNumber,
  Password,
  Select,
  Switch,
} from "@/components/forms";
import { CardForm, Icon } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { initialValueType } from "@/types/master-admin/trunkTypes";
import {
  sipProfileOptionsGet,
  useSipProfileOptions,
} from "@/redux/slice/master-admin/sipProfileSlice";

/* ============================== CREATE & EDIT TRUNK FORM ============================== */

const CreateEditTrunkForm = () => {
  const { id }: any = useParams();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const sipProfileOptions = useSipProfileOptions();

  const [loading, setLoading] = useState<boolean>(false);
  const [isOptionalInfo, setIsOptionalInfo] = useState(false);

  const initialValues: initialValueType = {
    name: "",
    sip_profile_uuid: "",
    username: "",
    password: "",
    domain: "",
    outbound_proxy: "",
    register: "0",
    status: "0",
    from_domain: "",
    from_user: "",
    realm: "",
    extension_in_contact: "1",
    extension: "",
    expire_seconds: "60",
    reg_transport: "",
    contact_params: "",
    ping: "60",
    retry_seconds: "60",
    register_proxy: "",
    dialplan_variable: "",
  };

  const validationSchema = Yup.object<initialValueType>({
    name: Yup.string().required("Please enter sip trunk name"),
    domain: Yup.string().required("Please enter domain"),
    // .matches(
    //  /^[A-Za-z ]+\./,
    //   "Invalid domain format"),

    sip_profile_uuid: Yup.string().required("Please select sip profile"),
  });

  // Create or Update Trunk
  const onSubmit = (values: any) => {
    let payload = { ...values };
    if (id) {
      onUpdateTrunk(payload);
    } else {
      onCreateTrunk(payload);
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
  } = useFormik<any>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useLayoutEffect(() => {
    if (!id) return;
    onGetSingleTrunkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    onGetSipProfileOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (values?.register === "1") {
      touched["username"] = false;
      touched["password"] = false;
      delete errors["username"];
      delete errors["password"];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, errors, touched]);

  // Fetching SIP Profile Options
  const onGetSipProfileOptions = async () => {
    try {
      dispatch(sipProfileOptionsGet()).unwrap();
    } catch (e: any) {
      console.error("Get sip-profile Data Err --->", e?.message);
    }
  };

  // Fetching Single Trunk Data
  const onGetSingleTrunkData = async () => {
    try {
      const res: any = await dispatch(trunkSingleGet(id)).unwrap();
      if (res?.statusCode === 200) {
        const trunkData = res?.data;
        setValues({
          ...values,
          name: trunkData?.name || "",
          sip_profile_uuid: trunkData?.sip_profile_uuid || "",
          username: trunkData?.username || "",
          password: trunkData?.password || "",
          domain: trunkData?.domain || "",
          outbound_proxy: trunkData?.outbound_proxy || "",
          register: trunkData?.register || "0",
          status: trunkData?.status || "0",
          from_domain: trunkData?.from_domain || "",
          from_user: trunkData?.from_user || "",
          realm: trunkData?.realm || "",
          extension_in_contact: trunkData?.extension_in_contact || "1",
          extension: trunkData?.extension || "",
          expire_seconds: trunkData?.expire_seconds || "60",
          reg_transport: trunkData?.reg_transport || "",
          contact_params: trunkData?.contact_params || "",
          ping: trunkData?.ping || "60",
          retry_seconds: trunkData?.retry_seconds || "60",
          register_proxy: trunkData?.register_proxy || "",
          dialplan_variable: trunkData?.dialplan_variable || "",
        });
      }
    } catch (err) {
      console.error("Get Single Trunk Data Err =-=>", err);
    }
  };

  // Create Trunk & Navigate to Trunk Page
  const onCreateTrunk = async (val: initialValueType) => {
    setLoading(true);
    try {
      const payload = { ...val };
      const res: any = await dispatch(trunkCreate(payload)).unwrap();
      if (res?.statusCode === 201) {
        Success(res.data);
        router.back();
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Create trunk Err --->", e?.message);
    }
  };

  // Update Trunk & Navigate to Trunk Page
  const onUpdateTrunk = async (val: initialValueType) => {
    setLoading(true);
    try {
      const payload = {
        ...val,
        id,
      };
      const res: any = await dispatch(trunkUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        router.back();
        Success(res.data);
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Update trunk Err --->", e?.message);
    }
  };

  return (
    <CardForm
      id={id}
      title={id ? "Edit SIP Trunk" : "Create SIP Trunk"}
      loading={loading}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => {
        router.back();
      }}
    >
      <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
        <Input
          name="name"
          label="Name"
          icon="User"
          placeholder="Enter Name"
          value={values.name}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          noSpace
          isInfo
        />
        <Select
          name="sip_profile_uuid"
          label="SIP Profile"
          placeholder="Select SIP Profile"
          options={sipProfileOptions}
          value={values.sip_profile_uuid}
          touched={touched}
          errors={errors}
          removable
          onChange={(e: any) => {
            setFieldValue("sip_profile_uuid", e.target.value);
          }}
          onBlur={handleBlur}
          isInfo
        />
        <Switch
          trueName="Yes"
          falseName="No"
          className="pt-[2px]"
          label="Register"
          value={values.register}
          onClick={(value: string) => setFieldValue("register", value)}
        />
        <Input
          name="username"
          label="Username"
          icon="UserName"
          placeholder="Enter Username"
          value={values.username}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          noSpace
          isInfo
        />
        <Password
          name="password"
          label="Password"
          placeholder="Enter Password"
          value={values.password}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="domain"
          label="Domain"
          placeholder="Enter Domain"
          icon="Domain"
          value={values.domain}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="outbound_proxy"
          label="Outbound Proxy"
          placeholder="Enter Outbound Proxy"
          icon="OutboundProxy"
          value={values.outbound_proxy}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Switch
          className="pt-[2px]"
          label="Status"
          value={values.status}
          onClick={(value: string) => setFieldValue("status", value)}
        />
      </div>
      <div className="shadow-box mb-10 rounded-md">
        <div
          className={`${
            isOptionalInfo && "bg-primary-v10"
          } py-4 px-6 rounded-t-md flex justify-between items-center cursor-pointer`}
          onClick={() => setIsOptionalInfo(!isOptionalInfo)}
        >
          <span
            className={`${isOptionalInfo && "text-primary"} text-sm font-bold`}
          >
            Optional Information
          </span>
          <Icon
            name={isOptionalInfo ? "MinusCircleGreen" : "PlusCircle"}
            className="cursor-pointer"
            width={24}
            height={24}
            alt={isOptionalInfo ? "iconMinusCircle" : "iconPluseCircle"}
          />
        </div>
        {isOptionalInfo && (
          <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
            <Input
              name="from_domain"
              label="From Domain"
              placeholder="Enter domain"
              value={values.from_domain}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="from_user"
              label="From User"
              placeholder="Enter User"
              value={values.from_user}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="realm"
              label="Realm"
              placeholder="Enter Realm"
              value={values.realm}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Switch
              trueName="Yes"
              falseName="No"
              className="pt-[2px]"
              label="Extension-In-contact"
              value={values.extension_in_contact}
              onClick={(value: string) =>
                setFieldValue("extension_in_contact", value)
              }
            />
            <Input
              name="extension"
              label="Extension"
              placeholder="Enter extension"
              value={values.extension}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <InputNumber
              name="expire_seconds"
              label="Expire Seconds"
              value={values.expire_seconds}
              touched={touched}
              errors={errors}
              onChange={(value: string) =>
                setFieldValue("expire_seconds", value)
              }
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="reg_transport"
              label="Reg-Transport"
              placeholder="Enter Reg-Transport"
              value={values.reg_transport}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="contact_params"
              label="Contact Params"
              placeholder="Enter contact params"
              value={values.contact_params}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="ping"
              label="Ping"
              placeholder="Enter Ping"
              value={values.ping}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <InputNumber
              name="retry_seconds"
              label="Retry Seconds"
              value={values.retry_seconds}
              touched={touched}
              errors={errors}
              onChange={(value: string) =>
                setFieldValue("retry_seconds", value)
              }
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="register_proxy"
              label="Register-Proxy"
              placeholder="Enter register proxy"
              value={values.register_proxy}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="dialplan_variable"
              label="Dialplan Variable"
              placeholder="Enter Dialplan Variable"
              value={values.dialplan_variable}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
          </div>
        )}
      </div>
    </CardForm>
  );
};

export default CreateEditTrunkForm;
