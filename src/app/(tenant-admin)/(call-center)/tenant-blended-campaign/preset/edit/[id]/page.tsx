"use client";
import { useLayoutEffect, useState , useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { CardForm } from "@/components/ui-components";
import { 
   // blendedData,
   blendedPresetAdd,
   blendedPresetUpdate,
   blendedPresetSingleGet,
     updateSingleBlendedData,
     useSingleBlended,
     useBlendedData,
     } from "@/redux/slice/tenant-admin/blendedSlice";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input,Switch } from "@/components/forms";
import { Danger, Success } from "@/redux/services/toasterServices";

interface InitialValueType {
    name: string;
    number: string;
    hide_number: "0",
}
const AddPreset = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const blendedData = useSingleBlended();
    const blended = useBlendedData();
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        number: "",
        hide_number: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
        number: Yup.string().required("Please enter number"),
    });

    // Create or Update IVR
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["uuid"] = id;
         //onCreatePreset(payload);
        // onUpdatePreset(payload);
        if (id) {
            onUpdatePreset(payload);
        } 
        else {
            onCreatePreset(payload);
        }
    };

    useLayoutEffect(() => {
        if (!id) return;
        setValues({
            ...values,
            name: blended?.name,
            number: blended?.number,
            hide_number: blended?.hide_number || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blended, id]);

    useEffect(() => {
        if (id) {
            onGetSinglePresetData();
        }
    }, [id]);

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
        setValues,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,

    });

    // Create Hangup Status & Navigate Back
    const onCreatePreset = async (payload: any) => {
        setLoading(true);
        try {
          //  const payload = { ...values };
            const res:any = await dispatch(blendedPresetAdd(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                Success(res.data);
               // resetForm();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error(" --->", e?.message);
        }
    };

     // Fetching Single blended Data
   const onUpdatePreset = async (values: any) => {
    try {
        const payload = {
            ...values,
            id,
        };
        console.log(payload);
        const res: any = await dispatch(blendedPresetUpdate(payload)).unwrap();
        if (res?.statusCode === 200) {
            Success(res.data);
            resetForm();
            router.back();
           dispatch(updateSingleBlendedData({}));
        } else {
            Danger(res?.data);
        }
        setLoading(false);
    } catch (e: any) {
        setLoading(false);
        console.error("Update Preset Err --->", e?.message);
    }
};

  // Fetching Single blended Data
  const onGetSinglePresetData = async () => {
    try {
        const res: any = await dispatch(blendedPresetSingleGet(id)).unwrap();
        if (res?.statusCode === 200) {
            const blended = res?.data;
            setValues({
                ...values,
                campaign_uuid:blended?.campaign_uuid,
                name: blended?.name,
                number: blended?.number,
                hide_number: blended?.hide_number || "0",  
            });
      }  
    } catch (err) {
        console.error("Get Single Preset Data Err =-=>", err);
    }
};

    return (
        <CardForm
           // title="Edit Preset"
           id={id}
           length={id ? 0 : blended?.count}
           title={id ? "Edit Preset" : "Create Preset"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
                id && dispatch(updateSingleBlendedData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
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
                <Input
                    name="number"
                    label="Number"
                    placeholder="Enter Number"
                    value={values.number}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                 <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"  
                    label="Hide Number"
                    value={values.hide_number}
                    onClick={(value: string) => setFieldValue("hide_number", value)}
                />
              
         </div>
        </CardForm>
    );
};

export default AddPreset;
