import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// PROJECT IMPORT
import { useSipDevices } from "@/contexts/hooks/useSipDevices";
import { useSipOptions } from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { useIvrOptions } from "@/redux/slice/tenant-admin/ivrSlice";
import { useRingOptions } from "@/redux/slice/tenant-admin/ringSlice";
import { useTimeConditionOptions } from "@/redux/slice/tenant-admin/timeConditionSlice";
import { useConferenceOptions } from "@/redux/slice/tenant-admin/conferenceSlice";
import { useCallQueueOptions } from "@/redux/slice/tenant-admin/callQueueSlice";
import { useExternalUserOptions } from "@/redux/slice/tenant-admin/userSlice";
import { Input, LabelSwitch, Select } from "@/components/forms";
import { Icon } from "@/components/ui-components";

// OPTIONS IMPORT
import { routingTypeOptions2 } from "@/config/options";

// TYPES
interface AccordionProps {
    name: string;
    status: string;
    title: string;
}

const Accordion = ({ name, status, title }: AccordionProps) => {
    const { call_forward, onCallForwardChange, fillKeyData } = useSipDevices();
    const sipOptions: any = useSipOptions();
    const ivrOptions: any = useIvrOptions();
    const timeConditionOptions: any = useTimeConditionOptions();
    const callQueueOptions: any = useCallQueueOptions();
    const ringOptions: any = useRingOptions();
    const conferenceOptions: any = useConferenceOptions();
    const externalUserOptions: any = useExternalUserOptions();
    const [visible, setVisible] = useState(false);

    useLayoutEffect(() => {
        setVisible(call_forward[name][status] === 0);
    }, [call_forward]);

    const getTitle = () => {
        const selected = routingTypeOptions2.find(
            (val) => val?.value == call_forward[name]["routing_type"]
        );
        return selected?.label || "";
    };

    const getOptions = () => {
        switch (call_forward[name]["routing_type"]) {
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
            default:
                return [];
        }
    };

    const isSelected = call_forward[name][status] === 0;

    return (
        <div
            className={clsx(
                "flex items-center justify-between px-5 py-4 cursor-pointer transition-all duration-300 group",
                isSelected ? "bg-primary text-white border-l-4 border-primary-dark" : "bg-white"
            )}
        >
            <div className="flex items-center space-x-3">
                <Icon
                    name="Inbox"
                    className={clsx(
                        "transition-transform duration-300 w-5 h-5",
                        isSelected ? "text-white scale-110" : "text-gray-400 group-hover:text-primary"
                    )}
                />
                <span
                    className={clsx(
                        "text-sm font-semibold",
                        isSelected ? "text-white" : "text-gray-800 group-hover:text-primary"
                    )}
                >
                    {title}
                </span>
            </div>

            <div className="flex items-center space-x-4">
                <LabelSwitch
                    checked={isSelected}
                    onChange={() =>
                        onCallForwardChange(name, status, isSelected ? 1 : 0)
                    }
                />
                <Icon
                    name={visible ? "ArrowUp" : "ArrowDown"}
                    className={clsx(
                        "w-5 h-5 transition-transform duration-200 cursor-pointer",
                        visible ? "text-white" : "text-gray-500 hover:text-primary"
                    )}
                    onClick={() => setVisible(!visible)}
                />
            </div>
        </div>

    );
};

export default Accordion;
