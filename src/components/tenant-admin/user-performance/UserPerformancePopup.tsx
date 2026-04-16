import { CheckBox } from "@/components/forms";
import { Popup } from "@/components/ui-components";
import { useState } from "react";

interface UserPerformancePopupProps {
    visible: boolean;
    onToggle: () => void;
}

const staticPopupData = [
    {
        id: "1",
        title: "User",
        checked: false,
    },
    {
        id: "2",
        title: "Inbound call",
        checked: false,
    },
    {
        id: "3",
        title: "Outbound calls",
        checked: false,
    },
    {
        id: "4",
        title: "ACD",
        checked: false,
    },
    {
        id: "5",
        title: "Login Hours",
        checked: false,
    },
    {
        id: "6",
        title: "Idle Time",
        checked: false,
    },
    {
        id: "7",
        title: "Talk time",
        checked: false,
    },
    {
        id: "8",
        title: "Break time",
        checked: false,
    },
    {
        id: "9",
        title: "ACW",
        checked: false,
    },
    {
        id: "10",
        title: "Break Info",
        checked: false,
    },
];

const UserPerformancePopup = (props: UserPerformancePopupProps) => {
    const { visible, onToggle } = props;
    const [popupData, setPopupData] = useState<any[]>(staticPopupData);

    return (
        <Popup
            className="top-[120px] right-8 !rounded-md !w-[200px]"
            visible={visible}
            togglePopup={onToggle}
        >
            <div className="flex justify-between items-center px-2 py-3 border-b-2 shadow-lg">
                <span className="font-bold text-xs">Select Columns</span>
                <span className="text-[10px] text-txt-primary">Up to 5</span>
            </div>
            <div className="py-2 relative max-h-[240px] overflow-scroll">
                {popupData?.map((val: any, index: number) => {
                    return (
                        <div key={index} className="flex gap-2 items-center py-2 px-3">
                            <CheckBox
                                checked={val?.checked}
                                onChange={() => {
                                    const nData = [...popupData];
                                    const newData = nData?.map((x, idx) => ({
                                        ...x,
                                        checked: idx == index ? !x.checked : x.checked,
                                    }));
                                    setPopupData(newData);
                                }}
                            />
                            <span className="text-xs text-txt-primary">{val?.title}</span>
                        </div>
                    );
                })}
            </div>
        </Popup>
    );
};

export default UserPerformancePopup;
