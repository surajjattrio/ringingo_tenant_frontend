"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Head, Table } from "@/components/ui-components";
import { DatePicker } from "@/components/pickers";
import { Select } from "@/components/forms";
import { DeleteModal } from "@/components/modals";
import { followUpStatusOptions, followUpTypeOptions } from "@/config/options";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import {
  deleteFollowUp,
  getFollowUpList,
  searchFollowUpList,
  updateSingleFollowUpData,
  useFollowUpList,
} from "@/redux/slice/tenant-admin/followUpSlice";
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";

// THIRD-PARTY IMPORT
import { format } from "date-fns";
import { useDebouncedCallback } from "use-debounce";

// TYPES
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues = {
  date_time: {
    key: "date_time",
    val: "",
    dropdown: "1",
  },
  type: { key: "type|4", val: "" },
  is_readed: { key: "is_readed|4", val: "" },
  user_uuid: { key: "user_uuid|4", val: "" },
};

/* ============================== CDR REPORT TABLE ============================== */

const FollowUpTable = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const followUpList = useFollowUpList();
  const userOptions = useUserOptions();

  const [data, setData] = useState<any>(initialValues);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<any>("");
  const [isToday, setIsToday] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });

  // Fetching User Group Options
  const todayFollow = async () => {
    // alert("coming");
    try {
      if (isToday == true) {
        const params = { ...filter, today: true };
        setIsToday(false);
        await dispatch(getFollowUpList(params)).unwrap();
      } else {
        const params = { ...filter, today: false };
        setIsToday(true);
        await dispatch(getFollowUpList(params)).unwrap();
      }
      //await dispatch(followUpToday(params)).unwrap();
      setIsLoading(false);
    } catch (err) {
      console.log("Get CRD Report error ---->", err);
      setIsLoading(false);
    }
  };

  // GET CDR REPORT DETAILS
  const onGetFollowUps = useDebouncedCallback(async () => {
    try {
      setIsLoading(true);
      // const params = { ...filter };
      const params = { ...filter, today: false };
      console.log("FOLLOW UP");
      console.log(params);

      console.log("FOLLOW UP");
      console.log(params);
      delete params["isAdvance"];
      await dispatch(getFollowUpList(params)).unwrap();
      setIsLoading(false);
    } catch (error: any) {
      console.log("Get CRD Report error ---->", error?.message);
      setIsLoading(false);
    }
  }, 500);

  // Fetching User Options
  const onGetUserOptions = async () => {
    try {
      await dispatch(userOptionsGet());
    } catch (err) {
      console.error("Get User Options Err =-=>", err);
    }
  };

  useEffect(() => {
    onGetUserOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filter?.isAdvance) {
      onSearchData();
    } else {
      onGetFollowUps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // ADVANCE SEARCH - Trigger when left side Input or Select value change
  const handleChnage = (key: string, val: string) => {
    setData({
      ...data,
      [key]: { ...data[key], val: val },
    });
  };

  // // ADVANCE SEARCH - Trigger when right side Select value change
  // const handleSelect = (key: string, val: string) => {
  //     setData({
  //         ...data,
  //         [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
  //     });
  // };

  // ADVANCE SEARCH - Searching Data API call
  const onSearchData = async () => {
    if (
      !(
        data["date_time"]["val"] ||
        data["type"]["val"] ||
        data["is_readed"]["val"] ||
        data["user_uuid"]["val"]
      )
    ) {
      Danger(SEARCH_ERROR_MESSAGE);
      return false;
    }
    try {
      setIsLoading(true);
      let payload: any = {
        // [data["date_time"]["key"]]: data["date_time"]["val"]
        //     ? format(new Date(data["date_time"]["val"]), "yyyy-MM-dd HH:mm:ss")
        //     : "",
        [data["date_time"]["key"]]: data["date_time"]["val"]
          ? format(new Date(data["date_time"]["val"]), "yyyy-MM-dd")
          : "",
        [data["type"]["key"]]: data["type"]["val"],
        [data["is_readed"]["key"]]: data["is_readed"]["val"],
        [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
        // page: filter?.page,
        // limit: filter?.limit,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(searchFollowUpList(payload)).unwrap();
      setIsLoading(false);
    } catch (e: any) {
      console.error("Search data Err --->", e?.message);
      setIsLoading(false);
    }
  };

  // ADVANCE SEARCH Fields Empty & Fetching Conference Data
  const onEmptySearch = () => {
    setFilterOpen(false);
    setFilter({ ...filter, page: 1, limit: 10, isAdvance: false });
    setData(initialValues);
  };

  const onDeleteFollowUP = async (id: string) => {
    setIsLoading(true);
    try {
      await dispatch(deleteFollowUp(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === followUpList?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setIsLoading(false);
      setDeleteId("");
      Danger("");
      console.error("Delete FollowUp Delete Err --->", e?.message);
    }
  };

  const columns: ColumnsType[] = [
    {
      name: "date_time",
      title: "Follow Up Date",
      sortable: true,
    },
    {
      name: "fullName",
      title: "Lead Name",
      sortable: true,
    },
    {
      name: "PhoneNumber",
      title: "Lead Number",
      sortable: true,
    },
    {
      name: "userName",
      title: "User ID",
      sortable: true,
    },
    {
      name: "fullname",
      title: "Agent Name",
      sortable: true,
    },
    {
      name: "type",
      title: "Type",
      sortable: true,
    },
    {
      name: "status",
      title: "Status",
      sortable: true,
      action: (row: any) => {
        return (
          <label
            className={`${row?.is_readed === "1" ? "text-error" : "text-primary"
              }`}
          >
            {/* {row?.is_readed === "0" ? "Close" : "Open"} */}
            {row.followUpStatus}
          </label>
        );
      },
    },
    {
      name: "actions",
      title: "Actions",
    },
  ];

  // Mass Delete Click - Open Delete Modal
  const onMassDeleteFollowUp = () => {
    const selectedRows = [...selectedRow];
    setDeleteId(selectedRows.join(","));
  };

  const onEditClick = (data: any) => {
    try {
      dispatch(updateSingleFollowUpData(data));
      router.push(
        managerName
          ? "/manager-follow-up/" + data?.follow_up_uuid
          : "/tenant-follow-up/" + data?.follow_up_uuid
      );
    } catch (err) {
      console.error("Store Single follow up Err =-=>", err);
    }
  };

  return (

    <div className="bg-white p-5 rounded-[25px]">
      <Head
        name={name}
        managerName={managerName}
        length={followUpList?.count || 0}
        onChange={(e: any) =>
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            search: e.target.value,
            isAdvance: false,
          })
        }
        onDeleteClick={onMassDeleteFollowUp}
        onTodayClick={todayFollow}
        filterOpen={filterOpen}
        onHide={onEmptySearch}
        onSearchClick={() => {
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: true,
          });
        }}
      >
        <div className="md:px-2 sm:px-1 sm:pt-1 px-4 pt-3">
          <DatePicker
            name="date_time"
            label="Date"
            placeholder="Select date and time"
            dateFormat="yyyy-MM-dd HH:mm:ss"
            value={data.date_time.val}
            onChange={(e: any) => {
              handleChnage("date_time", e);
            }}
            timeIntervals={15}
            showTimeSelect
            isInfo
          />
        </div>
        <div className="md:px-2 sm:px-1 sm:pt-1 px-4 pt-3">
          <Select
            name="type"
            label="Types"
            placeholder="Select type"
            value={data.type.val}
            options={followUpTypeOptions}
            onChange={(e: any) => handleChnage("type", e.target.value)}
            isInfo
          />
        </div>
        <div className="md:px-2 sm:px-1 sm:pt-1 px-4 pt-3">
          <Select
            name="is_readed"
            label="Status"
            placeholder="Select status"
            value={data.is_readed.val}
            options={followUpStatusOptions}
            onChange={(e: any) => handleChnage("is_readed", e.target.value)}
            isInfo
          />
        </div>
        <div className="md:px-2 sm:px-1 sm:pt-1 px-4 pt-3">
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
        </div>
      </Head>

      <div className="mt-5">
        <Table
          name={name}
          managerName={managerName}
          isLoading={isLoading}
          columns={columns}
          data={followUpList?.data?.length ? followUpList.data : []}
          page={filter.page}
          totalCount={followUpList?.count || 0}
          limit={filter.limit}
          selectedRows={selectedRow}
          onSelectRow={(e: any, data: any, array: string[]) =>
            setSelectedRow(array)
          }
          onPageClick={(page: number) => {
            setFilter({
              ...filter,
              page,
            });
          }}
          onEditClick={onEditClick}
          onDeleteClick={(data: any) => setDeleteId(data?.follow_up_uuid)}
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
        loading={isLoading}
        visible={!!deleteId}
        onCancelClick={() => setDeleteId("")}
        onDoneClick={() => onDeleteFollowUP(deleteId)}
      />
    </div>
  );
};

export default FollowUpTable;
