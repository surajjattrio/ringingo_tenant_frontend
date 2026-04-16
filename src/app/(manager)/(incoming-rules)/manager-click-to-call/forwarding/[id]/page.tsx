"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    clickToCallForward,
    updateSingleClickToCall,
    useSingleClickToCall,
} from "@/redux/slice/tenant-admin/clickToCallSlice";
import {
    sipOptionsGet,
    useSipOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
    ivrOptionsGet,
    useIvrOptions,
} from "@/redux/slice/tenant-admin/ivrSlice";
import {
    ringOptionsGet,
    useRingOptions,
} from "@/redux/slice/tenant-admin/ringSlice";
import {
    timeConditionOptionsGet,
    useTimeConditionOptions,
} from "@/redux/slice/tenant-admin/timeConditionSlice";
import {
    callQueueOptionsGet,
    useCallQueueOptions,
} from "@/redux/slice/tenant-admin/callQueueSlice";
import {
    conferenceOptionsGet,
    useConferenceOptions,
} from "@/redux/slice/tenant-admin/conferenceSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select } from "@/components/forms";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { ForwardingInitialValueType } from "@/types/tenant-admin/clickToCallTypes";

// OPTIONS IMPORT
import { routingTypeOptions } from "@/config/options";

const Forwarding = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const singleClickToCallData = useSingleClickToCall();

    const sipOptions: any = useSipOptions();
    const ivrOptions: any = useIvrOptions();
    const timeConditionOptions: any = useTimeConditionOptions();
    const callQueueOptions: any = useCallQueueOptions();
    const ringOptions: any = useRingOptions();
    const conferenceOptions: any = useConferenceOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: ForwardingInitialValueType = {
        clicktocall_forwarding_type: "1",
        clicktocall_forwarding_value: "",
    };

    const validationSchema = Yup.object<ForwardingInitialValueType>({
        clicktocall_forwarding_type: Yup.string().required("Please select routing"),
        clicktocall_forwarding_value: Yup.string().required(
            "Please select any value"
        ),
    });

    const onSubmit = (values: any) => {
        onUpdateForwarding(values);
    };

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setValues,
        resetForm,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        setValues({
            ...values,
            clicktocall_forwarding_type:
                singleClickToCallData?.clicktocall_forwarding_type ||
                initialValues?.clicktocall_forwarding_type,
            clicktocall_forwarding_value:
                singleClickToCallData?.clicktocall_forwarding_value ||
                initialValues?.clicktocall_forwarding_value,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [singleClickToCallData, id]);

    useEffect(() => {
        if (!id) return;
        onGetIvrOptions();
        onGetSipOptions();
        onGetTimeConditionOptions();
        onGetCallQueueOptions();
        onGetRingGroupOptions();
        onGetConferenceOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Fetching SIP Options
    const onGetSipOptions = async () => {
        try {
            await dispatch(sipOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    // Fetching IVR Options
    const onGetIvrOptions = async () => {
        try {
            await dispatch(ivrOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get IVR Options Err =-=>", err);
        }
    };

    // Fetching Time Condition Options
    const onGetTimeConditionOptions = async () => {
        try {
            await dispatch(timeConditionOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Time Condition Options Err =-=>", err);
        }
    };

    // Fetching Call Queue Options
    const onGetCallQueueOptions = async () => {
        try {
            await dispatch(callQueueOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Call Queue Options Err =-=>", err);
        }
    };

    // Fetching Ring Group Options
    const onGetRingGroupOptions = async () => {
        try {
            await dispatch(ringOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Ring Group Options Err =-=>", err);
        }
    };

    // Fetching Conference Options
    const onGetConferenceOptions = async () => {
        try {
            await dispatch(conferenceOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Conference Options Err =-=>", err);
        }
    };

    // Set Options in Fail-Over Routing Options
    const getOptions = () => {
        switch (values.clicktocall_forwarding_type) {
            case "1":
                return sipOptions;
            case "2":
                return ivrOptions;
            case "3":
                return timeConditionOptions;
            case "4":
                return conferenceOptions;
            case "5":
                return callQueueOptions;
            case "6":
                return ringOptions;
            case "7":
                return sipOptions;
        }
    };

    const getName = () => {
        const data: any = routingTypeOptions?.find(
            (val: any) => val?.value === values.clicktocall_forwarding_type
        );
        return data?.label || "";
    };
    const onUpdateForwarding = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(clickToCallForward(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleClickToCall({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Forwarding Click-to-call Err --->", e?.message);
        }
    };

    // get create name
    const getCreateName = (type: string) => {
        const data = routingTypeOptions?.find((val: any) => val?.value === type);
        return data?.label || "";
    };

    // get create url
    const getCreateUrl = (type: string) => {
        const data = routingTypeOptions?.find((val: any) => val?.value === type);
        return data?.url
            ? `/manager-click-to-call/forwarding/${data?.url}/create`
            : "";
    };

    return (
        <>
            <CardForm
                id={id}
                loading={loading}
                title="Edit Forwarding"
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    resetForm();
                    dispatch(updateSingleClickToCall({}));
                    router.back();
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                    <Select
                        name="clicktocall_forwarding_type"
                        label="Routing"
                        options={routingTypeOptions}
                        value={values.clicktocall_forwarding_type}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setValues({
                                ...values,
                                clicktocall_forwarding_type: e.target.value,
                                clicktocall_forwarding_value: "",
                            });
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                    {values.clicktocall_forwarding_type === "8" ? (
                        <Input
                            name="clicktocall_forwarding_value"
                            value={values.clicktocall_forwarding_value}
                            label="Set PSTN"
                            placeholder="Enter PSTN"
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    ) : (
                        <Select
                            name="clicktocall_forwarding_value"
                            label={"Set " + getName()}
                            placeholder={"Select " + getName()}
                            removable
                            isAdd
                            createName={
                                "Create " + getCreateName(values.clicktocall_forwarding_type)
                            }
                            createPath={getCreateUrl(values.clicktocall_forwarding_type)}
                            options={getOptions() || []}
                            value={values.clicktocall_forwarding_value}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("clicktocall_forwarding_value", e.target.value);
                            }}
                            onBlur={handleBlur}
                            isInfo
                        />
                    )}
                </div>
            </CardForm>
        </>
    );
};

export default Forwarding;
