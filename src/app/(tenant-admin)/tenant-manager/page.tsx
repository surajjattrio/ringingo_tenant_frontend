"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
  useIsLoading,
  useManager,
  managerGet,
  managerSearch,
  updateSingleManagerData,
  managerStatusUpdate,
  managerDelete,
} from "@/redux/slice/tenant-admin/managerSlice";

//import {useManagerRoleOptions,managerRoleOptionsGet} from "@/redux/slice/tenant-admin/managerRoleSlice";
import {
  rolesOptionsGet,
  useRolesOptions,
} from "@/redux/slice/tenant-admin/managerRoleSlice";
import LeadInformation from "@/components/tenant-admin/lead-management/LeadInformation";

import {
  useSipOptions,
  sipOptionsGet,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { advanceSearchOptions } from "@/config/options";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Table ,Icon,Filter} from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import Note from "@/components/tenant-admin/lead-management/Note";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { ManagerFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// NAME STATE
const initialValues: ManagerFilterTypes = {
  first_name: { key: "first_name|1", val: "", dropdown: "1" },
  last_name: { key: "last_name|1", val: "", dropdown: "1" },
  username: { key: "username|1", val: "", dropdown: "1" },
  email: { key: "email|1", val: "", dropdown: "1" },
  status: { key: "status|4", val: "", dropdown: "4" },
  manager_role_uuid: { key: "manager_role_uuid|4", val: "", dropdown: "4" },
  extension_uuid: { key: "extension_uuid|4", val: "", dropdown: "4" },
};

const Manager = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const manager = useManager();
  const [noteData, setNoteData] = useState<any>(null);
  const [leadUuid, setLeadUuid] = useState<any>(null);

  const sipOptions = useSipOptions();
  const managerRoleOptions = useRolesOptions();
  const [infoData, setInfoData] = useState<any>(null);


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
      name: "username",
      title: "User Name",
      sortable: true,
    },
    {
      name: "email",
      title: "Email",
      sortable: true,
    },
    {
      name: "status",
      title: "Status",
      action: (row: any) => {
        return (
          <>
            <Toggle
              loading={loading}
              checked={row.status === "0"}
              onChange={() => {
                onUpdateManagerStatus(row);
              }}
            />
          </>
        );
      },
    },
    {
      name: "role_name",
      title: "Manager Role",
      sortable: true,
    },
    {
      name: "sipname",
      title: "SIP Device",
      sortable: true,
    },
    // {
    //   name: "actions",
    //   title: "Actions",
    // },

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
              <Icon
                tooltip="Edit"
                name="Edit"
                width={20}
                height={20}
                alt="Edit"
                onClick={() => onEditClick(row)}
              />
              <Icon
                tooltip="Delete"
                name="DeleteRed"
                width={20}
                height={20}
                alt="Delete"
                onClick={() => setDeleteId(row.uuid)}
              />
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
    onGetSipOptions();
    onGetManagerRoleOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching Sip Devices Options
  const onGetSipOptions = async () => {
    try {
      await dispatch(sipOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get SIP Devices Options Err =-=>", err);
    }
  };

  // Fetching Manager Role Options
  const onGetManagerRoleOptions = async () => {
    try {
      await dispatch(rolesOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Manager Role Options Err =-=>", err);
    }
  };

  // Fetching Managers Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(managerGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Manager Err =-=>", err);
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

  // Advance Search - Searching Data API call
  const onSearchData = async () => {
    try {
      const payload = {
        [data["first_name"]["key"]]: data["first_name"]["val"],
        [data["last_name"]["key"]]: data["last_name"]["val"],
        [data["username"]["key"]]: data["username"]["val"],
        [data["email"]["key"]]: data["email"]["val"],
        [data["manager_role_uuid"]["key"]]: data["manager_role_uuid"]["val"],
        [data["extension_uuid"]["key"]]: data["extension_uuid"]["val"],
        status,
      };

      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(managerSearch(payload)).unwrap();
    } catch (e: any) {
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching Manager Data
  const onEmptySearch = () => {
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // Navigate to Create Manager Page
  const onCreateManager = () => router.push("/tenant-manager/create");

  // Store Single Manager Data in Redux & Navigate to Update Manager Page
  const onEditClick = (data: any) => {
    try {
      // dispatch(updateSingleManagerData(data));
      router.push("/tenant-manager/" + data?.uuid);
    } catch (err) {
      console.error("Store Single Manager Err =-=>", err);
    }
  };

  // Update Manager Status & Fetching Manager Data
  const onUpdateManagerStatus = async (val: any) => {
    setLoading(true);
    try {
      const payload = {
        status: val.status === "1" ? "0" : "1",
        id: val.uuid,
      };
      const res: any = await dispatch(managerStatusUpdate(payload)).unwrap();
      if (res.statusCode === 200) {
        setFilter({ ...filter });
        Success(res.data);
      } else {
        Danger(res?.data);
      }
    } catch (e: any) {
      setLoading(false);
      console.error("Update Manager Status Err --->", e?.message);
    }
  };

  // Deleting Selected Manager & Fetching Manager Data
  const onDeleteManager = async (id: string) => {
    setLoading(true);
    try {
      await dispatch(managerDelete(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === manager?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      console.error("Delete Manager Err --->", e?.message);
    }
  };

  // Mass Delete Click - Open Delete Modal
  const onMassDeleteManager = () => {
    const selectedRows = [...selectedRow];
    setDeleteId(selectedRows.join(","));
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
        name="manager"
        length={manager?.count || 0}
        createText="Create Manager"
        onCreateClick={onCreateManager}
        onDeleteClick={onMassDeleteManager}
        onChange={(e: any) =>
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
            search: e.target.value,
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
          name="username"
          label="User Name"
          placeholder="Enter User Name"
          value={data.username.val}
          dropdownValue={data.username.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("username", e.target.value)}
          onDropdownChange={(e: any) =>
            handleSelect("username", e.target.value)
          }
          isInfo
        />

        <InputSelect
          name="email"
          label="Email"
          placeholder="Enter Email"
          value={data.email.val}
          dropdownValue={data.email.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("email", e.target.value)}
          onDropdownChange={(e: any) => handleSelect("email", e.target.value)}
          isInfo
        />

        <Select
          name="manager_role_uuid"
          label="Manager Role"
          placeholder="Select Manager Role"
          removable
          options={managerRoleOptions}
          value={data.manager_role_uuid.val}
          onChange={(e: any) =>
            handleChnage("manager_role_uuid", e.target.value)
          }
          isInfo
        />

        <Select
          name="extension_uuid"
          label="SIP Device"
          placeholder="Select SIP Device"
          removable
          options={sipOptions}
          value={data.extension_uuid.val}
          onChange={(e: any) => handleChnage("extension_uuid", e.target.value)}
          isInfo
        />

        <Switch
          className="pt-[2px]"
          label="Status"
          value={status}
          onClick={(value: string) => setStatus(value)}
        />
      </Head>

      <div className="mt-5">
        <Table
          isLoading={loading}
          title="Manager"
          name="manager"
          navigate="/tenant-manager/create"
          columns={columns}
          data={manager?.data?.length ? manager.data : []}
          page={filter.page}
          totalCount={manager?.count || 0}
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
              limit,
            });
          }}
          //  onUpdateManagerStatus={onUpdateManagerStatus}
          onRefresh={() => setFilter({ ...filter })}
        />
      </div>
      <div className="col-span-1">
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
        onDoneClick={() => onDeleteManager(deleteId)}
      />
    </div>
  );
};

export default Manager;
