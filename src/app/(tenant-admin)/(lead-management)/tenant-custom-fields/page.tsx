"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    updateSingleCustomFieldsData,
    useIsLoading,
    customFieldsDelete,
    customFieldsGet,
    customFieldsSearch,
    // webFormStatusUpdate,
    useCustomFieldsData,
} from "@/redux/slice/tenant-admin/customFieldsSlice";
import {
    fieldTypeOptions,
} from "@/config/options";
import {
    leadGroupOptionsGet,
    useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch, Toggle, Textarea, Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import { useFormik } from "formik";


// TYPES IMPORT
import { CustomFieldsFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
//import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: CustomFieldsFilterTypes = {
    lead_group_uuid: { key: "lead_group_uuid|1", val: "", dropdown: "1" },
    field_label: { key: "field_label|1", val: "", dropdown: "1" },
    field_name: { key: "field_name|1", val: "", dropdown: "1" },
    field_type: { key: "field_type|1", val: "", dropdown: "1" },

};

const TenantCustomFields = () => {
    // props: ManagerPageTypes
    //const { managerName = null, name = null } = props;
    const managerName = null;
    const name = null;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useIsLoading();
    const customFieldsData = useCustomFieldsData();
    const leadGroupOptions = useLeadGroupOptions();
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });

    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);

    const [status, setStatus] = useState<string>("0");

    const columns: ColumnsType[] = [
        {
            name: "lead_group_name",
            title: "Lead Group",
            sortable: true,
             action: (row: any) => {
            // Handle multiple lead groups
            if (row?.lead_group && Array.isArray(row.lead_group)) {
                return row.lead_group.map((lg: any) => lg.name).join(', ');
            }
            // Fallback for single lead group
            return row?.lead_group_name || '-';
        }
        },
        {
            name: "field_label",
            title: "Field Label",
            sortable: true,
        },
        {
            name: "field_name",
            title: "Reference Name",
            sortable: true,
        },
        // {
        //     name: "field_type",
        //     title: "Field Type",
        //     sortable: true,
        // },
        {
            name: "field_type",
            title: "Field Type",
            sortable: true,
            action: (row: any) => {
                let fieldTypeText;
                switch (row?.field_type) {
                    case "0":
                        fieldTypeText = "Text";
                        break;
                    case "1":
                        fieldTypeText = "Area";
                        break;
                    case "2":
                        fieldTypeText = "Select";
                        break;
                    case "3":
                        fieldTypeText = "Multi Select";
                        break;
                    case "4":
                        fieldTypeText = "Radio";
                        break;
                    case "5":
                        fieldTypeText = "Checkbox";
                        break;
                    case "6":
                        fieldTypeText = "Date";
                        break;
                    case "7":
                        fieldTypeText = "Time";
                        break;
                    default:
                        fieldTypeText = "Unknown";
                }
                return fieldTypeText;
            }
        },
        {
            name: "field_rank",
            title: "Field Rank",
            sortable: true,
        },
        {
            name: "actions",
            title: "Actions",
        },
    ];

    useEffect(() => {
        onGetLeadGroupOptions();        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            console.log("else");
            onGetCustomFieldsData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching lead-group-Options Options
    const onGetLeadGroupOptions = async () => {
        try {
            await dispatch(leadGroupOptionsGet());
        } catch (err) {
            console.error("Get DID Options Err =-=>", err);
        }
    };

    // Fetching Disposition Data
    const onGetCustomFieldsData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(customFieldsGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Custom Fields Err =-=>", err);
        }
    }, 500);

    // Advance Search - Trigger when left side Input or Select value change
    const handleChnage = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], val: val },
        });
    };

    // Advance Search - Trigger when right side Select value change
    const handleSelect = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
        });
    };

    // Advance Search - Fetching Disposition Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["lead_group_uuid"]["key"]]: data["lead_group_uuid"]["val"],
                [data["field_label"]["key"]]: data["field_label"]["val"],
                [data["field_name"]["key"]]: data["field_name"]["val"],
                [data["field_type"]["key"]]: data["field_type"]["val"],
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(customFieldsSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Disposition Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
        onGetCustomFieldsData();
    };

    // Navigate to Create Disposition Page
    const onCreateCustomFields = () =>
        router.push(
            managerName ? "/manager-custom-fields/create" : "/tenant-custom-fields/create"
        );

    // Navigate to Edit Disposition Page
    //   const onEditClick = (data: any) => router.push("/manager-disposition/" + data?.uuid);

    // Store Single Outgoing Rules Data in Redux & Navigate to Update Outgoing Rules Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleCustomFieldsData(data));
            router.push(
                managerName
                    ? "/manager-custom-fields/" + data?.uuid : "/tenant-custom-fields/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Custom Fields Err =-=>", err);
        }
    };



    // Deleting Selected Disposition & Fetching Disposition Data
    const onDeleteCustomFields = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(customFieldsDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === customFieldsData?.data?.length && filter?.page > 0
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Custom Fields Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteCustomFields = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={customFieldsData?.count || ""}
                createText="Create Custom Field"
                onCreateClick={onCreateCustomFields}
                onDeleteClick={onMassDeleteCustomFields}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        isAdvance: false,
                        page: 1,
                        limit: 10,
                    })
                }
                //onFilterClick={() => setFilterOpen(!filterOpen)}
                onSearchClick={() =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: true,
                    })
                }
                onHide={onEmptySearch}
            >
                <Select
                    name="lead_group_uuid"
                    label="Lead Group"
                    placeholder="Select  Lead Group"
                    removable
                    value={data.lead_group_uuid.val}
                    options={leadGroupOptions}
                    onChange={(e: any) =>
                        handleChnage("lead_group_uuid", e.target.value)
                    }
                    isInfo
                />

                <InputSelect
                    name="field_label"
                    label="Field Label"
                    placeholder="Enter Field Label"
                    value={data.field_label.val}
                    dropdownValue={data.field_label.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("field_label", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("field_label", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="field_name"
                    label="Field Name"
                    placeholder="Enter Field Name"
                    value={data.field_name.val}
                    dropdownValue={data.field_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("field_name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("field_name", e.target.value)}
                    isInfo
                />
                <Select
                    name="field_type"
                    label="Field Type"
                    placeholder="Select Field Type"
                    removable
                    options={fieldTypeOptions}
                    value={data.field_type.val}
                    onChange={(e: any) =>
                        handleChnage("field_type", e.target.value)
                    }
                    isInfo
                />

            </Head>
            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={isLoading}
                    title="Custom Fields"
                    navigate={
                        managerName
                            ? "/manager-custom-fields/create"
                            : "/tenant-custom-fields/create"
                    }
                    columns={columns}
                    data={customFieldsData?.data?.length ? customFieldsData.data : []}
                    page={filter.page}
                    totalCount={customFieldsData?.count || 0}
                    limit={filter.limit}
                    selectedRows={selectedRow}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
                    onEditClick={onEditClick}
                    onDeleteClick={(data: any) => setDeleteId(data.uuid)}
                    onSelectRow={(e: any, data: any, array: string[]) =>
                        setSelectedRow(array)
                    }
                    onLimitChange={(limit: number) => {
                        setFilter({
                            ...filter,
                            page: 1,
                            limit,
                        });
                    }}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteCustomFields(deleteId)}
            />
        </div>
    );
};

export default TenantCustomFields;

