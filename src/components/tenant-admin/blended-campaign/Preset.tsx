import {  useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

// PROJECT IMPORT
import { useFormik } from "formik";
import { useAppDispatch } from "@/redux/hooks";
import {
    updateSingleBlendedData,
    blendedPresetDelete,
    blendedPresetGet,
    blendedPresetUpdate,
    blendedPresetSingleGet,
} from "@/redux/slice/tenant-admin/blendedSlice";
import { Success } from "@/redux/services/toasterServices";
import { setActiveTab } from "@/redux/slice/commonSlice";
import { Table } from "@/components/ui-components";
import { Button } from "@/components/forms";
import { DeleteModal } from "@/components/modals";

// TYPES IMPORT
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

const Preset = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
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
            title: "Name",
        },
        {
            name: "number",
            title: "Number",
        },
        {
            name: "hide_number",
            title: "Hide Number",
            sortable: true,
            action: (row: any) => {
                return (
                    <>
                      {row?.hide_number =="0" ? "Yes" : "No" }
                    </>
                  );
            }    

        },
        {
            name: "actions",
            title: "Actions",
           // showEdit: true,
        },
    ];

 

    useEffect(() => {
        onGetPreset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Preset Data
    // const onGetPreset = async () => {
    //     alert('ok');
    //     setLoading(true);
    //     try {
    //         const params = {
    //             id,
    //             feature: "preset",
    //         };
    //         const res: any = await dispatch(
    //             outboundPresetGet(params)
    //         ).unwrap();
    //         console.log('res',res);
    //         setTableData(res?.length ? res : []);
    //         setLoading(false);
    //     } catch (err) {
    //         setLoading(false);
    //         console.error("Get Preset Err =-=>", err);
    //     }
    // };

// Fetching Preset Data
const onGetPreset = async () => {
    setLoading(true);
    try {
        const params = {
            id,
            feature: "preset",
        };
        const response: any = await dispatch(blendedPresetGet(params)).unwrap();
        console.log('response', response);
        
        if (response?.statusCode === 200) {
            // Check if 'data' exists in the response and is an array
            const responseData = response?.data || [];
            setTableData(responseData);
        } else {
            // Handle error or empty response
           // console.error("Get Preset Err =-=>", err);
            setTableData([]); 
        }

        setLoading(false);
    } catch (err) {
        setLoading(false);
        console.error("Get Preset Err =-=>", err);
    }
};


      // Store Single Dnc Data in Redux & Navigate to Update Dnc Page
      const onEditClick = (data: any) => {
        try {
            dispatch(blendedPresetSingleGet(data.uuid));
           router.push(
               isPathname ? "/manager-blended-campaign/preset/edit/" + data?.uuid : "/tenant-blended-campaign/preset/edit/" + data?.uuid
           );
        } catch (err) {
            console.error("Store Single Dnc Err =-=>", err);
        }
    };


    // Delete Selectd Row of Hangup Statuses
    const onDeletePreset = async (id: string) => {
        setLoading(true);
        try {
            const response: any = await dispatch(blendedPresetDelete(id)).unwrap();
            if (response?.statusCode === 200) {
                const updatedTableData = tableData.filter((preset: any) => preset.id !== id);
                setTableData(updatedTableData);
                setDeleteId("");
                Success("Successfully Deleted");
                // resetForm();
                // router.back();
            } else {
                console.error("Delete Preset Error:", response?.error);
            }
        } catch (err) {
            console.error("Delete Preset Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="py-3 space-y-5">
                <Button
                    className="px-3 py-2"
                    text="Add Preset"
                    style="primary"
                    icon="PlusWhite"
                    responsive
                    onClick={() => {
                        router.push(isPathname ? "/manager-blended-campaign/preset/" + id : "/tenant-blended-campaign/preset/" + id);
                        dispatch(setActiveTab(4));
                    }}
                />
                <Table
                    isLoading={loading}
                    headerClassName="!bg-dark-800 !text-heading"
                    bodyClassName="!bg-dark-950"
                    columns={columns}
                    data={tableData?.length ? tableData : []}
                    selectable={false}
                    onEditClick={onEditClick}
                    onDeleteClick={(data: any) =>
                        setDeleteId(data.uuid)
                    }
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeletePreset(deleteId)}
            />
        </>
    );
};

export default Preset;
