"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    didForward,
    updateSingleDidData,
    useSingleDid,
} from "@/redux/slice/tenant-admin/didSlice";
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
import { ForwardingInitialValueType } from "@/types/tenant-admin/didTypes";

// OPTIONS IMPORT
import { routingTypeOptions2 } from "@/config/options";
import {
    externalUserOptionsGet,
    useExternalUserOptions,
} from "@/redux/slice/tenant-admin/userSlice";

const Forwarding = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const sipOptions: any = useSipOptions();
    const ivrOptions: any = useIvrOptions();
    const timeConditionOptions: any = useTimeConditionOptions();
    const callQueueOptions: any = useCallQueueOptions();
    const ringOptions: any = useRingOptions();
    const conferenceOptions: any = useConferenceOptions();
    const externalUserOptions: any = useExternalUserOptions();
    const did = useSingleDid();

    const [loading, setLoading] = useState<boolean>(false);
    const ref = useRef<any>(null);

    const initialValues: ForwardingInitialValueType = {
        did_forwarding_type: "1",
        did_forwarding_value: "",
    };

    const validationSchema = Yup.object<ForwardingInitialValueType>({
        did_forwarding_type: Yup.string().required("Please select routing"),
        did_forwarding_value: Yup.string().required("Please select any value"),
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
            did_forwarding_type:
                did?.did_forwarding_type || initialValues?.did_forwarding_type,
            did_forwarding_value:
                did?.did_forwarding_value || initialValues?.did_forwarding_value,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [did, id]);

    useEffect(() => {
        if (!id) return;
        onGetIvrOptions();
        onGetSipOptions();
        onGetTimeConditionOptions();
        onGetCallQueueOptions();
        onGetRingGroupOptions();
        onGetConferenceOptions();
        onGetExternalUserOptions();
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

    // Fetching External User Options
    const onGetExternalUserOptions = async () => {
        try {
            await dispatch(externalUserOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get External User Options Err =-=>", err);
        }
    };

    // get create name
    const getCreateName = (type: string) => {
        const data = routingTypeOptions2?.find((val: any) => val?.value === type);
        return data?.label || "";
    };

    // get create url
    const getCreateUrl = (type: string) => {
        const data = routingTypeOptions2?.find((val: any) => val?.value === type);
        return data?.url ? `/tenant-did/forwarding/${data?.url}/create` : "";
    };

    // Set Options in Fail-Over Routing Options
    const getOptions = () => {
        switch (values.did_forwarding_type) {
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
            case "9":
                return externalUserOptions;
        }
    };

    const getName = () => {
        const data: any = routingTypeOptions2?.find(
            (val: any) => val?.value === values.did_forwarding_type
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
            const res: any = await dispatch(didForward(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleDidData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Forwarding DID Err --->", e?.message);
        }
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
                    dispatch(updateSingleDidData({}));
                    router.back();
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                    <Select
                        name="did_forwarding_type"
                        label="Routing"
                        options={routingTypeOptions2}
                        value={values.did_forwarding_type}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setValues({
                                ...values,
                                did_forwarding_type: e.target.value,
                                did_forwarding_value: "",
                            });
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                    {values.did_forwarding_type === "8" ? (
                        <Input
                            name="did_forwarding_value"
                            value={values.did_forwarding_value}
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
                            name="did_forwarding_value"
                            label={"Set " + getName()}
                            placeholder={"Select " + getName()}
                            removable
                            isAdd
                            createName={"Create " + getCreateName(values.did_forwarding_type)}
                            createPath={getCreateUrl(values.did_forwarding_type)}
                            options={getOptions() || []}
                            value={values.did_forwarding_value}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("did_forwarding_value", e.target.value);
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
