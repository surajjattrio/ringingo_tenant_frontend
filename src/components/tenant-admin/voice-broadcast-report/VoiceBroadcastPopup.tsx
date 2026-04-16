import { CheckBox } from "@/components/forms";
import { Popup } from "@/components/ui-components";
import { useState } from "react";

interface VoiceBroadcastPopupProps {
    visible: boolean;
    onToggle: () => void;
}

const staticPopupData = [
    {
        id: "1",
        title: "Name",
        checked: false,
    },
    {
        id: "2",
        title: "Survey Digit",
        checked: false,
    },
   
];

const VoiceBroadcastPopup = (props: VoiceBroadcastPopupProps) => {
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

export default VoiceBroadcastPopup;
