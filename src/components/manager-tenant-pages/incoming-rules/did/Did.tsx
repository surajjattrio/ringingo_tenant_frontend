"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
  didDelete,
  didSearch,
  didStatusUpdate,
  didAllGet,
  didGet,
  updateSingleDidData,
  useAllDid,
  useDid,
  didAllSearch,
} from "@/redux/slice/tenant-admin/didSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table, Icon } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { DidFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions, timeoutOptions2 } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// DATA
const headers: any = [
  { label: "DID Number", key: "number" },
  { label: "DID Name", key: "name" },
  { label: "Timeout", key: "timeout_value" },
  { label: "Status", key: "status_name" },
];

// NAME STATE
const initialValues: DidFilterTypes = {
  number: { key: "number|1", val: "", dropdown: "1" },
  timeout: { key: "timeout|4", val: "", dropdown: "4" },
};

const DID = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const did = useDid();
  const allDid = useAllDid();

  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
      name: "number",
      title: "DID Number",
      sortable: true,
    },
    {
      name: "name",
      title: "DID Name",
      sortable: true,
    },
    {
      name: "timeout_value",
      title: "Timeout",
      sortable: true,
    },
    {
      name: "status",
      title: "Status",
    },
    {
      name: "",
      title: "Forwarding",
      action: (row: any) => {
        return (
          <div className="flex justify-center items-center">
            <Icon
              tooltip="Forwarding"
              name="ForwardOutline"
              width={25}
              height={25}
              onClick={() => {
                dispatch(updateSingleDidData(row));
                router.push(
                  managerName
                    ? "/manager-did/forwarding/" + row?.uuid
                    : "/tenant-did/forwarding/" + row?.uuid
                );
              }}
            />
          </div>
        );
      },
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
      onGetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Preapring Data for Export File
  const prepareExportProps = () => {
    const data = allDid?.data || [];
    return { headers, data, filename: "DID.csv" };
  };

  // Fetching DID Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(didGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get DID Err =-=>", err);
    }
  }, 500);

  // Fetching All DID Data
  const onGetAllDid = async () => {
    setCsvLoading(true);
    try {
      if (filter?.isAdvance) {
        const payload = {
          [data["number"]["key"]]: data["number"]["val"],
          [data["timeout"]["key"]]: data["timeout"]["val"],
          status,
          page: filter?.page,
          limit: did?.count || 0,
        };
        Object.entries(payload)?.forEach(([key, val]: any) => {
          if (!val) {
            delete payload[key];
          }
        });
        await dispatch(didAllSearch(payload)).unwrap();
        setCsvLoading(false);
        setIsCsvDownload(true);
      } else {
        const params = { ...filter };
        params["limit"] = did?.count || 0;
        delete params["isAdvance"];
        await dispatch(didAllGet(params)).unwrap();
        setCsvLoading(false);
        setIsCsvDownload(true);
      }
    } catch (err: any) {
      console.error("Get All DID Err =-=>", err);
    }
  };

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

  // Advance Search - Fetching DID Data
  const onSearchData = async () => {
    setLoading(true);
    try {
      const payload = {
        [data["number"]["key"]]: data["number"]["val"],
        [data["timeout"]["key"]]: data["timeout"]["val"],
        status,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(didSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching DID Data
  const onEmptySearch = () => {
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // Navigate to Create DID Page
  const onCreateDid = () =>
    router.push(managerName ? "/manager-did/create" : "/tenant-did/create");

  // Store Single DID Data in Redux & Navigate to Update DID Page
  const onEditClick = (data: any) => {
    try {
      dispatch(updateSingleDidData(data));
      router.push(
        managerName ? "/manager-did/" + data?.uuid : "/tenant-did/" + data?.uuid
      );
    } catch (err) {
      console.error("Store Single DID Err =-=>", err);
    }
  };

  // Update DID Status & Fetching DID Data
  const onUpdateStatus = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        id: data?.uuid,
        status: data?.status === "0" ? "1" : "0",
      };
      const res: any = await dispatch(didStatusUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        Success(res?.data);
        setFilter({ ...filter });
      } else {
        Danger(res?.data);
      }
    } catch (err) {
      setLoading(false);
      console.error("Update DID Status Err =-=>", err);
    }
  };

  // Deleting Selected DID & Fetching DID Data
  const onDeleteDid = async (id: string) => {
    setLoading(true);
    try {
      await dispatch(didDelete(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === did?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      setDeleteId("");
      Danger("");
      console.error("Delete DID Err --->", e?.message);
    }
  };

  // Mass Delete Click - Open Delete Modal
  const onMassDeleteDid = () => {
    const selectedRows = [...selectedRow];
    setDeleteId(selectedRows.join(","));
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
        name={name}
        managerName={managerName}
        length={did?.count || 0}
        csvProps={prepareExportProps()}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={() => onGetAllDid()}
        createText="Create DID"
        search={filter?.search}
        onCreateClick={onCreateDid}
        onDeleteClick={onMassDeleteDid}
        onImportClick={() =>
          router.push(managerName ? "manager-did/import" : "tenant-did/import")
        }
        onChange={(e: any) =>
          setFilter({
            ...filter,
            search: e.target.value,
            isAdvance: false,
            page: 1,
            limit: 10,
          })
        }
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
          name="number"
          label="DID Number"
          placeholder="Enter DID Number"
          value={data.number.val}
          dropdownValue={data.number.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("number", e.target.value)}
          onDropdownChange={(e: any) => handleSelect("number", e.target.value)}
          isInfo
        />
        <Select
          name="timeout"
          label="Timeout"
          placeholder="Select Timeout"
          removable
          value={data.timeout.val}
          options={timeoutOptions2}
          onChange={(e: any) => handleChnage("timeout", e.target.value)}
          isInfo
        />
        <Switch
          className="pt-[2px]"
          switchButtonClass="py-1.5"
          label="Status"
          value={status}
          onClick={(value: string) => setStatus(value)}
        />
      </Head>

      <div className="mt-5">
        <Table
          isLoading={loading}
          title="DID"
          name={name}
          managerName={managerName}
          navigate={managerName ? "/manager-did/create" : "/tenant-did/create"}
          columns={columns}
          data={did?.data?.length ? did.data : []}
          page={filter.page}
          totalCount={did?.count || 0}
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
          onUpdateStatus={onUpdateStatus}
          onRefresh={() => setFilter({ ...filter })}
        />
      </div>
      <DeleteModal
        loading={loading}
        visible={!!deleteId}
        onCancelClick={() => setDeleteId("")}
        onDoneClick={() => onDeleteDid(deleteId)}
      />
    </div>
  );
};

export default DID;
