"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

// PROJECT IMPORT
import {
  campaignLeadGroupDelete,
  outboundLeadReset,
  outboundLeadResetStatusGet,
  outboundSingleFeatureGet,
} from "@/redux/slice/tenant-admin/outboundSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setActiveTab } from "@/redux/slice/commonSlice";
import { Icon, Table } from "@/components/ui-components";
import { Danger, Success } from "@/redux/services/toasterServices";
import { DeleteModal } from "@/components/modals";
import { Button } from "@/components/forms";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import {
  leadGroupStatusRemove,
  leadGroupStatusUpdate,
} from "@/redux/slice/tenant-admin/leadGroupSlice";

const LeadGroup = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cookie = Cookies.get("user");
  const userData = JSON.parse(cookie || "{}");
  const { tenant_uuid } = userData;

  const pathname = usePathname();
  let isPathname = pathname?.split("-")?.[0] === "/manager";
  const [loading, setLoading] = useState<boolean>(true);
  const [leadData, setLeadData] = useState<any>({});
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
  });
  const [deleteId, setDeleteId] = useState<any>("");
  // lead_group_uuids with an in-flight async reset job — drives the per-row
  // spinner/disabled state on the rechurn (Refresh) icon while it's queued.
  const [processingLeadGroups, setProcessingLeadGroups] = useState<Set<string>>(new Set());
  const activePollTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Stop any in-flight lead-reset-job polling when this page unmounts.
  useEffect(() => {
    return () => {
      activePollTimeouts.current.forEach((t) => clearTimeout(t));
      activePollTimeouts.current.clear();
    };
  }, []);

  const onDeleteLeadGroup = async (val: any) => {
    setLoading(true);
    try {
      const payload = {
        lead_group_uuid: deleteId,
        campaign_uuid: id,
      };
      await dispatch(campaignLeadGroupDelete(payload)).unwrap();
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
      action: (row: any) => {
        // Read from the row itself, not processingLeadGroups directly — the
        // shared Table component snapshots `columns` (and this `action`
        // closure with it) once on its own first mount and never re-syncs
        // it, so any state this closure captured directly would be frozen
        // at that point. `row` stays fresh because Table DOES re-sync
        // `tableData` from the `data` prop on every render, so the flag is
        // threaded through there instead (see the `data` prop below).
        const isRechurning = !!row?.isRechurning;
        return (
        <div className="flex gap-4 items-center select-none">
          <div
            title={isRechurning ? "Processing…" : undefined}
            className={`${row?.status === "1" || isRechurning ? "opacity-60 pointer-events-none" : ""
              }`}
          >
            <Icon
              alt="Refresh"
              name="Refresh"
              width={15}
              height={15}
              className={isRechurning ? "animate-spin" : ""}
              onClick={isRechurning ? undefined : () => onReset(row)}
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
                    ? "/manager-outbound-campaign/import-mapper/" +
                    row?.uuid +
                    `/${id}`
                    : "/tenant-outbound-campaign/import-mapper/" +
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
        );
      },
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
      const params = {
        feature: "lead",
        id,
        ...filter,
      };
      const res: any = await dispatch(
        outboundSingleFeatureGet(params)
      ).unwrap();
      if (res?.data) {
        /*let data: any = res;
        data?.data?.length &&
          data.data?.sort((a: any, b: any) =>
            a["name"]?.toLowerCase() < b["name"]?.toLowerCase() ? -1 : 1
          );
        setLeadData(data || {});*/
	setLeadData(res || {});
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Single Lead Group Data Err =-=>", err);
    }
  };

  const stopProcessing = (leadGroupUuid: string) => {
    setProcessingLeadGroups((prev) => {
      if (!prev.has(leadGroupUuid)) return prev;
      const next = new Set(prev);
      next.delete(leadGroupUuid);
      return next;
    });
  };

  // Polls GET /outbound-campaign/lead-reset-status until the async reset job
  // (job_uuid returned by outboundLeadReset when the backend has
  // ENABLE_LEAD_RECHURN_MICROSERVICE=true) reaches a terminal state. Not
  // reached for the synchronous fallback, which never returns a job_uuid.
  const pollLeadResetJob = (jobUuid: string, leadGroupUuid: string) => {
    const POLL_INTERVAL_MS = 3000;
    const MAX_ATTEMPTS = 100; // ~5 minutes at 3s per attempt

    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const res: any = await dispatch(
          outboundLeadResetStatusGet({ job_uuid: jobUuid, tenant_uuid })
        ).unwrap();
        const job = res?.data ?? res;

        if (job?.status === "completed") {
          Success("Lead reset completed");
          stopProcessing(leadGroupUuid);
          onGetLeadGroup();
          return;
        }
        if (job?.status === "failed") {
          Danger(job?.error_message || "Lead reset failed");
          stopProcessing(leadGroupUuid);
          return;
        }
        // status is "pending"/"inprogress" — keep polling below.
      } catch {
        // Transient network/poll failure — keep retrying until MAX_ATTEMPTS.
      }

      if (attempts >= MAX_ATTEMPTS) {
        Danger("Lead reset is taking longer than expected — refresh later to check its status");
        stopProcessing(leadGroupUuid);
        return;
      }

      const timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      activePollTimeouts.current.add(timeoutId);
    };

    poll();
  };

  const onReset = async (val: any) => {
    setLoading(true);
    try {
      const payload = {
        campaign_uuid: id,
        lead_group_uuid: val?.uuid,
      };
      const res: any = await dispatch(outboundLeadReset(payload)).unwrap();

      if (res?.job_uuid) {
        // Async path: the job is queued, not done yet — don't report success
        // as if it already finished, and don't block the whole table on it;
        // just keep this row's rechurn button spinning/disabled instead.
        setLoading(false);
        setProcessingLeadGroups((prev) => new Set(prev).add(val?.uuid));
        Success("Lead reset queued — processing started");
        pollLeadResetJob(res.job_uuid, val?.uuid);
        return;
      }

      if (res?.statusCode === 200) {
        Success(res.data);
        onGetLeadGroup();
      } else {
        Danger(res?.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Rseet Lead Group Err =-=>", err);
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
      } else {
        Danger(res?.data);
        setLoading(false);
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
                router.push(isPathname ? "/manager-outbound-campaign/create-lead-group/" + id : "/tenant-outbound-campaign/create-lead-group/" + id
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
          data={
            leadData?.data?.length
              ? leadData.data.map((row: any) => ({
                  ...row,
                  isRechurning: processingLeadGroups.has(row?.uuid),
                }))
              : []
          }
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
