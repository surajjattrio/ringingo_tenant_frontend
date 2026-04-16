"use client";
import { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    otherFeaturesUpdate,
    sipOptionsGet,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { externalUserOptionsGet } from "@/redux/slice/tenant-admin/userSlice";
import { ringOptionsGet } from "@/redux/slice/tenant-admin/ringSlice";
import { ivrOptionsGet } from "@/redux/slice/tenant-admin/ivrSlice";
import { timeConditionOptionsGet } from "@/redux/slice/tenant-admin/timeConditionSlice";
import { callQueueOptionsGet } from "@/redux/slice/tenant-admin/callQueueSlice";
import { conferenceOptionsGet } from "@/redux/slice/tenant-admin/conferenceSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useSipDevices } from "@/contexts/hooks/useSipDevices";
import CallForward from "@/components/tenant-admin/sip-devices/CallForward";
import VoiceMail from "@/components/tenant-admin/sip-devices/VoiceMail";
import DND from "@/components/tenant-admin/sip-devices/DND";
import MissedCall from "@/components/tenant-admin/sip-devices/MissedCall";
import CallRecording from "@/components/tenant-admin/sip-devices/CallRecording";
import SpeedDial from "@/components/tenant-admin/sip-devices/SpeedDial";
import FollowMe from "@/components/tenant-admin/sip-devices/FollowMe";
import { CardForm, Tabs } from "@/components/ui-components";

const OtherFeatures = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {
        call_forward,
        voicemail,
        follow_me,
        speed_dial,
        dnd,
        recording,
        mail_to,
        fillData,
    } = useSipDevices();

    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("1");

    useLayoutEffect(() => {
        if (!id) return;
        onGetIvrOptions();
        onGetSipOptions();
        onGetTimeConditionOptions();
        onGetCallQueueOptions();
        onGetRingGroupOptions();
        onGetConferenceOptions();
        onGetExternalUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Fetching SIP Options
    const onGetSipOptions = async () => {
        try {
            await dispatch(sipOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    // Fetching IVR Options
    const onGetIvrOptions = async () => {
        try {
            await dispatch(ivrOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get IVR Options Err =-=>", err);
        }
    };

    // Fetching Time Condition Options
    const onGetTimeConditionOptions = async () => {
        try {
            await dispatch(timeConditionOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Time Condition Options Err =-=>", err);
        }
    };

    // Fetching Call Queue Options
    const onGetCallQueueOptions = async () => {
        try {
            await dispatch(callQueueOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Call Queue Options Err =-=>", err);
        }
    };

    // Fetching Ring Group Options
    const onGetRingGroupOptions = async () => {
        try {
            await dispatch(ringOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Ring Group Options Err =-=>", err);
        }
    };

    // Fetching Conference Options
    const onGetConferenceOptions = async () => {
        try {
            await dispatch(conferenceOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Conference Options Err =-=>", err);
        }
    };

    // Fetching External User Options
    const onGetExternalUserOptions = async () => {
        try {
            await dispatch(externalUserOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get External User Options Err =-=>", err);
        }
    };

    const onUpdateOtherFeatures = async (values: any, feature: string) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
                feature,
            };
            const res: any = await dispatch(otherFeaturesUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Update Other Feature Err =-=>", err);
        }
    };

    const onCancelClick = () => {
        router.back();
        fillData({});
    };

    const data = [
        {
            id: "1",
            title: "Call forwarding",
            icon: "CallOut",
            activeIcon: "CallOutGreen",
            component: CallForward,
        },
        {
            id: "2",
            title: "Voice Mail",
            icon: "VoiceMail",
            activeIcon: "VoiceMailGreen",
            component: VoiceMail,
        },
        {
            id: "3",
            title: "Follow Me",
            icon: "UserAdd",
            activeIcon: "UserAddGreen",
            component: FollowMe,
        },
        {
            id: "4",
            title: "DND",
            icon: "CallBlock",
            activeIcon: "CallBlockGreen",
            component: DND,
        },
        // {
        //     id: "5",
        //     title: "Missed call alert",
        //     icon: "CallMissed",
        //     activeIcon: "CallMissedGreen",
        //     component: MissedCall,
        // },
        {
            id: "6",
            title: "Call Recording",
            icon: "MicroPhone",
            activeIcon: "MicroPhoneGreen",
            component: CallRecording,
        },
        {
            id: "7",
            title: "Speed dial",
            icon: "Remote",
            activeIcon: "RemoteGreen",
            component: SpeedDial,
        },
    ];

    const handleSubmit = (e: any) => {
        switch (activeTab) {
            case "1":
                onUpdateOtherFeatures({ call_forward }, "call-forwarding");
                break;
            case "2":
                onUpdateOtherFeatures({ voicemail }, "voicemail");
                break;
            case "3":
                const payload = follow_me;
                payload["destination"] = payload["destination"]
                    ?.filter((val: any) => val)
                    .join(",");
                onUpdateOtherFeatures({ follow_me }, "follow-me");
                break;
            case "4":
                onUpdateOtherFeatures({ dnd }, "dnd");
                break;
            case "5":
                onUpdateOtherFeatures({ mail_to }, "missed-call-alert");
                break;
            case "6":
                onUpdateOtherFeatures({ recording }, "recording");
                break;
            case "7":
                onUpdateOtherFeatures({ speed_dial }, "speed-dial");
                break;
            default:
                break;
        }
    };
    return (
        <>
            <CardForm
                loading={loading}
                title="Other Features"
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={onCancelClick}
            >
                <Tabs data={data} active={activeTab} onChange={setActiveTab} />
            </CardForm>
        </>
    );
};

export default OtherFeatures;
