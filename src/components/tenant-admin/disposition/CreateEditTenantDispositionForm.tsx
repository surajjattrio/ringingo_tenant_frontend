"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    tenantDispositionCreate,
    tenantDispositionDelete,
    tenantDispositionStatusUpdate,
    tenantDispositionUpdate,
    updateSingleTenantDispositionData,
    useSingleTenantDisposition,
} from "@/redux/slice/tenant-admin/tenantDispositionSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Select, Switch, Toggle } from "@/components/forms";
import { CardForm, Table } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/tenantDispositionTypes";
import { ManagerNameTypes } from "@/types/formTypes";
import { parentDispositionGet } from "@/redux/slice/master-admin/dispositionSlice";
import { dispositionLevelOptions } from "@/config/options";
import { DeleteModal } from "@/components/modals";
import { campaignOptionsGet, useCampaignOptions } from "@/redux/slice/tenant-admin/campaignReportSlice";

const CreateEditTenantDispositionForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const dispositionData = useSingleTenantDisposition();

    useEffect(() => {
        onGetCampaignOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetCampaignOptions = async () => {
        try {
            await dispatch(campaignOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get campaign Options Err =-=>", err);
        }
    };

    let campaignOptions = useCampaignOptions();
    // console.log("capiaosdnas", campaignOptions);

    const [dispositionOptions, setDispositionOptions] = useState<any>([]);
    const [level0Parent, setLevel0Parent] = useState<any>();
    // console.log("dispositionOptions", dispositionData);

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
        callback: "1",
        campaign_uuid: "",
        level: 0,                // ✅ new field
        parent_disposition: "",   // ✅ new field
        has_children: false     // ✅ new field
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Name"),
        code: Yup.string().required("Please Enter Code"),
        parent_disposition: Yup.string().when("level", {
            is: (level: number) => level !== 0,
            then: schema => schema.required("Please Select Parent Disposition"),
            otherwise: schema => schema.notRequired(),
        }),
    });

    //  // Create Disposition
    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("name", values?.name);
        payload.append("code", values?.code);
        payload.append("status", "0");
        payload.append("human_answer", "0");
        payload.append("sale", "0");
        payload.append("callback", "1");
        payload.append("tenant_uuid", user?.tenant_detail?.uuid);
        payload.append("parent_disposition", values?.parent_disposition);
        payload.append("has_children", values?.has_children);
        payload.append("level", values?.level);
        payload.append("campaign_uuid", values?.campaign_uuid);
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
        // onGetSingleDispositionData();
        setValues({
            ...values,
            name: dispositionData?.name,
            code: dispositionData?.code,
            status: dispositionData?.status || "0",
            human_answer: dispositionData?.human_answer || "0",
            sale: dispositionData?.sale || "0",
            callback: dispositionData?.callback || "1",
            parent_disposition: dispositionData?.parent_disposition || "",
            has_children: dispositionData?.has_children || false,
            level: dispositionData?.level || 0,
            campaign_uuid: dispositionData?.campaign_uuid || [],
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispositionData, id]);

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
    // console.log("valuesvalues", values);

    useLayoutEffect(() => {
        parentDispositionList(values.level, values.parent_disposition)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.parent_disposition, id]);

    // Create Disposition & Navigate to Disposition Page
    const onCreateDisposition = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(
                tenantDispositionCreate(payload)
            ).unwrap();
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
            const res: any = await dispatch(
                tenantDispositionUpdate(payload)
            ).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleTenantDispositionData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Disposition Err --->", e?.message);
        }
    };


    const level = values.level === 0 ? "0" : values.level;
    return (
        <CardForm
            id={id}
            name="disposition"
            managerName={managerName}
            // length={disposition?.count}
            loading={loading}
            title={id ? "Edit Disposition" : "Create Disposition"}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleTenantDispositionData(dispositionData));
            }}
        >
            <div className="pt-5 pb-10 space-y-[30px]">
                <div className="grid grid-cols-3">
                    <div className="px-4 mb-4">
                        <Input
                            name="name"
                            label=
                            {
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

                    <div className="px-4 mb-4">
                        <Input
                            name="code"
                            label=
                            {
                                <>
                                    Code <span className="text-red-500">*</span>
                                </>
                            }
                            icon="Code"
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
                            // value={values.level} 
                            touched={touched}
                            errors={errors}
                            // onChange={(e: any) => setFieldValue("level", Number(e.target.value))}
                            value={level}
                            onChange={(e:any) => setFieldValue("level", e.target.value === "0" ? 0 : Number(e.target.value))}
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

                    <Select
                        name="campaign_uuid"
                        isMulti
                        isGroup
                        icon="Group"
                        label="Campaigns"
                        placeholder="Select campaigns"
                        options={campaignOptions}
                        value={values.campaign_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("campaign_uuid", e);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />

                    <div className="px-4 mb-4">
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
                    <div className="px-4 mb-4">
                        {/* <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-2 gap-x-40 px-4"> */}

                        <Switch
                            className="pt-[2px]"
                            switchButtonClass="py-1.5"
                            trueName="Yes"
                            falseName="No"
                            label="Sale"
                            value={values.sale}
                            onClick={(value: string) => setFieldValue("sale", value)}

                        />
                    </div>

                    <div className="px-4 mb-4">
                        <Switch
                            className="pt-[2px]"
                            switchButtonClass="py-1.5"
                            label="Status"
                            value={values.status}
                            onClick={(value: string) => setFieldValue("status", value)}
                        />
                    </div>

                    {!values?.has_children &&
                        <div className="px-4 mb-4">
                            <Switch
                                className="pt-[2px]"
                                switchButtonClass="py-1.5"
                                label="Callback"
                                value={values.callback}
                                onClick={(value: string) => setFieldValue("callback", value)}
                            />
                        </div>
                    }

                </div>
                {/* {values.has_children && (
                    <>
                        <div className="mt-5">
                            <Table
                                name="disposition"
                                managerName={managerName}
                                isLoading={isLoading}
                                title="Child Dispositions"
                                navigate="/tenant-disposition/create"
                                columns={columns}
                                data={childDispositions}
                                page={filter.page}
                                totalCount={childDispositions.length}
                                limit={filter.limit}
                                selectedRows={selectedRow}
                                onPageClick={(page: number) => setFilter({ ...filter, page })}
                                onEditClick={onEditClick}
                                onDeleteClick={(data: any) => setDeleteId(data.uuid)}
                                onSelectRow={(e: any, row: any, array: any) => setSelectedRow(array)}
                                onLimitChange={(limit: number) => setFilter({ ...filter, limit, page: 1 })}
                                onRefresh={() => fetchChildDispositions()}
                            />
                        </div>
                        <DeleteModal
                            loading={loading}
                            visible={!!deleteId}
                            onCancelClick={() => setDeleteId("")}
                            onDoneClick={() => onDeleteDisposition(deleteId)}
                        />
                    </>
                )} */}
            </div>
        </CardForm>

    );
};

export default CreateEditTenantDispositionForm;
