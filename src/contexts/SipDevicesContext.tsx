"use client";
import { createContext, useReducer } from "react";

// PROJECT IMPORTS
import {
    CALLFORWARD,
    FILL,
    FILLKEY,
    FOLLOWME,
    SPEEDDIAL,
    VOICEMAIL,
} from "./actions";

// TYPES IMPORT 
import { sipDevicesReducer } from "./reducers/sipDevicesReducer";

// TYPES
export type SipDevicesContextType = {
    call_forward: any;
    follow_me: any;
    speed_dial: any;
    voicemail: any;
    dnd: string;
    recording: string;
    mail_to: string;
    onCallForwardChange: any;
    onVoiceMailChange: any;
    onFollowMeChange: any;
    onDestinationChange: any;
    onSpeedDialChange: any;
    fillData: any;
    fillKeyData: any;
}

const initialState: any = {
    call_forward: {
        call_forward: {
            call_forwarding_status: 1,
            routing_type: "1",
            routing_value: "",
        },
        on_busy: {
            on_busy_status: 1,
            routing_type: "1",
            routing_value: "",
        },
        no_answered: {
            no_answered_status: 1,
            routing_type: "1",
            routing_value: "",
        },
        not_registered: {
            not_registered_status: 1,
            routing_type: "1",
            routing_value: "",
        },
    },
    follow_me: {
        follow_me_status: 1,
        ignore_busy: 1,
        destination: ["", "", "", "", ""],
    },
    speed_dial: [
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
        {
            routing_type: "1",
            routing_value: "",
        },
    ],
    voicemail: {
        voicemail_status: 0,
        password: "",
        mail_to: "",
        attach_file: 1,
    },
    dnd: "0",
    recording: "1",
    mail_to: "",
};

const SipDevicesContext = createContext<SipDevicesContextType | null>(null);

export const SipDevicesProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(sipDevicesReducer, initialState);

    const onCallForwardChange = (
        key: string,
        insideKey: string,
        val: string | number
    ) => {
        const newData = { ...state.call_forward };
        newData[key] = { ...newData[key], [insideKey]: val };
        dispatch({ type: CALLFORWARD, payload: newData });
    };

    const onVoiceMailChange = (key: string, val: string | number) => {
        const newData = { ...state.voicemail };
        newData[key] = val;
        dispatch({ type: VOICEMAIL, payload: newData });
    };

    const onFollowMeChange = (key: string, val: string | number) => {
        const newData = { ...state.follow_me };
        newData[key] = val;
        dispatch({ type: FOLLOWME, payload: newData });
    };

    const onDestinationChange = (val: string | number, idx: number) => {
        const newData = { ...state.follow_me };
        newData["destination"][idx] = val;
        dispatch({ type: FOLLOWME, payload: newData });
    };

    const onSpeedDialChange = (
        key: string,
        val: string | number,
        idx: number
    ) => {
        const newData = [...state.speed_dial];
        newData[idx] = { ...newData[idx], [key]: val };
        dispatch({ type: SPEEDDIAL, payload: newData });
    };

    const fillKeyData = (key: string, data: any) => {
        dispatch({ type: FILLKEY, payload: { key, data } });
    };

    const fillData = (data: any) => {
        const ids = data?.follow_me?.destination?.split(",");
        const newIds = initialState.follow_me.destination?.map(
            (id: string, idx: number) => (ids?.length && ids[idx] ? ids[idx] : id)
        );
        const followMe = { ...data?.follow_me, destination: newIds };
        const newData = { ...data, follow_me: followMe };
        dispatch({ type: FILL, payload: newData });
    };

    return (
        <SipDevicesContext.Provider
            value={{
                ...state,
                onCallForwardChange,
                onVoiceMailChange,
                onFollowMeChange,
                onDestinationChange,
                onSpeedDialChange,
                fillData,
                fillKeyData,
            }}
        >
            {children}
        </SipDevicesContext.Provider>
    );
};

export default SipDevicesContext;
