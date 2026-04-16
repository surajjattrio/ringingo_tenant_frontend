"use client";
import React, { useLayoutEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

// PROJECT IMPORT
import {
  leadGroupVoiceBroadcastGet,
  voiceBroadcastLeadGroupDelete,
  voiceBroadcastLeadReset,
} from "@/redux/slice/tenant-admin/voiceBroadcastSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setActiveTab } from "@/redux/slice/commonSlice";
import { Icon, Table } from "@/components/ui-components";
import { Danger, Success } from "@/redux/services/toasterServices";
import { DeleteModal } from "@/components/modals";
import { Button } from "@/components/forms";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { leadGroupStatusRemove, leadGroupStatusUpdate } from "@/redux/slice/tenant-admin/leadGroupSlice";

const LeadGroup = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  let isPathname = pathname?.split("-")?.[0] === "/manager";
  const [loading, setLoading] = useState<boolean>(true);
  const [leadData, setLeadData] = useState<any>({});
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
  });
  const [deleteId, setDeleteId] = useState<any>("");

  const onDeleteLeadGroup = async (val: any) => {
    setLoading(true);
    try {
      const payload = {
        lead_group_uuid: deleteId,
        campaign_uuid: id,
      };
      await dispatch(voiceBroadcastLeadGroupDelete(payload)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === leadData?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      console.error("Delete lead group Err --->", e?.message);
    }
  };

  const columns: ColumnsType[] = [
    {
      name: "name",
      title: "Lead Group",
    },
    {
      name: "hopperCount",
      title: "Dialing Lead Count",
    },
    {
      name: "queueCount",
      title: "Queue Lead Count",
    },
    {
      name: "totalCount",
      title: "Total Lead Count",
    },
    {
      name: "status",
      title: "Status",
    },
    {
      name: "actions",
      title: "Actions",
      action: (row: any) => (
        <div className="flex gap-4 items-center select-none">
          <div
            className={`${row?.status === "1" ? "opacity-60 pointer-events-none" : ""
              }`}
          >
            <Icon
              alt="Refresh"
              name="Refresh"
              width={15}
              height={15}
              onClick={() => onReset(row)}
            />
          </div>
          <div
            className={`${row?.status === "1" ? "opacity-60 pointer-events-none" : ""
              }`}
          >
            <Icon
              name="Inbox"
              height={15}
              width={15}
              tooltip="Import Mapper"
              onClick={() => {
                router.push(
                  isPathname
                    ? "/manager-voice-broadcast/import-mapper/" +
                    row?.uuid +
                    `/${id}`
                    : "/tenant-voice-broadcast/import-mapper/" +
                    row?.uuid +
                    `/${id}`
                );
                dispatch(setActiveTab(1));
              }}
            />
          </div>
          <Icon
            tooltip="Delete"
            name="DeleteRed"
            width={15}
            height={15}
            alt="Delete"
            onClick={() => setDeleteId(row?.uuid)}
          />
        </div>
      ),
    },
  ];

  useLayoutEffect(() => {
    if (!id) return;
    onGetLeadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, filter]);

  // Fetching Single Lead Group Data
  const onGetLeadGroup = async () => {
    setLoading(true);
    try {
      const params = { ...filter, id };
      const res = await dispatch(leadGroupVoiceBroadcastGet(params)).unwrap();
      if (res?.data) {
        let data: any = res;
        data?.data?.length &&
          data.data?.sort((a: any, b: any) =>
            a["name"]?.toLowerCase() < b["name"]?.toLowerCase() ? -1 : 1
          );
        setLeadData(res || {});
        // console.log("data is ------>", res.data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Single Lead Group Data Err =-=>", err);
    }
  };

  const onReset = async (val: any) => {
    setLoading(true);
    try {
      const payload = {
        voice_broadcast_uuid: id,
        lead_group_uuid: val?.uuid,
      };
      const res: any = await dispatch(
        voiceBroadcastLeadReset(payload)
      ).unwrap();
      if (res?.statusCode === 200) {
        Success(res.data);
        onGetLeadGroup();
      } else {
        Danger(res?.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Reset Lead Group Err =-=>", err);
    }
  };

  // REMOVE LEAD
  const onRemoveLeadGroupStatus = async (data: any) => {
    try {
      const payload = {
        campaign_uuid: id,
        lead_group_uuid: data?.uuid,
      };
      const res: any = await dispatch(leadGroupStatusRemove(payload)).unwrap();
      if (res?.statusCode === 200) {
        Success(res?.data);
        onGetLeadGroup();
      } else {
        Danger(res?.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Remove Lead Group Status Err =-=>", err);
    }
  };

  // Update Lead Group Status & Fetching Lead Group Data
  const onUpdateLeadGroupStatus = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        id: data?.uuid,
        status: data?.status === "0" ? "1" : "0",
      };
      const res: any = await dispatch(leadGroupStatusUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        Success(res?.data);
        data?.status === "0" ? onRemoveLeadGroupStatus(data) : onReset(data);
        onGetLeadGroup();
      } else {
        Danger(res?.data);
      }
    } catch (err) {
      setLoading(false);
      console.error("Update Lead Group Status Err =-=>", err);
    }
  };

  return (
    <>
      <div className="py-5">
        <div className="pb-3 grid grid-cols-2 tsm:grid-cols-1">
          <div className="flex items-end gap-4 mb-4">
            <Button
              className="px-3 py-2"
              text="Create Lead group"
              style="primary"
              icon="PlusWhite"
              responsive
              onClick={() => {
                router.push(
                  isPathname
                    ? "/manager-voice-broadcast/create-lead-group/" + id
                    : "/tenant-voice-broadcast/create-lead-group/" + id
                );
                dispatch(setActiveTab(1));
              }}
            />
          </div>
        </div>
        <Table
          headerClassName="!bg-dark-800 !text-heading"
          bodyClassName="!bg-dark-950"
          isLoading={loading}
          columns={columns}
          data={leadData?.data?.length ? leadData.data : []}
          page={filter.page}
          totalCount={leadData?.count || 0}
          limit={filter.limit}
          selectable={false}
          onUpdateStatus={onUpdateLeadGroupStatus}
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
          onRefresh={() => setFilter({ ...filter })}
        />
      </div>
      <DeleteModal
        loading={loading}
        visible={!!deleteId}
        onCancelClick={() => setDeleteId("")}
        onDoneClick={() => onDeleteLeadGroup(deleteId)}
      />
    </>
  );
};

export default LeadGroup;
