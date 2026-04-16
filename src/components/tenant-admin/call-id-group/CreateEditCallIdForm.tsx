"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    callerIdDelete,
    callerIdGroupCreate,
    callerIdGroupUpdate,
    callerIdSingleGet,
} from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { setActiveTab, useActiveTab } from "@/redux/slice/commonSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Switch } from "@/components/forms";
import { DeleteModal } from "@/components/modals";
import { CardForm, Table } from "@/components/ui-components";

// TYPES IMPORT
import { ColumnsType } from "@/types/tableTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const tabsData = [{ title: "General" }, { title: "Caller ID" }];

const CreateEditCallIdForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const router = useRouter();
    const activeTab = useActiveTab();

    const [loading, setLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>();
    const [deleteId, setDeleteId] = useState<any>("");
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
    });

    const columns: ColumnsType[] = [
        {
            name: "caller_id",
            title: "Caller ID",
            sortable: true,
        },
        {
            name: "actions",
            title: "Actions",
            showEdit: false,
        },
    ];

    const initialValues: any = {
        caller_id_group: "",
        status: "0",
    };

    const validationSchema = Yup.object<any>({
        caller_id_group: Yup.string().required("Please Enter Caller Id Group"),
    });

    // Create or Update caller id group
    const onSubmit = (values: any) => {
        const payload = { ...values };
        if (id) {
            onEdit(payload);
        } else {
            onCreate(payload);
        }
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
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        onGetSingleCallerIdData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, filter]);

    // Fetching Single Tenant Data
    const onGetSingleCallerIdData = async () => {
        setLoading(true);
        try {
            const params = { ...filter, id };
            const res: any = await dispatch(callerIdSingleGet(params)).unwrap();
            if (res?.statusCode === 200) {
                if (filter.page > 1) {
                    setTableData(res?.data || []);
                } else {
                    setTableData(res?.caller_ids || []);
                }
                const callerIdData = res?.data;
                setValues({
                    ...values,
                    caller_id_group: callerIdData?.caller_id_group,
                    status: callerIdData?.status || "0",
                });
                setTotalCount(res?.count);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Single Caller ID Group Data Err =-=>", err);
        }
    };

    // Create caller id group & Navigate to caller id group Page
    const onCreate = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(callerIdGroupCreate(payload)).unwrap();
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
            console.error("Create caller id group Err --->", e?.message);
        }
    };

    // Edit caller id group & Navigate to caller id group Page
    const onEdit = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values, id };
            const res: any = await dispatch(callerIdGroupUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                dispatch(setActiveTab(0));
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Edit caller id group Err --->", e?.message);
        }
    };

    // Deleting Selected Caller Id & Fetching Caller Id Data
    const onDelete = async (deleteId: string) => {
        setLoading(true);
        try {
            const params = {
                uuid: id,
                id: deleteId,
            };
            await dispatch(callerIdDelete(params)).unwrap();
            setDeleteId("");
            onGetSingleCallerIdData();
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Caller Id Group Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteCallerID = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <>
            <CardForm
                id={id}
                name="call_id_group"
                managerName={managerName}
                title={id ? "Edit Caller Id Group" : "Create Caller Id Group"}
                loading={loading}
                tabsData={id ? tabsData : []}
                handleSubmit={(e: any) => {
                    switch (activeTab) {
                        case 0:
                            handleSubmit(e);
                            break;
                        default:
                            break;
                    }
                }}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    dispatch(setActiveTab(0));
                    resetForm();
                    router.back();
                }}
            >
                {activeTab === 0 || !id ? (
                    <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                        <Input
                            name="caller_id_group"
                            // label="Caller Id Group"
                            label={
                                <>
                                   Caller Id Group <span className="text-red-500">*</span>
                                </>
                            }
                            placeholder="Enter Caller Id Group"
                            icon="CallerIdGroup"
                            value={values.caller_id_group}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                        <Switch
                            className="pt-[2px]"
                            switchButtonClass="py-1.5"
                            label="Status"
                            value={values.status}
                            onClick={(value: string) => setFieldValue("status", value)}
                        />
                    </div>
                ) : (
                    <div className="py-5 space-y-5">
                        <div className="flex border-b gap-3 pb-3">
                            <Button
                                className="p-2"
                                icon="Plus"
                                text="Add More"
                                style="primary-outline"
                                onClick={() => {
                                    dispatch(setActiveTab(1));
                                    router.push(
                                        managerName
                                            ? `/manager-call-id-group/${id}/add`
                                            : `/tenant-call-id-group/${id}/add`
                                    );
                                }}
                            />
                            <Button
                                className="p-2"
                                text="Import"
                                style="primary-outline"
                                onClick={() => {
                                    dispatch(setActiveTab(1));
                                    router.push(
                                        managerName
                                            ? `/manager-call-id-group/${id}/import`
                                            : `/tenant-call-id-group/${id}/import`
                                    );
                                }}
                            />
                            <Button
                                className="p-2"
                                text="Delete"
                                style="error"
                                onClick={() => {
                                    onMassDeleteCallerID();
                                }}
                            />
                        </div>
                        <Table
                            headerClassName="!bg-dark-800 !text-heading"
                            sortIconColor="#13151F"
                            isLoading={loading}
                            columns={columns}
                            data={tableData?.length ? tableData : []}
                            onDeleteClick={(data: any) => setDeleteId(data.uuid)}
                            selectedRows={selectedRow}
                            onSelectRow={(e: any, data: any, array: string[]) =>
                                setSelectedRow(array)
                            }
                            onRefresh={() => setFilter({ ...filter })}
                            page={filter.page}
                            totalCount={totalCount}
                            limit={filter.limit}
                            onPageClick={(page: number) => {
                                setFilter({
                                    ...filter,
                                    page,
                                });
                            }}
                            onLimitChange={(limit: number) => {
                                setFilter({
                                    ...filter,
                                    page: 1,
                                    limit,
                                });
                            }}
                        />
                    </div>
                )}
            </CardForm>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDelete(deleteId)}
            />
        </>
    );
};

export default CreateEditCallIdForm;
