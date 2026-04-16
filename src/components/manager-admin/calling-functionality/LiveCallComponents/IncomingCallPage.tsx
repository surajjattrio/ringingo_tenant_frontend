"use client";
import { useAgentName, useCallType } from "@/redux/slice/commonSlice";
import Legacy from "next/legacy/image";

// ASSETS
const call_end = "/assets/icons/white/call_end.svg";
const call = "/assets/icons/white/call_white.svg";

// TYPES
interface CallingPageProps {
    hangupCall: any;
    receiveCall: any;
    callerNumber: string;
}

/* ============================== INCOMING CALL PAGE ============================== */

const IncomingCallPage = (props: CallingPageProps) => {
    const { hangupCall, receiveCall, callerNumber } = props;
    const setCallType = useCallType();  
    const setAgentName = useAgentName(); 

    return (
        <>
            <div className="3xl:px-8 px-6 flex flex-col justify-between 3xl:h-[90%] h-[92%]">
                <div className="py-6 flex justify-center">
                    <div className="flex flex-col items-center">
                        <div className="3xl:h-16 3xl:w-16 h-14 w-14 bg-secondary-v10 rounded-full flex items-center justify-center">
                            <span className="text-lg text-heading font-bold">
                                {/* {callerNumber.slice(0, 1).toUpperCase()} */}
                                {setAgentName}
                            </span>
                        </div>
                        <div className="flex flex-col items-center pt-3">
                            <span className="3xl:text-xs text-[11px] text-heading">
                            {setCallType} From
                            </span>
                            <span className="3xl:text-sm text-xs font-bold">
                                {/* {callerNumber} */}
                                {setAgentName}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center 3xl:gap-16 gap-12 py-8">
                    <div
                        className="bg-error 3xl:w-12 3xl:h-12 w-10 h-10 drop-shadow-sm flex justify-center items-center rounded-full hover:bg-opacity-80 cursor-pointer"
                        onClick={() => {
                            hangupCall();
                        }}
                    >
                        <div className="relative w-[18px] h-[18px] 3xl:w-[24px] 3xl:h-[24px]">
                            <Legacy src={call_end} alt="call_end" layout="fill" />
                        </div>
                    </div>
                    <div
                        className="bg-primary 3xl:w-12 3xl:h-12 w-10 h-10 drop-shadow-sm flex justify-center items-center rounded-full hover:bg-opacity-80 cursor-pointer"
                        onClick={() => {
                            receiveCall();
                        }}
                    >
                        <div className="relative w-[18px] h-[18px] 3xl:w-[24px] 3xl:h-[24px]">
                            <Legacy src={call} alt="call" layout="fill" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IncomingCallPage;
