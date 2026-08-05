"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
  useLead,
  leadDelete,
  leadSearch,
  leadGet,
  leadBatchUpdate,
  useAllLead,
  leadAllSearch,
  leadAllGet,
} from "@/redux/slice/tenant-admin/leadManagementSlice";
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import {
  leadGroupOptionsGet,
  useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Button, InputSelect, Select } from "@/components/forms";
import { Filter, Icon, Table } from "@/components/ui-components";
import { useAuth } from "@/contexts/hooks/useAuth";
import { SearchBar } from "@/components/pickers";
import { DeleteModal } from "@/components/modals";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import {
  dispositionOptionsGet,
  useDispositionOptions,
} from "@/redux/slice/master-admin/dispositionSlice";
import LeadInformation from "@/components/tenant-admin/lead-management/LeadInformation";
import Note from "@/components/tenant-admin/lead-management/Note";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import { CSVLink } from "react-csv";

// TYPES IMPORT
import { LeadFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: LeadFilterTypes = {
  first_name: { key: "first_name|1", val: "", dropdown: "1" },
  last_name: { key: "last_name|1", val: "", dropdown: "1" },
  phone_number: { key: "phone_number|1", val: "", dropdown: "1" },
  phone_code: { key: "phone_code|1", val: "", dropdown: "1" },
  user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
  lead_group_uuid: { key: "lead_group_uuid|4", val: "", dropdown: "4" },
  lead_status: { key: "lead_status|4", val: "", dropdown: "4" },
  lead_status_1: { key: "lead_status_1|4", val: "", dropdown: "4" },
  lead_status_2: { key: "lead_status_2|4", val: "", dropdown: "4" },
  date_filter_type: { key: "date_filter_type|4", val: "", dropdown: "4" },
  start_date: { key: "start_date|1", val: "", dropdown: "1" },
  end_date: { key: "end_date|1", val: "", dropdown: "1" },

};

const initialBatchValues = {
  user_uuid: "",
  lead_group_uuid: "",
  lead_status: "",
};

// DATA
const headers: any = [
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Phone Code", key: "phone_code" },
  { label: "Phone Number", key: "phone_number" },
  { label: "User", key: "user_name" },
  { label: "Lead Status", key: "leadStatus" },
  { label: "Campaign", key: "campaign_name" },
  { label: "Lead Group", key: "lead_group_name" },
  { label: "Email", key: "email" },
];

const LeadManagement = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lead = useLead();
  const userOptions = useUserOptions();
  const leadGroupOptions = useLeadGroupOptions();
  const leadStatusOptions = useDispositionOptions();
  const allLeadData = useAllLead();

  const [noteData, setNoteData] = useState<any>(null);
  const [leadUuid, setLeadUuid] = useState<any>(null);
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
  const [infoData, setInfoData] = useState<any>(null);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBatchUpdate, setIsBatchUpdate] = useState<boolean>(false);
  const [batchDetails, setBatchDetails] = useState(initialBatchValues);
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
  const excelRef: any = useRef();

  useEffect(() => {
    if (isCsvDownload && !csvLoading) {
      console.log("innnnn");
      excelRef?.current.link?.click();
      setIsCsvDownload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCsvDownload]);

  const columns: ColumnsType[] = [
    {
      name: "first_name",
      title: "First Name",
      sortable: true,
    },
    {
      name: "last_name",
      title: "Last Name",
      sortable: true,
    },
    {
      name: "phone_code",
      title: "Phone Code",
      sortable: true,
    },
    {
      name: "phone_number",
      title: "Phone Number",
      sortable: true,
    },
    {
      name: "user_name",
      title: "User",
      sortable: true,
    },
    {
      name: "leadStatus",
      title: "Lead Status",
      sortable: true,
    },
    {
      name: "campaign_name",
      title: "Campaign",
      sortable: true,
    },
    {
      name: "lead_group_name",
      title: "Lead Group",
      sortable: true,
    },
    {
      name: "actions",
      title: "Actions",
      action: (row: any) => {
        return (
          <>
            <div className="flex gap-2">
              <Icon
                className="cursor-pointer"
                tooltip="Info"
                name="InfoCircle"
                width={20}
                height={20}
                alt="info"
                onClick={() => {
                  setInfoData(row?.lead_management_uuid);
                  setLeadUuid(row?.lead_management_uuid);
                  setNoteData(null);
                }}
              />
              {isShowButton("edit") && (
                <Icon
                  tooltip="Edit"
                  name="Edit"
                  width={20}
                  height={20}
                  alt="Edit"
                  onClick={() => onEditClick(row)}
                />
              )}
              {isShowButton("delete") && (
                <Icon
                  tooltip="Delete"
                  name="DeleteRed"
                  width={20}
                  height={20}
                  alt="Delete"
                  onClick={() => setDeleteId(row.uuid)}
                />
              )}
            </div>
          </>
        );
      },
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

  useEffect(() => {
    onGetUserOptions();
    onGetLeadGroupOptions();
    onGetLeadStatusOptions();
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

  // Fetching Lead Group Options
  const onGetLeadGroupOptions = async () => {
    try {
      await dispatch(leadGroupOptionsGet());
    } catch (err) {
      console.error("Get Lead Group Options Err =-=>", err);
    }
  };

  // Fetching Lead Status Options
  const onGetLeadStatusOptions = async () => {
    try {
      await dispatch(dispositionOptionsGet());
    } catch (err) {
      console.error("Get Lead Status Options Err =-=>", err);
    }
  };

  const prepareCsvProps = () => {
    const data = allLeadData?.data || [];
    return { headers, data, filename: `CDRs_${allLeadData?.count || 0}.csv` };
  };

  // Fetching Lead Management Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(leadGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Lead Management Err =-=>", err);
    }
  }, 500);

  // Fetching All Lead Data
  const onGetAllLead = async () => {
    setCsvLoading(true);
    try {
      if (filter?.isAdvance) {
        const payload = {
          [data["first_name"]["key"]]: data["first_name"]["val"],
          [data["last_name"]["key"]]: data["last_name"]["val"],
          [data["phone_number"]["key"]]: data["phone_number"]["val"],
          [data["phone_code"]["key"]]: data["phone_code"]["val"],
          [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
          [data["lead_group_uuid"]["key"]]: data["lead_group_uuid"]["val"],
          [data["lead_status"]["key"]]: data["lead_status"]["val"],
          page: filter?.page,
          limit: lead?.count || 0,
        };
        Object.entries(payload)?.forEach(([key, val]: any) => {
          if (!val) {
            delete payload[key];
          }
        });
        // await dispatch(leadAllSearch(payload)).unwrap();
        let res: any = await dispatch(leadAllSearch(payload)).unwrap();
        if (res && res?.statusCode === 200) {
          setIsCsvDownload(true);
          setCsvLoading(false);
        }
        setCsvLoading(false);
      } else {
        const params = { ...filter };
        params["limit"] = lead?.count || 0;
        delete params["isAdvance"];
        let res: any = await dispatch(leadAllGet(params)).unwrap();
        if (res && res?.statusCode === 200) {
          setIsCsvDownload(true);
          setCsvLoading(false);
        }
        setCsvLoading(false);
      }
    } catch (err) {
      setCsvLoading(false);
      console.error("Get All lead Err =-=>", err);
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

  // Advance Search - Searching Data API call
  const onSearchData = async () => {
    if (
      !(
        data["first_name"]["val"] ||
        data["last_name"]["val"] ||
        data["phone_number"]["val"] ||
        data["phone_code"]["val"] ||
        data["user_uuid"]["val"] ||
        data["lead_group_uuid"]["val"] ||
        data["lead_status"]["val"]
      )
    ) {
      Danger(SEARCH_ERROR_MESSAGE);
      return false;
    }

    setLoading(true);
    try {
      const payload = {
        [data["first_name"]["key"]]: data["first_name"]["val"],
        [data["last_name"]["key"]]: data["last_name"]["val"],
        [data["phone_number"]["key"]]: data["phone_number"]["val"],
        [data["phone_code"]["key"]]: data["phone_code"]["val"],
        [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
        [data["lead_group_uuid"]["key"]]: data["lead_group_uuid"]["val"],
        [data["lead_status"]["key"]]: data["lead_status"]["val"],
        page: filter?.page,
        limit: filter?.limit,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(leadSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching Lead Management Data
  const onEmptySearch = () => {
    setIsOpen(false);
    setIsBatchUpdate(false);
    setBatchDetails(initialBatchValues);
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // Navigate to Create Lead Management Page
  const onCreateLead = () => router.push("/manager-leads/create");

  // Store Single Lead Management Data in Redux & Navigate to Update Lead Management Page
  const onEditClick = (data: any) => {
    try {
      router.push("/manager-leads/" + data?.uuid);
    } catch (err) {
      console.error("Store Single Lead Management Err =-=>", err);
    }
  };

  // Deleting Selected Lead Management & Fetching Lead Management Data
  const onDeleteLead = async (id: string) => {
    setLoading(true);
    try {
      await dispatch(leadDelete(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === lead?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      setDeleteId("");
      Danger("");
      console.error("Delete Lead Management Err --->", e?.message);
    }
  };

  // Mass Delete Click - Open Delete Modal
  const onMassDeleteLead = () => {
    const selectedRows = [...selectedRow];
    setDeleteId(selectedRows.join(","));
  };

  const handleBatchChange = (key: string, val: string) => {
    setBatchDetails({ ...batchDetails, [key]: val });
  };

  const onUpdateBatch = async () => {
    try {
      let payload: any = { ...batchDetails };
      data["first_name"]["val"] &&
        (payload["first_name"] = data["first_name"]["val"]);
      data["last_name"]["val"] &&
        (payload["last_name"] = data["last_name"]["val"]);
      data["phone_number"]["val"] &&
        (payload["phone_number"] = data["phone_number"]["val"]);
      data["phone_code"]["val"] &&
        (payload["phone_code"] = data["phone_code"]["val"]);

      data["first_name"]["val"] &&
        (payload["first_name_flag"] = data["first_name"]["key"]);
      data["last_name"]["val"] &&
        (payload["last_name_flag"] = data["last_name"]["key"]);
      data["phone_number"]["val"] &&
        (payload["phone_number_flag"] = data["phone_number"]["key"]);
      data["phone_code"]["val"] &&
        (payload["phone_code_flag"] = data["phone_code"]["key"]);

      let res: any = await dispatch(leadBatchUpdate(payload)).unwrap();
      if (res && res.statusCode === 200) {
        Success(res.data);
        setFilter({ ...filter });
      }
    } catch (error: any) {
      console.error("Lead Management batch update Err --->", error?.message);
    }
  };

  const isShowButton = (buttontype: string) => {
    const data = user?.manager_detail?.roles?.length
      ? user?.manager_detail?.roles[0]
      : {};

    if (data?.module_permission["lead-management"]?.[buttontype] === "0") {
      return true;
    }

    return false;
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-100 rounded-lg shadow-sm border border-slate-200">
        <div className="gap-2 flex">
          {isShowButton("create") && (
            <Button
              className="px-3 h-full"
              text="Create Lead"
              style="primary"
              icon="PlusWhite"
              responsive
              onClick={() => {
                onCreateLead();
              }}
            />
          )}
          <Button
            disabled={!filter.isAdvance}
            className={`${
              filter.isAdvance === false && "opacity-60"
            } px-3 h-full`}
            text="Batch Update"
            style="secondary"
            icon="Refresh2White"
            responsive
            onClick={() => {
              setIsBatchUpdate(!isBatchUpdate);
            }}
          />
          {isShowButton("delete") && (
            <Button
              className="px-3 h-full"
              text="Delete"
              style="error"
              icon="DeleteWhite"
              responsive
              onClick={() => {
                onMassDeleteLead();
              }}
            />
          )}
        </div>
        <div className="flex h-full gap-2 items-center">
          <SearchBar
            className="h-full w-56"
            placeholder="Search by Keyword"
            value={filter?.search}
            onChange={(e: any) =>
              setFilter({
                ...filter,
                search: e.target.value,
                isAdvance: false,
                page: 1,
                limit: 10,
              })
            }
          />
          <Filter
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
          {csvLoading ? (
            <div
              className={`mr-2 h-4 w-4 border-t-transparent border-spacing-1 animate-spin rounded-full border-heading border-2`}
            ></div>
          ) : (
            <>
              <div
                className={`flex items-center justify-center border border-dark-700 rounded-md px-5 py-[5px] cursor-pointer`}
                onClick={() => onGetAllLead()}
              >
                <Icon
                  name="Export"
                  width={24}
                  height={24}
                  tooltip="Export"
                  alt="Export"
                />
              </div>
              {isCsvDownload && (
                <CSVLink
                  {...prepareCsvProps()}
                  ref={excelRef}
                  className="hiddenExcel"
                  target="_blank"
                ></CSVLink>
              )}
            </>
          )}
          <Button
            className="px-3 py-[5px]"
            style="dark-outline"
            tooltip="Import-Mapper"
            icon="Inbox"
            iconWidth={24}
            iconHeight={24}
            onClick={() => router.push("/manager-leads/import-mapper")}
          />
          <Button
            className="px-3 py-[5px]"
            style="dark-outline"
            tooltip="Import"
            icon="Import"
            iconWidth={24}
            iconHeight={24}
            onClick={() => router.push("/manager-leads/import")}
          />
          <Button
            className="px-3 py-[5px]"
            style="dark-outline"
            icon="Data2"
            iconWidth={24}
            iconHeight={24}
            onClick={() => router.push("/manager-leads/lead-distribution")}
          />
        </div>
      </div>
      <div
        className={`relative z-[1] flex flex-col mt-5 bg-white rounded-md drop-shadow-lg ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
          <span className="text-sm font-bold">Search</span>
          <Icon
            className="cursor-pointer"
            tooltip="Close"
            name="Close"
            width={20}
            height={20}
            alt="Close"
            onClick={onEmptySearch}
          />
        </div>
        <div className="px-5 pt-4 pb-8 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
          <InputSelect
            name="first_name"
            label="First Name"
            placeholder="Enter First Name"
            value={data.first_name.val}
            dropdownValue={data.first_name.dropdown}
            options={advanceSearchOptions}
            onChange={(e: any) => handleChnage("first_name", e.target.value)}
            onDropdownChange={(e: any) =>
              handleSelect("first_name", e.target.value)
            }
            isInfo
          />
          <InputSelect
            name="last_name"
            label="Last Name"
            placeholder="Enter Last Name"
            value={data.last_name.val}
            dropdownValue={data.last_name.dropdown}
            options={advanceSearchOptions}
            onChange={(e: any) => handleChnage("last_name", e.target.value)}
            onDropdownChange={(e: any) =>
              handleSelect("last_name", e.target.value)
            }
            isInfo
          />
          <InputSelect
            name="phone_number"
            label="Phone Number"
            placeholder="Enter Phone Number"
            value={data.phone_number.val}
            dropdownValue={data.phone_number.dropdown}
            options={advanceSearchOptions}
            onChange={(e: any) => handleChnage("phone_number", e.target.value)}
            onDropdownChange={(e: any) =>
              handleSelect("phone_number", e.target.value)
            }
            isInfo
          />
          <InputSelect
            name="phone_code"
            label="Phone Code"
            placeholder="Enter Phone Code"
            value={data.phone_code.val}
            dropdownValue={data.phone_code.dropdown}
            options={advanceSearchOptions}
            onChange={(e: any) => handleChnage("phone_code", e.target.value)}
            onDropdownChange={(e: any) =>
              handleSelect("phone_code", e.target.value)
            }
            isInfo
          />
          <Select
            name="user_uuid"
            label="User"
            placeholder="Select User"
            removable
            value={data.user_uuid.val}
            options={userOptions}
            onChange={(e: any) => handleChnage("user_uuid", e.target.value)}
            isInfo
          />
          <Select
            name="lead_group_uuid"
            label="Lead Group"
            placeholder="Select Lead Group"
            removable
            value={data.lead_group_uuid.val}
            options={leadGroupOptions}
            onChange={(e: any) =>
              handleChnage("lead_group_uuid", e.target.value)
            }
            isInfo
          />
          <Select
            name="lead_status"
            label="Lead Status"
            placeholder="Select Lead Status"
            removable
            value={data.lead_status.val}
            options={leadStatusOptions}
            onChange={(e: any) => handleChnage("lead_status", e.target.value)}
            isInfo
          />
        </div>
        <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
          <div className="flex gap-3 px-10">
            <Button
              className="px-3 py-2"
              text="Cancel"
              style="dark-outline"
              onClick={onEmptySearch}
            />
            <Button
              className="px-3 py-2"
              text="Search"
              style="primary"
              onClick={() => {
                setFilter({
                  ...filter,
                  page: 1,
                  limit: 10,
                  isAdvance: true,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`relative z-[1] flex flex-col mt-5 bg-white rounded-md drop-shadow-lg ${
          isBatchUpdate ? "" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
          <span className="text-sm font-bold">Batch Update</span>
          <Icon
            className="cursor-pointer"
            tooltip="Close"
            name="Close"
            width={20}
            height={20}
            alt="Close"
            onClick={() => setIsBatchUpdate(false)}
          />
        </div>
        <div className="px-5 pt-4 pb-8 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
          <Select
            name="user_uuid"
            label="User"
            placeholder="Select User"
            removable
            value={batchDetails.user_uuid}
            options={userOptions}
            onChange={(e: any) =>
              handleBatchChange("user_uuid", e.target.value)
            }
            isInfo
          />
          <Select
            name="lead_group_uuid"
            label="Lead Group"
            placeholder="Select Lead Group"
            removable
            value={batchDetails.lead_group_uuid}
            options={leadGroupOptions}
            onChange={(e: any) =>
              handleBatchChange("lead_group_uuid", e.target.value)
            }
            isInfo
          />
          <Select
            name="lead_status"
            label="Lead Status"
            placeholder="Select Lead Status"
            removable
            value={batchDetails.lead_status}
            options={leadStatusOptions}
            onChange={(e: any) =>
              handleBatchChange("lead_status", e.target.value)
            }
            isInfo
          />
        </div>
        <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
          <div className="flex gap-3 px-10">
            <Button
              className="px-3 py-2"
              text="Cancel"
              style="dark-outline"
              onClick={() => {
                setIsBatchUpdate(false);
                setBatchDetails(initialBatchValues);
              }}
            />
            <Button
              className={`${
                batchDetails?.user_uuid === "" &&
                batchDetails?.lead_status === "" &&
                batchDetails?.lead_group_uuid === "" &&
                "opacity-60"
              } px-3 py-2`}
              text="Batch Update"
              style="primary"
              disabled={
                batchDetails?.user_uuid === "" &&
                batchDetails?.lead_status === "" &&
                batchDetails?.lead_group_uuid === ""
              }
              onClick={() => {
                onUpdateBatch();
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Table
          isLoading={loading}
          title="Lead"
          managerName="lead-management"
          navigate="/manager-leads/create"
          columns={columns}
          data={lead?.data?.length ? lead.data : []}
          page={filter.page}
          totalCount={lead?.count || 0}
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
        {noteData ? (
          <Note
            noteData={noteData}
            setNoteData={setNoteData}
            leadUuid={leadUuid}
          />
        ) : infoData ? (
          <LeadInformation
            isLeadInfoID={infoData}
            setIsLeadInfoID={setInfoData}
            setNoteData={setNoteData}
          />
        ) : null}
      </div>
      <DeleteModal
        loading={loading}
        visible={!!deleteId}
        onCancelClick={() => setDeleteId("")}
        onDoneClick={() => onDeleteLead(deleteId)}
      />
    </>
  );
};

export default LeadManagement;
