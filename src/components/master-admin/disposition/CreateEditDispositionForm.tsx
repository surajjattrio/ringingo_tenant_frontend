"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
  dispositionCreate,
  dispositionUpdate,
  dispositionSingleGet,
  updateSingleDispositionData,
  //useDisposition,
  useSingleDisposition,
  parentDispositionGet,
  useDispositionData,
  dispositionDelete,
  dispositionStatusUpdate,
} from "@/redux/slice/master-admin/dispositionSlice";

import {
  useDispositionOptions,
  dispositionOptionsGet,
} from "@/redux/slice/master-admin/dispositionSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Select, Switch, Toggle } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/master-admin/dispositionTypes";

// OPTIONS IMPORT
import { dispositionLevelOptions, genderOptions, testingtOptions } from "@/config/options";
import { DatePicker } from "@/components/pickers";

const CreateEditDispositionForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  // const dispositionOptions = useDispositionOptions();
  const dispositionData = useDispositionData();


  const [dispositionOptions, setDispositionOptions] = useState<any>([]);
  const [level0Parent, setLevel0Parent] = useState<any>();
  // console.log("dispositionOptions", dispositionData);

  const [childDispositions, setChildDispositions] = useState<any[]>([]);
  // console.log("childDispositions", childDispositions);


  const parentDispositionList = async (level: any, parent_disposition: any) => {
    try {
      let res;
      if (parent_disposition) {
        res = await dispatch(parentDispositionGet({ current_disposition: id, parent_disposition: parent_disposition })).unwrap()
        setLevel0Parent(res.data[0])
        console.log("asjkdsabas", res.data[0].name)
      } else {

        res = await dispatch(parentDispositionGet({ current_disposition: id, level: level })).unwrap()
        setDispositionOptions(res.data)
      }
      // console.log("parentDispositionList", res.data)

    } catch (error) {
      console.log("Error fetch parent disposition", error);
    }
  }

  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: InitialValueType = {
    name: "",
    code: "",
    status: "0",
    human_answer: "0",
    sale: "0",
    level: 0,                // ✅ new field
    parent_disposition: "",   // ✅ new field
    has_children: false     // ✅ new field
  };

  const validationSchema = Yup.object<InitialValueType>({
    name: Yup.string().required("Please enter name"),
    code: Yup.string().required("Please enter code"),
  });

  // Create or Update Disposition
  //  const onSubmit = (values: any) => {
  //  const payload = { ...values }
  // payload['tenant_uuid'] = user?.tenant_detail?.uuid
  //payload['country_uuid'] = user?.tenant_detail?.uuid
  //  if (id) {
  //    onUpdateDisposition(payload);
  //  } else {
  //      onCreateDisposition(payload);
  //   }
  // };

  // Create or Update Disposition
  const onSubmit = (values: InitialValueType) => {
    if (id) {
      onUpdateDisposition(values);
    } else {
      onCreateDisposition(values);
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

  useLayoutEffect(() => {
    if (!id) return;
    onGetSingleDispositionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useLayoutEffect(() => {
    if (values.level == 0) {
      // setFieldValue("parent_disposition", "");
      setDispositionOptions([])
    }
    else {
      parentDispositionList(values.level, "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.level]);
  console.log("valuesvalues", values);

  useLayoutEffect(() => {
    parentDispositionList(values.level, values.parent_disposition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.parent_disposition, id]);

  useEffect(() => {
    onGetDispositionOptions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching Disposition Options
  const onGetDispositionOptions = () => {
    try {
      dispatch(dispositionOptionsGet());
    } catch (err) {
      console.error("Get Disposition Options Err =-=>", err);
    }
  };

  // Fetching Single Disposition Data
  const onGetSingleDispositionData = async () => {
    try {
      const res: any = await dispatch(dispositionSingleGet(id)).unwrap();
      if (res?.statusCode === 200) {
        const dispositionData = res?.data;
        setValues({
          ...values,
          name: dispositionData?.name,
          code: dispositionData?.code,
          status: dispositionData?.status || "0",
          human_answer: dispositionData?.human_answer || "0",
          sale: dispositionData?.sale || "0",
          parent_disposition: dispositionData?.parent_disposition || "",
          has_children: dispositionData?.has_children || false,
          level: dispositionData?.level || 0,
        });
      }
    } catch (err) {
      console.error("Get Single Disposition Data Err =-=>", err);
    }
  };

  // Create Disposition & Navigate to Disposition Page
  const onCreateDisposition = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res: any = await dispatch(dispositionCreate(payload)).unwrap();
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
      console.error("Create Disposition Err --->", e?.message);
    }
  };

  // Update Disposition & Navigate to Disposition Page
  const onUpdateDisposition = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        id,
      };
      const res: any = await dispatch(dispositionUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        Success(res.data);
        router.back();
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Update Disposition Err --->", e?.message);
    }
  };

  const fetchChildDispositions = async () => {
    if (!id || !values.has_children) return;
    setLoading(true);
    try {
      const res = dispositionData?.children;
      setChildDispositions(res || []);
    } catch (error) {
      console.error("Error fetching child dispositions:", error);
    }
    setLoading(false);
  };


  useLayoutEffect(() => {
    if (values.has_children) {
      fetchChildDispositions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.has_children, id]);

  return (
    <CardForm
      id={id}
      name="disposition"
      loading={loading}
      title={id ? "Edit System Dispositions" : "Create System Dispositions"}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => {
        router.back();
      }}
    >
      <div className="pt-5 pb-10 space-y-[30px]">
        <div className="grid grid-cols-3">
          <div className="px-4">
            <Input
              name="name"
              label="Name"
              placeholder="Enter Name"
              value={values.name}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
          </div>

          <div className="px-4">
            <Input
              name="code"
              label="Code"
              placeholder="Enter Code"
              value={values.code}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
          </div>

          <div className="px-4 mb-4">
            <Select
              name="level"
              label="Level"
              placeholder="Select Level"
              options={dispositionLevelOptions}
              value={values.level}
              touched={touched}
              errors={errors}
              onChange={(e: any) => setFieldValue("level", Number(e.target.value))}
              onBlur={handleBlur}
              isInfo
            />
          </div>

          {values.level !== 0 && values.level !== "" && (
            <div className="px-4 mb-4">
              <Select
                name="parent_disposition"
                label="Parent Disposition"
                placeholder="Select Parent Disposition"
                // options={[]}
                options={dispositionOptions?.map((d: any) => ({
                  label: d.name,
                  value: d.disposition_uuid,
                }))}
                value={values.parent_disposition}
                touched={touched}
                errors={errors}
                onChange={(e: any) => setFieldValue("parent_disposition", e.target.value)}
                onBlur={handleBlur}
                isInfo
              />
            </div>
          )}

          {values.level === 2 && values.parent_disposition != "" && (
            <div className="px-4 mb-4">
              <Input
                name="parent_parent"
                label=
                {
                  <>
                    Level 0 Parent <span className="text-red-500">*</span>
                  </>
                }
                icon="UserOutline"
                placeholder=""
                value={level0Parent?.name}
                touched={touched}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                isInfo
                disabled
              />
            </div>
          )}

          <div className="px-4">
            <Switch
              className="pt-[2px]"
              switchButtonClass="py-1.5"
              trueName="Yes"
              falseName="No"
              label="Human Answser"
              value={values.human_answer}
              onClick={(value: string) => setFieldValue("human_answer", value)}
            />
          </div>

          <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-2 gap-x-4 px-4 mr-[10px]">
            <Switch
              className="pt-[2px]"
              switchButtonClass="py-1.5"
              trueName="Yes"
              falseName="No"
              label="Sale"
              value={values.sale}
              onClick={(value: string) => setFieldValue("sale", value)}
            />

            <div className="px-4 ml-[150px]">
              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
                label="Status"
                value={values.status}
                onClick={(value: string) => setFieldValue("status", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </CardForm>
  );
};

export default CreateEditDispositionForm;
