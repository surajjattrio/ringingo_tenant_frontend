"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    featureCodeGet,
    updateSingleFeatureCode,
    useFeatureCode,
} from "@/redux/slice/tenant-admin/featureCodeSlice";
import { Icon, Loader } from "@/components/ui-components";
import { ManagerPageTypes } from "@/types/formTypes";

const FeatureCode = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const featureCodeData = useFeatureCode();

    const [loading, setLoading] = useState<boolean>(true);

    useLayoutEffect(() => {
        onGetFeatureCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Feature Code Data
    const onGetFeatureCode = async () => {
        setLoading(true);
        try {
            await dispatch(featureCodeGet()).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Feature Code Err =-=>", err);
        }
    };

    // Store Single Feature Code Data in Redux & Navigate to Edit Feature Code Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleFeatureCode(data));
            router.push(
                managerName
                    ? "/manager-feature-code/" + data?.uuid
                    : "/tenant-feature-code/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Feature Code Err =-=>", err);
        }
    };

    if (!featureCodeData?.length || loading) {
        return (
            <>
                <div className="w-full bg-white rounded-md flex items-center justify-center h-[calc(100vh-118px)] tsm:h-[calc(100vh-178px)]">
                    {loading ? (
                        <Loader background="transparent" />
                    ) : (
                        <div className="fixed w-[100%] h-[100%] flex-col items-center justify-center py-10">
                            <div className="w-full flex items-center justify-center h-[60%]">
                                <Icon
                                    name="SearchImage"
                                    className="h-[70%] w-[70%]"
                                    alt="No Data Found"
                                />
                            </div>
                            <div className="w-full flex flex-col gap-1 items-center justify-center">
                                <span className="font-bold text-sm text-heading">
                                    No data found?
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            {featureCodeData?.length && (
                <div className="bg-white rounded-md w-full p-5 grid grid-cols-5 gap-3 h-[calc(100vh-118px)] tsm:h-[calc(100vh-178px)]">
                    {featureCodeData?.map((val: any) => {
                        return (
                            <>
                                <div className="bg-white shadow-md border border-dark-800 rounded-md relative flex flex-col justify-center items-center whitespace-nowrap overflow-hidden px-3 py-3">
                                    <Icon
                                        className="absolute top-2 right-2"
                                        name="Edit"
                                        width={15}
                                        height={15}
                                        alt="Edit"
                                        onClick={() => onEditClick(val)}
                                    />
                                    <div className="bg-secondary-v10 rounded-full p-2 mb-3 text-heading font-bold text-sm">
                                        <span>{val?.feature_code}</span>
                                    </div>
                                    <span className="text-txt-primary font-bold text-sm mb-1">
                                        {val?.name}
                                    </span>
                                    <span className="text-txt-secondary font-normal text-xs">
                                        {val?.description}
                                    </span>
                                </div>
                            </>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default FeatureCode;
