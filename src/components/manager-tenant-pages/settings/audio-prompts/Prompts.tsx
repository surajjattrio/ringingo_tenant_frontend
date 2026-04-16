"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
  promptsDelete,
  promptsGet,
  promptsSearch,
  usePropmts,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import { AudioPlayer } from "@/components/players";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { PromptsFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
import { AnyARecord } from "dns";

// NAME STATE
const initialValues: PromptsFilterTypes = {
  name: { key: "name|1", val: "", dropdown: "1" },
};

const Prompts = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const prompts = usePropmts();

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
  const [editingRow, setEditingRow] = useState<any>(null);


  const columns: ColumnsType[] = [
    {
      name: "name",
      title: "Name",
      sortable: true,
    },
    {
      name: "",
      title: "Play/Download",
      action: (row: any) => {
        console.log(row);
        return (
          <>
            <AudioPlayer
              src={`greeting/download/${row?.file}`}
              name={`${row?.name}.wav`}
              index={row?.index}
            />
          </>
        );
      },
    },
    {
      showEdit: true,
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

  // Fetching Prompts Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(promptsGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Prompts Err =-=>", err);
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

  // Advance Search - Fetching Prompts Data
  const onSearchData = async () => {
    if (!data["name"]["val"]) {
      Danger(SEARCH_ERROR_MESSAGE);
      return false;
    }
    setLoading(true);
    try {
      const payload = {
        [data["name"]["key"]]: data["name"]["val"],
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(promptsSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching Prompts Data
  const onEmptySearch = () => {
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // Navigate to Create Prompts Page
  const onCreatePrompts = () =>
    router.push(
      managerName
        ? "/manager-audio-prompts/create"
        : "/tenant-audio-prompts/create"
    );

  // Deleting Selected Prompts & Fetching Prompts Data
  const onDeletePrompt = async (id: string) => {
    setLoading(true);
    try {
      await dispatch(promptsDelete(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === prompts?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      setDeleteId("");
      Danger("");
      console.error("Delete Prompt Err --->", e?.message);
    }
  };

  // Mass Delete Click - Open Delete Modal
  const onMassDeletePrompts = () => {
    const selectedRows = [...selectedRow];
    setDeleteId(selectedRows.join(","));
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
        name={name}
        managerName={managerName}
        length={prompts?.count || 0}
        search={filter?.search}
        createText="Create Audio Prompts"
        onCreateClick={onCreatePrompts}
        onDeleteClick={onMassDeletePrompts}
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
      </Head>

      <div className="mt-5">
        <Table
          isLoading={loading}
          title="Audio Prompts"
          name={name}
          managerName={managerName}
          navigate={
            managerName
              ? "/manager-audio-prompts/create"
              : "/tenant-audio-prompts/create"
          }
          columns={columns}
          data={prompts?.data?.length ? prompts.data : []}
          page={filter.page}
          totalCount={prompts?.count || 0}
          limit={filter.limit}
          selectedRows={selectedRow}
          onPageClick={(page: number) => {
            setFilter({
              ...filter,
              page,
            });
          }}
          onDeleteClick={(data: any) => setDeleteId(data.uuid)}
          onSelectRow={(e: any, data: any, array: string[]) =>
            setSelectedRow(array)
          }
          // onEditClick={(row: any) => {
          //   router.push(
          //     managerName
          //       ? `/manager-audio-prompts/create?row=${encodeURIComponent(JSON.stringify(row))}`
          //       : `/tenant-audio-prompts/create?row=${encodeURIComponent(JSON.stringify(row))}`
          //   );
          // }}
          onEditClick={(row: any) => {
            router.push(
              managerName
                ? `/manager-audio-prompts/edit/${row.uuid}`
                : `/tenant-audio-prompts/edit/${row.uuid}`
            );
          }}
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
        onDoneClick={() => onDeletePrompt(deleteId)}
      />
    </div>
  );
};

export default Prompts;
