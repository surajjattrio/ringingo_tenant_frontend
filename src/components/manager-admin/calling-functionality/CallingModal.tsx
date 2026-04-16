import React, { useEffect, useState } from "react";
import Legacy from "next/legacy/image";

// PROJECT IMPORTS
import {
  onAddLeadNoteId,
  onDial,
  onSetAddNoteId,
  onSetStartRegistration,
  setCallScreen,
  setCallerNumber,
  setIsShowCallDuration,
  setShowCallingIcon,
  useAgentName,
  useCallScreen,
  useCallType,
  useCallerNumber,
  useIsShowCallDuration,
  useShowCallingIcon,
  useStartRegistration,
} from "@/redux/slice/commonSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import ActiveCallModal from "./LiveCallComponents/ActiveCallModal";
import DefaultPage from "./LiveCallComponents/DefaultPage";
import IncomingCallModal from "./LiveCallComponents/IncomingCallModal";
import IncomingCallPage from "./LiveCallComponents/IncomingCallPage";

// THIRD-PARTY IMPORT
import {
  Inviter,
  Registerer,
  SessionState,
  RegistererState,
  UserAgent,
  Referral,
  InvitationAcceptOptions,
} from "sip.js";
import Cookies from "js-cookie";

// ASSETS
const closeIcon = "/assets/icons/close.svg";
const CallerTuneFile = "/assets/sound/ringtone.mp3";

// TYPES
interface CallingModelProps {
  showModal: boolean;
  setShowModal?: any;
  onCancleClick: any;
}

let userAgent: any;
let durationInterval: any;
let outgoingMediaStream: any;
let incomingSession: any;
let secondCallSession: any;

const CallingModal = (props: CallingModelProps) => {
  const WSS_URL = process.env.WSS_URL;
  const { showModal = false, onCancleClick, setShowModal } = props;
  const { user } = useAuth();

  const callerTuneplay = new Audio(CallerTuneFile);

  const dispatch = useAppDispatch();
  const callScreen = useCallScreen();
  const isShowCallDuration = useIsShowCallDuration();
  const callerNumber = useCallerNumber();
  const startRegistration = useStartRegistration();
  const showCallingIcon = useShowCallingIcon();
  const setCallType = useCallType();  
  const setAgentName = useAgentName();  

  const [page, setPage] = useState<string>("");
  const [volume, setVolume] = useState<number>(70);

  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHold, setIsHold] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);

  const [showActiveModal, setShowActiveModal] = useState<boolean>(false);
  const [showConferenceBtn, setShowConferenceBtn] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [successMessage, setSuccessMessage] = useState<any>("");
  const [showIncomingModal, setShowIncomingModal] = useState<boolean>(false);

  useEffect(() => {
    if (startRegistration) {
      dispatch(setCallScreen(""));
      userAgentRegistration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRegistration]);

  useEffect(() => {
    if (!showCallingIcon && Cookies.get("registered") === "1") {
      dispatch(onSetStartRegistration(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCallingIcon]);

  const userAgentRegistration = () => {
    console.log("=======IN REGISTRATION======>");
    let username = user?.manager_detail?.extension_details[0]?.username;
    let password = user?.manager_detail?.extension_details[0]?.password;
    let domain = user?.manager_detail?.domain;
    let UAURI = UserAgent.makeURI("sip:" + username + "@" + domain);
    if (!UAURI) {
      throw new Error("Failed to create UserAgent URI ....");
    }

    const userOptions: any = {
      uri: UAURI,
      authorizationPassword: password,
      authorizationUsername: username,
      transportOptions: {
        server: WSS_URL,
        traceSip: true,
      },
      delegate: { onInvite },
      register: true,
      noAnswerTimeout: 60,
      userAgentString: "ASTPP | WEBRTC ",
      dtmfType: "info",
      displayName: username,
      activeAfterTransfer: false, //	Die when the transfer is completed
      logBuiltinEnabled: true, //	Boolean - true or false - If true throws console logs
    };
    userAgent = new UserAgent(userOptions);
    userAgent
      .start()
      .then(() => {
        console.log("Connected ....");
        const registerer = new Registerer(userAgent);
        registerer.stateChange.addListener(
          (registrationState: RegistererState) => {
            console.log("registrationState", registrationState);
          }
        );
        registerer.stateChange.addListener(
          (registrationState: RegistererState) => {
            console.log("registrationState => ", registrationState);
            switch (registrationState) {
              case RegistererState.Registered:
                console.log("Registered11111 ....");
                Cookies.set("admin_showModal", showModal.toString());
                // dispatch(setShowCallingIcon(true));
                Cookies.set("admin_logout_count", "", { expires: 1 });
                Cookies.set("registered", "1", { expires: 1 });
                break;
              case RegistererState.Unregistered:
                console.log("Unregistered ....");
                if (!!user && startRegistration) {
                  setTimeout(() => {
                    userAgentRegistration();
                  }, 3000);
                }
                let start: any = 1;
                let count: any = Cookies.get("admin_logout_count");
                if (count === "") {
                  Cookies.set("admin_logout_count", start, { expires: 1 });
                } else {
                  count = 2;
                  Cookies.set("admin_logout_count", count, { expires: 1 });
                }
                count = Cookies.get("admin_logout_count");
                if (count === "2") {
                  Cookies.set("admin_logout_count", "", { expires: 1 });
                  break;
                }
                break;
              case RegistererState.Terminated:
                console.log("Terminated ....");
                break;
              default:
                console.log(
                  "Could not identified registration state .... ",
                  registrationState
                );
                break;
            }
          }
        );
        if (callScreen !== "LIVE") {
          registerer
            .register()
            .then((request: any) => {
              console.log("Successfully sent REGISTER request .... ", request);
            })
            .catch((error: any) => {
              console.log("Failed to send REGISTER request .... ", error);
            });
        }
      })
      .catch((error: any) => {
        console.log("Failed to connect user agent .... ", error);
      });
  };

  useEffect(() => {
    // userAgentRegistration();
    //getLocalStream();
    if (incomingSession && incomingSession._state === "Established") {
      setupRemoteMedia(incomingSession);
    } else {
      // getLocalStream();
    }
    Cookies.set("admin_showModal", showModal.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // const getLocalStream = () => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: false, audio: true })
  //     .then((stream) => {
  //       // window.localAudio.autoplay = true;
  //     })
  //     .catch((err) => {
  //       console.error(`you got an error: ${err}`);
  //     });
  // };

  const sendDTMF = (dtmfDigit: any) => {
    //	Create DTMF option
    console.log("dtmf--->", dtmfDigit);
    const optionsDTMF = {
      requestOptions: {
        body: {
          contentDisposition: "render",
          contentType: "application/dtmf-relay",
          content: "Signal=" + dtmfDigit.toString() + "\r\nDuration=250",
        },
      },
    };

    try {
      if (incomingSession && incomingSession._state === "Established") {
        // alert(event.target.innerHTML);
        // incomingSession.info(event.target.innerHTML.toString(), optionsDTMF);
        incomingSession.info(optionsDTMF);
      }
    } catch (error) {
      console.log("Incoming or Outgoing session not found for DTMF - ", error);
    }
  };

  //	VOLUME CONTROL
  const controlVolume = (event: any) => {
    const mediaElement: any = document.getElementById("mediaElement");

    if (
      incomingSession &&
      (incomingSession._state === "Initial" ||
        incomingSession._state === "Establishing" ||
        incomingSession._state === "Established")
    ) {
      if (incomingSession._state === "Established") {
        mediaElement.volume = (parseInt(event.target.value, 10) || 0) / 100;
      }
    }
  };

  // HOLD CALL
  const onCallHold = () => {
    setIsHold(true);
    if (incomingSession && incomingSession._state !== "Terminated") {
      if (incomingSession._state !== "Establishing") {
        incomingSession.invite({
          sessionDescriptionHandlerOptions: {
            hold: true,
          },
        });
      }
    }
  };

  // UN-HOLD CALL
  const onCallUnHold = () => {
    setIsHold(false);

    if (incomingSession && incomingSession._state !== "Terminated") {
      if (incomingSession._state !== "Establishing") {
        incomingSession.invite({
          sessionDescriptionHandlerOptions: {
            hold: false,
          },
        });
      }
    }
  };

  const muteMediaSession = () => {
    // alert("1234");
    // alert(showConferenceBtn);
    const mediaElement: any = document.getElementById("mediaElement");

    if (mediaElement) {
      //mediaElement.pause();
      setIsMuted(true);
    }
    if (showConferenceBtn === false) {
      if (
        secondCallSession &&
        (secondCallSession._state === "Establishing" ||
          secondCallSession._state === "Established")
      ) {
        if (secondCallSession._state === "Established") {
          const remoteStream =
            secondCallSession.sessionDescriptionHandler.peerConnection.getRemoteStreams()[0];
          remoteStream.getAudioTracks().forEach((track: any) => {
            track.enabled = false; // Mute A's incoming audio from C
          });
        }
      }
    } else {
      if (
        incomingSession &&
        (incomingSession._state === "Initial" ||
          incomingSession._state === "Establishing" ||
          incomingSession._state === "Established")
      ) {
        if (incomingSession._state === "Established") {
          const localStream =
            incomingSession.sessionDescriptionHandler.peerConnection.getLocalStreams()[0];
          localStream.getAudioTracks().forEach((track: any) => {
            track.enabled = false; // Mute A's outgoing audio
          });
        }
      }

      if (
        secondCallSession &&
        (secondCallSession._state === "Establishing" ||
          secondCallSession._state === "Established")
      ) {
        if (secondCallSession._state === "Established") {
          const remoteStream =
            secondCallSession.sessionDescriptionHandler.peerConnection.getLocalStreams()[0];
          remoteStream.getAudioTracks().forEach((track: any) => {
            track.enabled = false; // Mute A's incoming audio from C
          });
        }
      }
    }
  };

  const unMuteMediaSession = () => {
    const mediaElement: any = document.getElementById("mediaElement");

    if (mediaElement) {
      mediaElement.play();
      setIsMuted(false);
    }

    if (showConferenceBtn === false) {
      if (
        secondCallSession &&
        (secondCallSession._state === "Establishing" ||
          secondCallSession._state === "Established")
      ) {
        if (secondCallSession._state === "Established") {
          const remoteStream =
            secondCallSession.sessionDescriptionHandler.peerConnection.getRemoteStreams()[0];
          remoteStream.getAudioTracks().forEach((track: any) => {
            track.enabled = true; // Mute A's incoming audio from C
          });
        }
      }
    } else {
      if (
        incomingSession &&
        (incomingSession._state === "Initial" ||
          incomingSession._state === "Establishing" ||
          incomingSession._state === "Established")
      ) {
        if (incomingSession._state === "Established") {
          const remoteStream =
            incomingSession.sessionDescriptionHandler.peerConnection.getLocalStreams()[0];
          remoteStream.getAudioTracks().forEach((track: any) => {
            track.enabled = true; // Mute A's incoming audio from C
          });
        }
      }

      if (
        secondCallSession &&
        (secondCallSession._state === "Establishing" ||
          secondCallSession._state === "Established")
      ) {
        if (secondCallSession._state === "Established") {
          const remoteStream =
            secondCallSession.sessionDescriptionHandler.peerConnection.getLocalStreams()[0];
          remoteStream.getAudioTracks().forEach((track: any) => {
            track.enabled = true; // Mute A's incoming audio from C
          });
        }
      }
    }
  };

  const remoteStream = new MediaStream();

  const setupRemoteMedia = (mediaSession: any) => {
    let mediaElement: any = document.getElementById("mediaElement");
    try {
      mediaSession.sessionDescriptionHandler.peerConnection
        .getReceivers()
        .forEach((receiver: any) => {
          if (receiver.track) {
            console.log("Audio remoteStream");

            remoteStream.addTrack(receiver.track);
            console.log(remoteStream);
            mediaElement.srcObject = remoteStream;
            mediaElement.play();
          }
        });
    } catch (error) {
      console.log("Media audio session error - ", error);
    }
  };

  // CALL DURATION
  const callDuration = async (callStatus: Boolean) => {
    if (callStatus === true) {
      //	Call transfer type

      let secs = 0;
      let mins = 0;

      durationInterval = setInterval(() => {
        if (secs < 60) {
          secs = secs + 1;
          setSeconds(secs);
        }
        if (secs >= 59) {
          secs = 0;
          mins = mins + 1;
          setSeconds(secs);
          setMinutes(mins);
        }
      }, 1000);
    } else {
      setSeconds(0);
      setMinutes(0);
      clearInterval(durationInterval);
    }
  };

  // CLEANUP
  const cleanupMedia = () => {
    const mediaElement: any = document.getElementById("mediaElement");
    try {
      if (mediaElement) {
        mediaElement.srcObject = null;
        mediaElement.pause();
      }
    } catch (error) {
      console.log("Clean media audio session error - ", error);
    }
  };

  //	Call keypadsider properties from statuscard component
  const callKeypadSiderProperties = (functionName = "", argumentOne = "") => {
    if (functionName !== "") {
      let dataForLocalStorageSc = {
        functionName: functionName,
        argumentOne: argumentOne,
      };
      // console.log("dataForLocalStorageSc ===> ");
      console.log("dataForLocalStorageSc", dataForLocalStorageSc);

      switch (functionName) {
        case "callTermination":
          // dispatch(setIsCallHangUp(true));
          Cookies.set(
            "admin_statuscardToKeypadSider",
            JSON.stringify(dataForLocalStorageSc),
            { expires: 1 }
          );
          break;
        case "callEstablished":
          Cookies.set(
            "admin_statuscardToKeypadSider",
            JSON.stringify(dataForLocalStorageSc),
            { expires: 1 }
          );
          break;
        default:
          console.log("Statuscard to Keypadsider default");
          console.log(functionName);
          console.log(argumentOne);
          break;
      }
    }
  };

  const hangupChangeout = () => {
    // setLiveCall(false);

    dispatch(onDial(null));
    setShowModal(true);
    setShowActiveModal(false);
    dispatch(onAddLeadNoteId(null));
    setShowModal(false);
    dispatch(setShowCallingIcon(false));
    dispatch(onSetStartRegistration(false));
    dispatch(setCallScreen(""));
    setShowModal(false);
    setIsHold(false);
    setIsMuted(false);
    setPage("");
    cleanupMedia(); //	Stop media audio control
    //outgoingSession("");
    // outgoingSession = null;
    // incomingSession("");
    callerTuneplay.pause(); //	Caller tune pause
    callDuration(false); //	Call duration
    dispatch(setIsShowCallDuration(false));
    callKeypadSiderProperties("callTermination", "Termination");
  };

  const hangupChange = () => {
    dispatch(onDial(null));
    setShowModal(true);
    setShowActiveModal(false);
    dispatch(onAddLeadNoteId(null));
    setShowModal(false);
    dispatch(setShowCallingIcon(false));
    dispatch(onSetStartRegistration(false));
    dispatch(setCallScreen(""));
    setShowModal(false);
    setIsHold(false);
    setIsMuted(false);
    setPage("");
    cleanupMedia(); //	Stop media audio control
    callerTuneplay.pause(); //	Caller tune pause
    //incomingSession = null;
    callDuration(false); //	Call duration
    dispatch(setIsShowCallDuration(false));
    callKeypadSiderProperties("callTermination", "Termination");
  };

  // HANGUP CALL
  const hangupCall = (callHangUpType?: string) => {
    //alert(callHangUpType);
    console.log("COMING HANGUP");
    console.log(callHangUpType);
    console.log(secondCallSession);
    console.log(incomingSession);
    if (incomingSession) {
      switch (callHangUpType) {
        case "HANGUP_BOTH_LINE":
          console.log("COMING");
          console.log(secondCallSession);
          console.log(incomingSession);
          if (incomingSession && incomingSession._state === "Establishing") {
            incomingSession.cancel();
            incomingSession = null;
          }
          if (incomingSession && incomingSession._state === "Established") {
            incomingSession.bye();
            incomingSession = null;
          }
          if (
            secondCallSession &&
            secondCallSession._state === "Establishing"
          ) {
            secondCallSession.cancel();
            secondCallSession = null;
          }
          if (secondCallSession && secondCallSession._state === "Established") {
            secondCallSession.bye();
            secondCallSession = null;
          }

          hangupChangeout();
          hangupChange();
          console.log("COMING");
          console.log(secondCallSession);
          console.log(incomingSession);
          break;
        case "LEAVE_3_WAY":
          console.log(incomingSession);
          console.log(secondCallSession);
          if (incomingSession && secondCallSession) {
            if (
              incomingSession &&
              incomingSession._state === "Established" &&
              secondCallSession &&
              secondCallSession._state === "Established"
            ) {
              incomingSession.refer(secondCallSession);
            }
          }
          //incomingSession.refer(secondCallSession);
          break;
        case "LINE_HANG_UP":
          cleanupMedia(); //	Stop media audio control
          // setupRemoteMedia(outgoingSession);
          if (secondCallSession && secondCallSession.state === "Established") {
            //secondCallSession = null;
            secondCallSession.bye();
            secondCallSession = null;
          } else {
            console.log("Invalid session state for hanging up the second call");
          }
          // secondCallSession.bye();
          console.log("SESSION FIND");
          console.log(incomingSession.pendingReinvite);
          if (incomingSession.pendingReinvite == false) {
            incomingSession.invite({
              sessionDescriptionHandlerOptions: { hold: false },
            });
            setPage("");
            setupRemoteMedia(incomingSession);
          }
          break;
        case "CONFERENCE_3_WAY":
          console.log("===============3 way");
          console.log(incomingSession);
          console.log(secondCallSession);
          console.log("===============3 way");
          incomingSession.invite({
            sessionDescriptionHandlerOptions: { hold: false },
          });
          var sessionsToConference = [incomingSession, secondCallSession];
          setShowConferenceBtn(false);
          break;
        case "SWAP_CALL":
          console.log("===============SWAP_CALL");
          console.log(
            secondCallSession.sessionDescriptionHandlerOptionsReInvite.hold
          );
          console.log("===============SWAP_CALL");
          if (
            secondCallSession.sessionDescriptionHandlerOptionsReInvite &&
            secondCallSession.sessionDescriptionHandlerOptionsReInvite.hold ===
            true
          ) {
            secondCallSession.invite({
              sessionDescriptionHandlerOptions: { hold: false },
            });
            setupRemoteMedia(secondCallSession);
          } else {
            secondCallSession.invite({
              sessionDescriptionHandlerOptions: { hold: true },
            });
          }
          // outgoingSession.invite({
          //   sessionDescriptionHandlerOptions: { hold: false },
          // });
          // secondCallSession.invite({
          //   sessionDescriptionHandlerOptions: { hold: false },
          // });
          break;
        default:
          console.log("HANGUP DEFAULT");
          try {
            if (incomingSession) {
              if (
                incomingSession._state === "Initial" ||
                incomingSession._state === "Establishing"
              ) {
                // incomingSession.cancel()
                //incomingSession = null;
                incomingSession.reject();
                incomingSession = null;
              } else if (incomingSession._state === "Established") {
                //  incomingSession.bye();
                // incomingSession.refer(secondCallSession);
                if (
                  secondCallSession &&
                  secondCallSession.state === "Established"
                ) {
                  if (
                    incomingSession &&
                    incomingSession.state === "Established"
                  ) {
                    incomingSession.refer(secondCallSession);
                  }
                } else {
                  //incomingSession = null;
                  incomingSession.bye();
                  incomingSession = null;
                }
              }
            }

            if (secondCallSession) {
              if (
                secondCallSession._state === "Initial" ||
                secondCallSession._state === "Establishing"
              ) {
                // incomingSession.cancel()
                //incomingSession = null;
                secondCallSession.cancel();
                secondCallSession = null;
              } else if (secondCallSession._state === "Established") {
                //  incomingSession.bye();
                // incomingSession.refer(secondCallSession);
                if (
                  secondCallSession &&
                  secondCallSession.state === "Established"
                ) {
                  if (
                    incomingSession &&
                    incomingSession.state === "Established"
                  ) {
                    incomingSession.refer(secondCallSession);
                  } else {
                    // incomingSession.bye();
                    // incomingSession = null;
                    secondCallSession.bye();
                    secondCallSession = null;
                  }
                } else {
                  //incomingSession = null;
                  secondCallSession.bye();
                  secondCallSession = null;
                }
              }
            }
          } catch (error) {
            console.log("Incoming or Outgoing session not found - ", error);
          }
          break;
      }
    }
  };

  // INCOMING CALL INVITATION
  const onInvite = (invitation: any) => {
    console.log("INCOMING INCOMING BE READY ========================");
    // if (!user?.isPbx && campaignType === "outbound") {
    //   // User is not a PBX user and campaignType is "outbound"
    //   // Reject the incoming call
    //   invitation.reject({ status_code: 603, reason_phrase: "Decline" });
    //   console.log("Outbound campaign: No incoming calls allowed.");
    //   return;
    // }

    if (Cookies.get("admin_isRejected") === "0") {
      invitation.reject({ status_code: 603, reason_phrase: "Decline" });
      console.log("Outbound campaign: No incoming calls allowed.");
      return;
    }

    console.log(
      "INCOMING INCOMING BE READY ==========invitation==============",
      invitation
    );
    if (incomingSession && incomingSession._state != "Terminated") {
      console.log("second hit");

      invitation.reject();
      return;
    }
    dispatch(onSetAddNoteId(null));
    dispatch(onAddLeadNoteId(null));
    dispatch(setCallerNumber(""));
    Cookies.remove("admin_callId");
    console.log(invitation);
    console.log(incomingSession);

    invitation.delegate = {
      // Handle incoming REFER request.
      onRefer(referral: Referral) {
        //console.log("Handle incoming REFER request.");
        referral.accept().then(() => {
          referral.makeInviter().invite();
        });
      },
    };

    incomingSession = invitation;

    //	Set caller number
    let callNumber = "Unknown";
    let callerId = "";

    if (
      invitation?.incomingInviteRequest.earlyDialog.dialogState.remoteURI.normal
        .user
    ) {
      callNumber =
        invitation.incomingInviteRequest.earlyDialog.dialogState.remoteURI
          .normal.user;
    }
    dispatch(setCallerNumber(callNumber));

    const setScreens: boolean =
      Cookies.get("admin_showModal") === "true" ? true : false;
    if (setScreens) {
      dispatch(setCallScreen("INCOMING"));
    }
    setShowIncomingModal(!setScreens ? true : false);
    callerTuneplay.play(); //	Caller tune play
    callerTuneplay.currentTime = 0;

    invitation.stateChange.addListener((incomingState: SessionState) => {
      console.log(incomingState, "incomingState");
      switch (incomingState) {
        case SessionState.Initial:
          console.log("Incoming initiated ....");
          const setScreens: boolean =
            Cookies.get("admin_showModal") === "true" ? true : false;
          if (setScreens) {
            dispatch(setCallScreen("INCOMING"));
          }
          setShowIncomingModal(!setScreens ? true : false);
          callerTuneplay.play(); //	Caller tune play
          callerTuneplay.currentTime = 0;
          // callerTuneplay.play(); //	Caller tune play
          // callerTuneplay.currentTime = 0;
          break;

        case SessionState.Establishing:
          console.log("Incoming establishing ....");
          Cookies.set("admin_is_call_start", "0");
          callerTuneplay.play(); //	Caller tune play
          callerTuneplay.currentTime = 0;
          break;

        case SessionState.Established:
          console.log("Incoming established ....");
          console.log("invitation------------------->", invitation);
          Cookies.set("admin_is_call_start", "0");
          dispatch(setIsShowCallDuration(true)); // show call duration
          setShowIncomingModal(false); // incoming call Model false
          setShowModal(true);
          dispatch(setCallScreen("LIVE"));
          callerTuneplay.pause(); //	Caller tune play
          setupRemoteMedia(invitation); //	Media audio control
          callDuration(true); //	Call duration
          Cookies.set("admin_callId", callerId);
          dispatch(onSetAddNoteId(callerId));
          callKeypadSiderProperties("callEstablished", "Established"); //	On answer manage keypadsider states
          break;

        case SessionState.Terminated:
          console.log("Incoming terminated ....");
          console.log("invitation------------------->", invitation);
          console.log("invitation------------------->", secondCallSession);
          Cookies.set("admin_is_call_start", "1");
          dispatch(setShowCallingIcon(false));
          dispatch(onSetStartRegistration(false));
          dispatch(setCallScreen(""));
          setShowModal(false);
          if (
            (secondCallSession && secondCallSession._state == "Established") ||
            (secondCallSession && secondCallSession._state == "Establishing")
          ) {
            //incomingSession.refer(secondCallSession)
            console.log("COMING HERE 0");
            setPage("");
            setupRemoteMedia(secondCallSession);
            break;
          } else {
            setShowIncomingModal(false); // incoming call Model false
            dispatch(onDial(null));
            setShowActiveModal(false);
            setIsHold(false);
            setIsMuted(false);
            setPage("");
            cleanupMedia(); //	Stop media audio control
            callerTuneplay.pause(); //	Caller tune pause
            //incomingSession = null;
            callDuration(false); //	Call duration
            dispatch(setIsShowCallDuration(false));
            callKeypadSiderProperties("callTermination", "Termination"); //	On termination manage keypadsider states
            break;
          }

        case SessionState.Terminating:
          Cookies.set("admin_is_call_start", "1");
          console.log("Incoming terminating ....");
          setShowIncomingModal(false); // incoming call Model false

          dispatch(onDial(null));
          dispatch(setShowCallingIcon(false));
          dispatch(onSetStartRegistration(false));
          dispatch(setCallScreen(""));
          setShowModal(false);
          setShowActiveModal(false);
          setIsHold(false);
          setIsMuted(false);
          setPage("");
          cleanupMedia(); //	Stop media audio control
          callerTuneplay.pause(); //	Caller tune pause
          callDuration(false); //	Call duration
          dispatch(setIsShowCallDuration(false));
          callKeypadSiderProperties("callTermination", "Termination"); //	On termination manage keypadsider states
          break;

        default:
          console.log(
            "Could not identified incoming state .... ",
            incomingState
          );
          setShowIncomingModal(false); // incoming call Model false

          dispatch(onDial(null));
          setShowActiveModal(false);
          dispatch(setShowCallingIcon(false));
          dispatch(onSetStartRegistration(false));
          dispatch(setCallScreen(""));
          setShowModal(false);
          setIsHold(false);
          setIsMuted(false);
          setPage("");
          callerTuneplay.pause(); //	Caller tune pause
          callDuration(false); //	Call duration
          dispatch(setIsShowCallDuration(false));
          break;
      }
    });

    let constrainsDefault: MediaStreamConstraints = {
      audio: true,
      video: false,
    };

    const options: InvitationAcceptOptions = {
      sessionDescriptionHandlerOptions: {
        constraints: constrainsDefault,
      },
    };
  };

  // RECEIVE CALL
  const receiveCall = () => {
    if (incomingSession) {
      try {
        incomingSession.accept();
        callDuration(false);
      } catch (error) {
        console.log("Incoming session accept error found - ", error);
      }
    }
  };

  // ERROR || SUCCESS MSG TIME OUT
  useEffect(() => {
    if (errorMessage || successMessage) {
      setTimeout(() => {
        errorMessage && setErrorMessage("");
        successMessage && setSuccessMessage("");
      }, 2000);
    }
  }, [errorMessage, successMessage]);

  const rendarPage = () => {
    switch (page) {
      default:
        return (
          <DefaultPage
            setPage={setPage}
            controlVolume={controlVolume}
            hangupCall={hangupCall}
            isHold={isHold}
            isMuted={isMuted}
            muteMediaSession={muteMediaSession}
            unMuteMediaSession={unMuteMediaSession}
            showVolume={showVolume}
            setShowVolume={setShowVolume}
            volume={volume}
            setVolume={setVolume}
            onCallUnHold={onCallUnHold}
            onCallHold={onCallHold}
            isShowCallDuration={isShowCallDuration}
          />
        );
    }
  };

  console.log(callScreen, "callScreen");

  if (showIncomingModal && !showModal) {
    return (
      <>
        <IncomingCallModal
          showIncomingModal={showIncomingModal}
          setShowIncomingModal={setShowIncomingModal}
          setShowModal={setShowModal}
          hangupCall={hangupCall}
          receiveCall={receiveCall}
          callerNumber={callerNumber}
        />
      </>
    );
  }

  if (callScreen === "LIVE" && !showModal) {
    return (
      <>
        <ActiveCallModal
          showActiveModal={showActiveModal}
          setShowActiveModal={setShowActiveModal}
          hangupCall={hangupCall}
          seconds={seconds}
          minutes={minutes}
          setShowModal={setShowModal}
        />
      </>
    );
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full bg-heading bg-opacity-30 ${!showModal && "hidden"
        }`}
      onClick={() => {
        onCancleClick();
        if (callScreen === "LIVE") {
          setShowActiveModal(true);
        }
        if (callScreen === "INCOMING") {
          setShowIncomingModal(true);
        }
      }}
    >
      <div className="w-full h-full relative flex justify-center">
        <div className="fixed 3xl:max-w-[340px] 3xl:max-h-[275px] max-w-[300px] max-h-[275px] right w-full h-full right-[44px] bottom-[48px] drop-shadow-lg">
          <div
            className="h-full bg-white rounded-lg"
            onClick={(e: any) => e.stopPropagation()}
          >
            <div className="bg-heading 3xl:px-6 3xl:py-2.5 py-2 px-4 rounded-t-lg relative">
              <div className="flex items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full mr-1.5 ${callScreen === "LIVE" || callScreen === "INCOMING"
                      ? "bg-primary"
                      : "bg-error"
                    }`}
                ></div>
                <span className="3xl:text-base text-sm text-white font-bold ml-1">
                  {callScreen === "LIVE" && isShowCallDuration
                    ? "Live Call"
                    : callScreen === "LIVE" && !isShowCallDuration
                      ? "Ringing"
                      : callScreen === "INCOMING"
                        ? setCallType
                        : callScreen === "CALLFAILED"
                          ? "Call Failed "
                          : "No Live Call"}
                </span>
              </div>
              <div
                className={`bottom-[-20px] absolute text-xs left-[-1px] flex justify-center w-full ${successMessage ? "text-primary" : "text-error"
                  }`}
              >
                <p>{errorMessage ? errorMessage : successMessage}</p>
              </div>
            </div>
            {callScreen === "INCOMING" ? (
              <IncomingCallPage
                hangupCall={hangupCall}
                receiveCall={receiveCall}
                callerNumber={callerNumber}
              />
            ) : (
              <div className="3xl:px-8 px-6 flex flex-col justify-between select-none 3xl:h-[90%] h-[83%] 3xl:pb-6 pb-4">
                <div className="3xl:py-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="3xl:h-14 3xl:w-14 h-12 w-12 bg-secondary-v10 rounded-full flex items-center justify-center">
                        <span className="3xl:text-base text-sm text-heading font-bold">
                          {/* {callerName
                    ? callerName.slice(0, 1).toUpperCase()
                    : callerNumber.slice(0, 1).toUpperCase()} */}
                          {/* {callerNumber?.slice(0, 1).toUpperCase() || ""} */}
                          {setAgentName}
                        </span>
                      </div>
                      <div className="flex flex-col 3xl:pl-3 pl-1">
                        <span className="3xl:text-xs text-[11px] text-heading">
                          {/* Incoming Call From */}
                          {setCallType}
                        </span>
                        {/* {callerName ? (
                  <span className="3xl:text-sm text-xs text-heading font-bold">
                    {callerName}
                  </span>
                ) : null}
                <span
                  className={`text-heading ${callerName
                      ? "3xl:text-xs text-[11px] font-medium"
                      : "3xl:text-sm text-xs font-bold"
                    }`}
                >
                  {callerNumber}
                </span> */}
                        <span className="3xl:text-sm text-xs font-bold">
                          {/* {callerNumber} */}
                          {setAgentName}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {isShowCallDuration && (
                        <>
                          <span className="3xl:text-xs text-[11px] text-heading">
                            Established
                          </span>
                          <span className="3xl:text-sm text-xs text-heading font-bold">
                            {minutes < 10 ? `0${minutes}` : minutes} :{" "}
                            {seconds < 10 ? `0${seconds}` : seconds}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {rendarPage()}
              </div>
            )}
          </div>
          <div
            className="absolute bg-white 3xl:h-14 3xl:w-14 w-12 h-12 flex justify-center items-center rounded-full drop-shadow-lg cursor-pointer -right-4 -bottom-4"
            onClick={() => {
              onCancleClick();
              if (callScreen === "LIVE") {
                setShowActiveModal(true);
              }
              if (callScreen === "INCOMING") {
                setShowIncomingModal(true);
              }
            }}
          >
            <div className="relative w-[18px] h-[18px] 3xl:w-[24px] 3xl:h-[24px]">
              <Legacy src={closeIcon} alt="close" layout="fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallingModal;
