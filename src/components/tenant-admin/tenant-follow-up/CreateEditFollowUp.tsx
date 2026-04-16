"use client";
import { useEffect, useState } from "react";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    addFollowUp,
    editFollowUp,
    updateSingleFollowUpData,
    useSingleFollowUp,
} from "@/redux/slice/tenant-admin/followUpSlice";
import { Success } from "@/redux/services/toasterServices";
import { ModalHeader } from "@/components/modals";
import { Select, Textarea } from "@/components/forms";
import { followUpTypeOptions } from "@/config/options";
import { DatePicker } from "@/components/pickers";

// THIRD-PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";

// TYPES
import { followUpTypes } from "@/types/tenant-admin/followUpTypes";
import { useParams, useRouter } from "next/navigation";
import { CardForm } from "@/components/ui-components";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditFollowUp = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const singleFollowUpData = useSingleFollowUp();
    const userOptions = useUserOptions();

    useEffect(() => {
        onGetUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    useEffect(() => {
        if (id) {
            setValues({
                ...values,
                lead_management_uuid: singleFollowUpData?.lead_management_uuid
                    ? singleFollowUpData?.lead_management_uuid
                    : "",
                user_uuid: singleFollowUpData?.user_uuid
                    ? singleFollowUpData?.user_uuid
                    : "",
                type: singleFollowUpData?.type ? singleFollowUpData?.type : "",
                date_time: singleFollowUpData?.date_time
                    ? new Date(singleFollowUpData?.date_time)
                    : "",
                comment: singleFollowUpData?.comment ? singleFollowUpData?.comment : "",
                is_reschedule: "0",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const initialValues: followUpTypes = {
        lead_management_uuid: "",
        user_uuid: "",
        type: "",
        date_time: "",
        comment: "",
        is_reschedule: "0",
    };

    const validationSchema = Yup.object<followUpTypes>({
        type: Yup.string().required("Please select type"),
        date_time: Yup.string().required("Please select date & Time"),
        comment: Yup.string().required("Please add some comment"),
    });

    // ON SUBMIT PROFILE DETAILS
    const onSubmit = async (values: any) => {
        setIsLoading(true);
        try {
            let payload = { ...values };
            payload["lead_management_uuid"] =
                singleFollowUpData?.lead_management_uuid;
            payload["date_time"] = format(
                new Date(values?.date_time),
                "yyyy-MM-dd HH:mm:ss"
            );
            payload["id"] = id;
            const res: any = await dispatch(editFollowUp(payload)).unwrap();
            if (res && res.statusCode === 200) {
                setIsLoading(false);
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleFollowUpData({}));
            }
        } catch (error: any) {
            setIsLoading(false);
            console.log("Create follow up err--->", error?.message);
        }
    };

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
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <CardForm
            id={id}
            managerName={managerName}
            title={id ? "Edit Follow Up" : "Follow Up"}
            loading={isLoading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleFollowUpData({}));
            }}
        >
            <div className="grid grid-cols-3 items-center gap-4 py-4">
                <div className="col-span-3">
                    <Textarea
                        label="Type your Comment"
                        name="comment"
                        placeholder="Type your comment here..."
                        value={values.comment}
                        onChange={handleChange}
                        touched={touched}
                        errors={errors}
                        onBlur={handleBlur}
                    />
                </div>
                <div>
                    <Select
                        name="user_uuid"
                        label="User"
                        placeholder="Select User"
                        removable
                        value={values.user_uuid}
                        options={userOptions}
                        onChange={(e: any) => setFieldValue("user_uuid", e.target.value)}
                        isInfo
                    />
                </div>
                <div>
                    <Select
                        label="Types"
                        value={values.type}
                        name="type"
                        placeholder="Select types"
                        options={followUpTypeOptions}
                        onChange={(e: any) => {
                            setFieldValue("type", e.target.value);
                        }}
                        touched={touched}
                        errors={errors}
                        onBlur={handleBlur}
                    />
                </div>
                <div>
                    <DatePicker
                        name="date_time"
                        label="Date & Time"
                        placeholder="Select date and time"
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        value={values.date_time}
                        onChange={(e: any) => {
                            setFieldValue("date_time", e);
                        }}
                        showTimeSelect
                        touched={touched}
                        errors={errors}
                        timeIntervals={15}
                    />
                </div>
            </div>
        </CardForm>
    );
};

export default CreateEditFollowUp;
