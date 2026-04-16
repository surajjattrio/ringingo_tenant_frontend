"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// PROJECT IMPORT
import {
    updateSingleWebFormData,
    useIsLoading,
    webFormDelete,
    webFormGet,
    webFormSearch,
    // webFormStatusUpdate,
    useWebFormData,
} from "@/redux/slice/tenant-admin/webFormSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch, Toggle, Textarea } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import { useFormik } from "formik";


// TYPES IMPORT
import { WebFormFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
//import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: WebFormFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    description: { key: "description|1", val: "", dropdown: "1" },
    url: { key: "code|1", val: "", dropdown: "1" },
};

const TenantWebform = () => {
    // props: ManagerPageTypes
    //const { managerName = null, name = null } = props;
    const managerName = null;
    const name = null;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useIsLoading();
    const webFormData = useWebFormData();
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
    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";

    const [status, setStatus] = useState<string>("0");

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "description",
            title: "Description",
            sortable: true,
        },
        {
            name: "url",
            title: "URL",
            sortable: true,
        },
        {
            name: "actions",
            title: "Actions",
        },
    ];


    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            console.log("else");
            onGetWebFormData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching Disposition Data
    const onGetWebFormData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(webFormGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get WebForm Err =-=>", err);
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
                [data["name"]["key"]]: data["name"]["val"],
                [data["description"]["key"]]: data["description"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(webFormSearch(payload)).unwrap();
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
        onGetWebFormData();
    };

    // Navigate to Create Disposition Page
    const onCreateWebForm = () =>
        router.push(
            isPathname ? "/manager-webform/create" : "/tenant-webform/create"
        );

    // Navigate to Edit Disposition Page
    //   const onEditClick = (data: any) => router.push("/manager-disposition/" + data?.uuid);

    // Store Single Outgoing Rules Data in Redux & Navigate to Update Outgoing Rules Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleWebFormData(data));
            router.push(
                isPathname
                    ? "/manager-webform/" + data?.uuid : "/tenant-webform/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Webform Err =-=>", err);
        }
    };



    // Deleting Selected Disposition & Fetching Disposition Data
    const onDeleteWebForm = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(webFormDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === webFormData?.data?.length && filter?.page > 0
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete WebForm Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteWebForm = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={webFormData?.count || ""}
                createText="Create Webform"
                onCreateClick={onCreateWebForm}
                onDeleteClick={onMassDeleteWebForm}
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
                <InputSelect
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("name", e.target.value)}
                    isInfo
                />
                {/* <Textarea
                   className="!px-2"
                   label="Description"
                   name="description"
                   placeholder="Type something here..."
                   rows={3}
                   value={data.description.val}
                   onChange={(e: any) => handleChnage("description", e.target.value)}
                //   touched={touched}
                //    errors={errors}
                //    onBlur={handleBlur}
                            /> */}

                {/* <InputSelect
                    name="url"
                    label="URL"
                    placeholder="Enter URL"
                    value={data.url.val}
                    dropdownValue={data.url.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("url", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("url", e.target.value)}
                    isInfo
                /> */}


            </Head>
            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={isLoading}
                    title="Webform"
                    navigate={
                        isPathname
                            ? "/manager-webform/create"
                            : "/tenant-webform/create"
                    }
                    columns={columns}
                    data={webFormData?.data?.length ? webFormData.data : []}
                    page={filter.page}
                    totalCount={webFormData?.count || 0}
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
                onDoneClick={() => onDeleteWebForm(deleteId)}
            />
        </div>
    );
};

export default TenantWebform;

