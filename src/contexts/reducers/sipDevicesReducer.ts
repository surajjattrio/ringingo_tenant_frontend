import { CALLFORWARD, FILL, FILLKEY, FOLLOWME, SPEEDDIAL, VOICEMAIL } from "../actions";

interface ReducerActionProps {
    type: string;
    payload?: any;
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
        destination: ['', '', '', '', ''],
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

export const sipDevicesReducer = (
    state = initialState,
    action: ReducerActionProps
) => {
    switch (action.type) {
        case CALLFORWARD:
            const callData = action.payload
            return {
                ...state,
                call_forward: callData
            };
        case VOICEMAIL:
            const voicemailData = action.payload
            return {
                ...state,
                voicemail: voicemailData
            };
        case FOLLOWME:
            const followMeData = action.payload
            return {
                ...state,
                follow_me: followMeData
            };
        case SPEEDDIAL:
            const speedDialData = action.payload
            return {
                ...state,
                speed_dial: speedDialData
            };
        case FILL:
            const allData = action.payload

            return {
                ...state,
                call_forward: allData?.call_forward || initialState.call_forward,
                follow_me: allData?.follow_me || initialState.follow_me,
                speed_dial: allData?.speed_dial || initialState.speed_dial,
                voicemail: allData?.voicemail || initialState.voicemail,
                dnd: allData?.dnd || initialState.dnd,
                recording: allData?.recording || initialState.recording,
                mail_to: allData?.mail_to || initialState.mail_to
            };
        case FILLKEY:
            const { key, data } = action.payload
            return {
                ...state,
                [key]: data
            };
        default:
            return {
                ...state,
            };
    }
};
