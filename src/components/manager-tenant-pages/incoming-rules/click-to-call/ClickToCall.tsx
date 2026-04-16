"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
  clickToCallDelete,
  clickToCallGet,
  clickToCallSearch,
  clickToCallStatusUpdate,
  updateSingleClickToCall,
  useClickToCallData,
} from "@/redux/slice/tenant-admin/clickToCallSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch } from "@/components/forms";
import { Head, Icon, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: any = {
  name: { key: "name|1", val: "", dropdown: "1" },
};

const ClickToCall = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const clickToCall = useClickToCallData();

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
      name: "name",
      title: "Name",
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
              name="ForwardOutline"
              tooltip="Forwarding"
              width={25}
              height={25}
              onClick={() => {
                dispatch(updateSingleClickToCall(row));
                router.push(
                  managerName
                    ? "/manager-click-to-call/forwarding/" + row?.uuid
                    : "/tenant-click-to-call/forwarding/" + row?.uuid
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

  // Fetching tenant-click-to-call Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(clickToCallGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get tenant-click-to-call Err =-=>", err);
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
        [data["name"]["key"]]: data["name"]["val"],
        status,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(clickToCallSearch(payload)).unwrap();
    } catch (e: any) {
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching click-to-call Data
  const onEmptySearch = () => {
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // Navigate to Create click-to-call Page
  const onCreateClickToCall = () =>
    router.push(
      managerName
        ? "/manager-click-to-call/create"
        : "/tenant-click-to-call/create"
    );

  // Store Single tenant-click-to-call Data in Redux & Navigate to Update tenant-click-to-call Page
  const onEditClick = (data: any) => {
    try {
      dispatch(updateSingleClickToCall(data));
      router.push(
        managerName
          ? "/manager-click-to-call/" + data?.uuid
          : "/tenant-click-to-call/" + data?.uuid
      );
    } catch (err) {
      console.error("Store Single tenant-click-to-call Err =-=>", err);
    }
  };

  // Update tenant-click-to-call Status & Fetching tenant-click-to-call Data
  const onUpdateStatus = async (val: any) => {
    setLoading(true);
    try {
      const payload = {
        status: val.status === "1" ? "0" : "1",
        id: val.uuid,
      };
      const res: any = await dispatch(
        clickToCallStatusUpdate(payload)
      ).unwrap();
      if (res.statusCode === 200) {
        setFilter({ ...filter });
        Success(res.data);
      } else {
        Danger(res?.data);
      }
    } catch (e: any) {
      setLoading(false);
      console.error("Update tenant-click-to-call Status Err --->", e?.message);
    }
  };

  // Deleting Selected tenant-click-to-call & Fetching tenant-click-to-call Data
  const onDeleteClickToCall = async (id: string) => {
    setLoading(true);
    try {
      await dispatch(clickToCallDelete(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === clickToCall?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      console.error("Delete tenant-click-to-call Err --->", e?.message);
    }
  };

  // Mass Delete Click - Open Delete Modal
  const onMassDeleteClickToCall = () => {
    const selectedRows = [...selectedRow];
    setDeleteId(selectedRows.join(","));
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
        name={name}
        managerName={managerName}
        length={clickToCall?.count || 0}
        createText="Create Click To Call"
        onCreateClick={onCreateClickToCall}
        onDeleteClick={onMassDeleteClickToCall}
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
          title="Click To Call"
          name={name}
          managerName={managerName}
          navigate={
            managerName
              ? "/manager-click-to-call/create"
              : "/tenant-click-to-call/create"
          }
          columns={columns}
          data={clickToCall?.data?.length ? clickToCall.data : []}
          page={filter.page}
          totalCount={clickToCall?.count || 0}
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
          onUpdateStatus={onUpdateStatus}
          onRefresh={() => setFilter({ ...filter })}
        />
      </div>
      <DeleteModal
        loading={loading}
        visible={!!deleteId}
        onCancelClick={() => setDeleteId("")}
        onDoneClick={() => onDeleteClickToCall(deleteId)}
      />
    </div>
  );
};

export default ClickToCall;
