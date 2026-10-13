"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { didCreate, useDid } from "@/redux/slice/tenant-admin/didSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/tenant-admin/didTypes";

// OPTIONS IMPORT
import { didAsCallerIdOptions, timeoutOptions2 } from "@/config/options";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateDidForm = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const did = useDid();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: InitialValueType = {
    number: "",
    status: "0",
    timeout: "",
    codec: "PCMA",
    user_uuid: "",
    did_as_cid: "1",
    name: "",
  };

  const validationSchema = Yup.object<InitialValueType>({
    number: Yup.string().required("Please Enter Your Did Number"),
    did_as_cid: Yup.string().required("Please Enter A Did As Caller Id"),
  });

  // Create or Update DID Nnumber
  const onSubmit = (values: any) => {
    const payload = { ...values };
    payload["tenant_uuid"] = user?.tenant_detail?.uuid;
    onCreateDid(payload);
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
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  // Create DID & Navigate to DID Nunmber Page
  const onCreateDid = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res: any = await dispatch(didCreate(payload)).unwrap();
      if (res?.statusCode === 201) {
        Success(res.data);
        resetForm();
        router.back();
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Create DID Err --->", e?.message);
    }
  };

  return (
    <CardForm
      name="did"
      managerName={managerName}
      length={did?.count}
      title="Create DID"
      loading={loading}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => {
        resetForm();
        router.back();
      }}
    >
      <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
        <Input
          name="name"
          label="DID Name"
          placeholder="Enter DID Name"
          icon="DIDNumber"
          value={values.name}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          type="number"
          name="number"
          label="DID Number"
          placeholder="Enter DID Number"
          value={values.number}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
          noSpace
        />
        <Switch
          label="Status"
          value={values.status}
          onClick={(value: string) => setFieldValue("status", value)}
        />
        <Select
          name="timeout"
          label="Timeout"
          placeholder="Select Timeout"
          icon="ClockGray"
          removable
          options={timeoutOptions2}
          value={values.timeout}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            setFieldValue("timeout", e.target.value);
          }}
          onBlur={handleBlur}
          isInfo
        />
        <Input
          name="codec"
          label="Codec"
          placeholder="Enter Codec"
          icon="Codec"
          value={values.codec}
          touched={touched}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
          isInfo
          noSpace
        />
        <Select
          name="did_as_cid"
          label="DID as Caller ID"
          placeholder="Select DID as Caller ID"
          icon="DIDCALLERID"
          options={didAsCallerIdOptions}
          value={values.did_as_cid}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            setFieldValue("did_as_cid", e.target.value);
          }}
          onBlur={handleBlur}
          isInfo
        />
      </div>
    </CardForm>
  );
};

export default CreateDidForm;
