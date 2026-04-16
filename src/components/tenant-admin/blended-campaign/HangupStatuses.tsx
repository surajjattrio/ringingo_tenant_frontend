import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    blendedHangupDelete,
    blendedSingleFeatureGet,
} from "@/redux/slice/tenant-admin/blendedSlice";
import { Success } from "@/redux/services/toasterServices";
import { setActiveTab } from "@/redux/slice/commonSlice";
import { Table } from "@/components/ui-components";
import { Button } from "@/components/forms";
import { DeleteModal } from "@/components/modals";

// TYPES IMPORT
import { ColumnsType } from "@/types/tableTypes";

const HangupStatuses = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { id } = useParams();
    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";
    const [tableData, setTableData] = useState<any>([]);
    const [deleteId, setDeleteId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Status Name",
        },
        {
            name: "code",
            title: "Code",
        },
        {
            name: "actions",
            title: "Actions",
            showEdit: false,
        },
    ];

    useEffect(() => {
        onGetHangupStatuses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Hangup Statuses Data
    const onGetHangupStatuses = async () => {
        setLoading(true);
        try {
            const params = {
                id,
                feature: "hangup-status",
            };
            const res: any = await dispatch(
                blendedSingleFeatureGet(params)
            ).unwrap();
            setTableData(res?.length ? res : []);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Hangup statuses Err =-=>", err);
        }
    };

    // Delete Selectd Row of Hangup Statuses
    const onDeleteHangupStatus = async (id: string) => {
        setLoading(true);
        try {
            dispatch(blendedHangupDelete(id)).unwrap();
            onGetHangupStatuses();
            setDeleteId("");
            Success("Successfully Deleted");
        } catch (err) {
            setLoading(false);
            console.error("Get Hangup statuses Err =-=>", err);
        }
    };

    return (
        <>
            <div className="py-3 space-y-5">
                <Button
                    className="px-3 py-2"
                    text="Add Hangup Statuses"
                    style="primary"
                    icon="PlusWhite"
                    responsive
                    onClick={() => {
                        router.push(isPathname ? "/manager-blended-campaign/hangup-status/" + id : "/tenant-blended-campaign/hangup-status/" + id);
                        dispatch(setActiveTab(3));
                    }}
                />
                <Table
                    isLoading={loading}
                    headerClassName="!bg-dark-800 !text-heading"
                    bodyClassName="!bg-dark-950"
                    columns={columns}
                    data={tableData?.length ? tableData : []}
                    selectable={false}
                    onDeleteClick={(data: any) =>
                        setDeleteId(data.blended_campaign_disposition_uuid)
                    }
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteHangupStatus(deleteId)}
            />
        </>
    );
};

export default HangupStatuses;
