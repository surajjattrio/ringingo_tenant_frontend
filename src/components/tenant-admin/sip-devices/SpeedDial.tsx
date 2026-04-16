import { useSipDevices } from "@/contexts/hooks/useSipDevices";
import { useSipOptions } from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { Input, Select } from "@/components/forms";
import { useIvrOptions } from "@/redux/slice/tenant-admin/ivrSlice";
import { useTimeConditionOptions } from "@/redux/slice/tenant-admin/timeConditionSlice";
import { useCallQueueOptions } from "@/redux/slice/tenant-admin/callQueueSlice";
import { useRingOptions } from "@/redux/slice/tenant-admin/ringSlice";
import { useConferenceOptions } from "@/redux/slice/tenant-admin/conferenceSlice";

// OPTIONS IMPORT
import { routingTypeOptions2 } from "@/config/options";
import { useExternalUserOptions } from "@/redux/slice/tenant-admin/userSlice";

const SpeedDial = () => {
    const { speed_dial, onSpeedDialChange, fillKeyData } = useSipDevices();
    const sipOptions: any = useSipOptions();
    const ivrOptions: any = useIvrOptions();
    const timeConditionOptions: any = useTimeConditionOptions();
    const callQueueOptions: any = useCallQueueOptions();
    const ringOptions: any = useRingOptions();
    const conferenceOptions: any = useConferenceOptions();
    const externalUserOptions: any = useExternalUserOptions();

    // Set Options in Fail-Over Routing Options
    const getOptions = (type: string) => {
        switch (type) {
            case "1":
                return sipOptions;
            case "2":
                return ivrOptions;
            case "3":
                return timeConditionOptions;
            case "4":
                return conferenceOptions;
            case "5":
                return callQueueOptions;
            case "6":
                return ringOptions;
            case "7":
                return sipOptions;
            case "9":
                return externalUserOptions;
        }
    };
    return (
        <>
            <div className="grid grid-cols-7 gap-14 border-b py-4 items-center">
                <span className="col-span-1 font-semibold text-heading text-xs">
                    Digit
                </span>
                <span className="col-span-3 font-semibold text-heading text-xs">
                    Routes
                </span>
                <span className="col-span-3 font-semibold text-heading text-xs">
                    Destination
                </span>
            </div>
            {speed_dial?.map((val: any, idx: number) => {
                return (
                    <>
                        <div className="grid grid-cols-7 gap-14 items-center border-b py-4">
                            <div>
                                <div className="col-span-1 flex bg-secondary-v10 rounded-full w-10 h-10 items-center justify-center">
                                    <span className="font-normal text-xs text-heading">
                                        {idx}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <Select
                                    name="routing_type"
                                    isShowLabel={false}
                                    options={routingTypeOptions2}
                                    value={val?.routing_type}
                                    onChange={(e: any) => {
                                        const newData = [...speed_dial];
                                        newData[idx] = {
                                            ...newData[idx],
                                            routing_type: e.target.value,
                                            routing_value: "",
                                        };
                                        fillKeyData("speed_dial", newData);
                                    }}
                                />
                            </div>
                            <div className="col-span-3">
                                {val?.routing_type === "8" ? (
                                    <Input
                                        name="routing_value"
                                        value={val?.routing_value}
                                        isShowLabel={false}
                                        placeholder="Enter PSTN"
                                        onChange={(e: any) => {
                                            onSpeedDialChange("routing_value", e.target.value, idx);
                                        }}
                                    />
                                ) : (
                                    <Select
                                        name="routing_value"
                                        placeholder="Select"
                                        removable
                                        options={getOptions(val?.routing_type) || []}
                                        isShowLabel={false}
                                        value={val?.routing_value}
                                        onChange={(e: any) => {
                                            onSpeedDialChange("routing_value", e.target.value, idx);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                );
            })}
        </>
    );
};

export default SpeedDial;
