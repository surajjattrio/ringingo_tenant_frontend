"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
  webFormCreate,
  webFormUpdate,
  updateSingleWebFormData,
  useSingleWebForm,
} from "@/redux/slice/tenant-admin/webFormSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Textarea } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/webformTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditWebformForm = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const webFormData = useSingleWebForm();

  const [detailsTemplate, setDetailsTemplate] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: InitialValueType = {
    name: "",
    description: "",
    url: "",
  };

  const validationSchema = Yup.object<InitialValueType>({
    name: Yup.string().required("Please Enter Name"),
    description: Yup.string().required("Please Enter Description"),
  });

  // Your template details
  const details = {
    firstname: "It will replace First name",
    lastname: "It will indicate Last Name.",
    phone_number: "It will indicate Phone Number.",
    address: "It will indicate Address.",
    state: "It will indicate State.",
    province: "It will indicate Province.",
    postal_code: "It will indicate Postal Code.",
    dob: "It will indicate DOB.",
    phone_code: "It will indicate Phone Code.",
    alternate_phone_number: "It will indicate Alternate Phone Number.",
    email: "It will indicate Email.",
    gender: "It will indicate Gender.",
    country: "It will indicate Country.",
    city: "It will indicate City.",
  };

  // Your template string
  const template = `

 Key                   Value
 #firstname#             {{firstname}}
 #lastname#              {{lastname}}
 #phone_number#          {{phone_number}}
 #address#               {{address}}
 #state#                 {{state}}
 #province#              {{province}}
 #postal_code#           {{postal_code}}
 #dob#                   {{dob}}
 #phone_code#            {{phone_code}}
 #alternate_phone_number#{{alternate_phone_number}}
 #email#                 {{email}}
 #gender#                {{gender}}
 #country#               {{country}}
 #city#                  {{city}}
 `;

  useEffect(() => {
    // Function to replace placeholders with values
    const replacePlaceholders = (template: any, values: any) => {
      return template.replace(/{{(\w+)}}/g, (match: any, key: any) => {
        return values.hasOwnProperty(key) ? values[key] : match;
      });
    };

    // Call replacePlaceholders function and update state
    const updatedTemplate = replacePlaceholders(template, details);
    setDetailsTemplate(updatedTemplate);
  }, [details, template]); // Run only when details or template changes

  //  // Create Disposition
  const onSubmit = (values: any) => {
    const payload = new FormData();
    payload.append("name", values?.name);
    payload.append("description", values?.description);
    payload.append("url", values?.url);
    payload.append("tenant_uuid", user?.tenant_detail?.uuid);
    if (id) {
      onUpdateWebForm(values);
    } else {
      onCreateWebForm(values);
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
    // onGetSingleDispositionData();
    setValues({
      ...values,
      name: webFormData?.name,
      description: webFormData?.description,
      url: webFormData?.url,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webFormData, id]);

  // Create Disposition & Navigate to Disposition Page
  const onCreateWebForm = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res: any = await dispatch(webFormCreate(payload)).unwrap();
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
      console.error("Create WebForm Err --->", e?.message);
    }
  };

  // Update Disposition & Navigate to Disposition Page
  const onUpdateWebForm = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        id,
      };
      const res: any = await dispatch(webFormUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        router.back();
        Success(res.data);
        resetForm();
        dispatch(updateSingleWebFormData({}));
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Update WebForm Err --->", e?.message);
    }
  };

  return (
    <CardForm
      id={id}
      name="webform"
      managerName={managerName}
      // length={disposition?.count}
      loading={loading}
      title={id ? "Edit Webform" : "Create Webform"}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => {
        resetForm();
        router.back();
        id && dispatch(updateSingleWebFormData({}));
      }}
    >
      <div className="pt-5 pb-10 space-y-[30px]">
        <div className="grid grid-cols-3">
          {/* Description Textarea Input */}
          <div className="px-4">
            <Textarea
              // className="!px-2"
              label={
                <>
                  Description <span className="text-red-500">*</span>
                </>
              }
              icon="Description"
              name="description"
              // placeholder="Type something here..."
              rows={3}
              isInfo={false}
              value={values.description}
              onChange={handleChange}
              touched={touched}
              errors={errors}
              onBlur={handleBlur}
            />
          </div>

          {/* Name Input */}
          <div className="px-4">
            <Input
              name="name"
              label={
                <>
                  Name <span className="text-red-500">*</span>
                </>
              }
              icon="UserOutline"
              placeholder="Enter Name"
              value={values.name}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
          </div>

          {/* URL Input */}
          <div className="px-4">
            <Input
              name="url"
              label="URL"
              icon="URL"
              placeholder="Enter URL"
              value={values.url}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
          </div>

          {/* deatils title and table */}
          <div className="px-4 mt-6 col-span-3">
            <p className="mb-3 font-semibold">Details</p>
            <div className="flex gap-6">
              {[0, 1].map((colIndex) => {
                const entries = Object.entries(details);
                const half = Math.ceil(entries.length / 2);
                const sliced =
                  colIndex === 0 ? entries.slice(0, half) : entries.slice(half);

                return (
                  <div
                    key={colIndex}
                    className="w-1/2 overflow-y-auto max-h-80 scrollbar-hide border-b rounded-[15px]"
                  >
                    <table className="min-w-full divide-y divide-gray-200 text-sm rounded-[15px] ">
                      <thead className="bg-main-background sticky top-0 z-20  rounded-[15px] ">
                        <tr>
                          <th className="px-6 py-3 text-center font-medium text-[#202224]">
                            Key
                          </th>
                          <th className="px-6 py-3 text-center font-medium text-[#202224]">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y text-center divide-gray-200 rounded-[15px] border-x">
                        {sliced.map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-6 py-5 text-[#0B0A0A]">
                              #{key}#
                            </td>
                            <td className="px-6 py-5 text-[#0B0A0A]">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CardForm>
  );
};

export default CreateEditWebformForm;
