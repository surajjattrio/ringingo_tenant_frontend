import Image from "next/image";
import Legacy from "next/legacy/image";

// TYPES
export type IconKey = keyof typeof icons;
interface IconProps {
  className?: string;
  name: IconKey;
  alt?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  tooltip?: string;
  disabled?: boolean;
}

// ASSETS
const icons = {

  // Login Logo
  LoginLogo:"/assets/images/LoginLogo1.svg",
  NewLogo:"/assets/images/ringingo-new-logo.png",
  CollapsedNewLogo:"/assets/images/Ringingo-Logo-new.png",
  sidebarCallcenter: "/assets/icons/sidebar_callcenter.svg",

  // BLACK
  TenantLogo: "/assets/images/logo.png",
  Refresh: "/assets/icons/refresh.svg",
  Refresh2: "/assets/icons/refresh-2.svg",
  Eye: "/assets/icons/eye.svg",
  Ear: "/assets/icons/ear.svg",
  Play: "/assets/icons/play.svg",
  PlayOutline: "/assets/icons/play-outlined.svg",
  RefreshCircle: "/assets/icons/refresh-circle.svg",
  Edit: "/assets/icons/edit.svg",
  EditNew: "/assets/icons/black/edit-new.svg",
  Delete: "/assets/icons/red/delete.svg",
  ForwardOutline: "/assets/icons/forward-outline.svg",
  ArrowLeft: "/assets/icons/arrow-left.svg",
  ArrowDown: "/assets/icons/arrow-down.svg",
  ArrowUp: "/assets/icons/arrow-top.svg",
  ArrowRightDouble: "/assets/icons/direction-right.svg",
  ArrowRight: "/assets/icons/arrow-right.svg",
  Arrange: "/assets/icons/arrange-square.svg",
  Plus: "/assets/icons/plus.svg",
  Filter: "/assets/icons/filter.svg",

  InfoCircle: "/assets/icons/info-circle.svg",
  PlusCircle: "/assets/icons/plus-circle.svg",
  MinusCircle: "/assets/icons/minus-cirlce.svg",
  Email: "/assets/icons/email.svg",
  Lock: "/assets/icons/lock.svg",
  Map: "/assets/icons/map.svg",
  Earth: "/assets/icons/earth.svg",
  Clock: "/assets/icons/clock.svg",
  Calendar: "/assets/icons/calendar.svg",
  Data: "/assets/icons/data.svg",
  Notification: "/assets/icons/notification.svg",
  Menu: "/assets/icons/menu.svg",
  Home: "/assets/icons/home.svg",
  Setting: "/assets/icons/settings.svg",
  Pbx: "/assets/icons/pbx.svg",
  Audio: "/assets/icons/audio.svg",
  Notes: "/assets/icons/notes.svg",
  Chat: "/assets/icons/chat-notification.svg",
  LeadGroup: "/assets/icons/lead-group.svg",
  LeadManagement: "/assets/icons/lead-management.svg",
  Location: "/assets/icons/location.svg",
  TimeZone: "/assets/icons/timezone.svg",
  Close: "/assets/icons/close.svg",
  Volume: "/assets/icons/volume.svg",
  Download: "/assets/icons/download.svg",
  Zip: "/assets/icons/zip.svg",
  ProfileCircle: "/assets/icons/profile-circle.svg",
  Exit: "/assets/icons/logout.svg",
  ArchiveBook: "/assets/icons/archive-book.svg",
  DocumentText: "/assets/icons/document-text.svg",
  TaskSquare: "/assets/icons/task-square.svg",
  CloseCircle: "/assets/icons/close-circle.svg",
  VolumeUp: "/assets/icons/volume-up.svg",
  VolumeDown: "/assets/icons/volume-down.svg",
  VoiceMail: "/assets/icons/voice-mail.svg",
  MicroPhone: "/assets/icons/microphone.svg",
  Remote: "/assets/icons/remote.svg",
  Export: "/assets/icons/upper-arrow.svg",
  Import: "/assets/icons/lower-arrow.svg",
  Refresh3: "/assets/icons/refresh-3.svg",
  Columns: "/assets/icons/columns.svg",
  Inbox: "/assets/icons/inbox.svg",
  Data2: "/assets/icons/data-2.svg",
  DocumentIcon: "/assets/icons/document.svg",
  AddNote: "/assets/icons/add-note.svg",
  FollowUp: "/assets/icons/followUp.svg",
  ClickToCall: "/assets/icons/call-ring.svg",
  Copy: "/assets/icons/copy.svg",
  Pause: "/assets/icons/pause.svg",

  // USER - BLACK
  User: "/assets/icons/user.svg",
  UserName:"/assets/icons/gray/Username.svg",
  UserAudio: "/assets/icons/user-audio.svg",
  UserCalling: "/assets/icons/user-calling.svg",
  UserOutline: "/assets/icons/user-outline.svg",
  UserTenant: "/assets/icons/tenant.svg",
  UserSip: "/assets/icons/sip-profile.svg",
  UserRole: "/assets/icons/user-role.svg",
  UserAdd: "/assets/icons/user-add.svg",
  Zohologo:"/assets/icons/zoho1.svg",
  Dialplan:"/assets/icons/Dialplan.svg",
  RetrySecond:"/assets/icons/RetrySecond.svg",
  Prepend:"/assets/icons/Prepand.svg",
  FailOverTrunk1:"/assets/icons/FailOverTrunk1.svg",
  FailOverTrunk2:"/assets/icons/FailOverTrunk 2.svg",
  Length1:"/assets/icons/Lenght.svg",
  DIDCALLERID:"/assets/icons/DIDCallerID.svg",
  Invalidretries:"/assets/icons/Invalidentries.svg",
  Postalcode:"/assets/icons/Postalcode.svg",
  BlendedCampaign:"/assets/icons/BlendedCampaign.svg",
  Dispositions:"/assets/icons/Dispositions.svg",
  Voicebroadcasting:"/assets/icons/Voicebroadcasting.svg",
  MessagingChannel:"/assets/icons/MessagingChannel.svg",
  MessagingQueue:"/assets/icons/MessagingQueue.svg",
  liveCalls:"/assets/icons/liveCalls.svg",
  MissedCall:"/assets/icons/MissedCall.svg",
  CallQueue:"/assets/icons/CallQueue.svg",
  DroppedCalls:"/assets/icons/DroppedCalls.svg",
  Realtimereport:"/assets/icons/Realtimereport.svg",
  LeadReport:"/assets/icons/LeadReport.svg",
  CampaignReport:"/assets/icons/CampaignReport.svg",
  UserPerformance:"/assets/icons/UserPerformance.svg",
  loginlogoutreport:"/assets/icons/loginlogoutreport.svg",
  Voicemail:"/assets/icons/Voicemail.svg",
  StickyAgentReport:"/assets/icons/StickyAgentReport.svg",
  Recording:"/assets/icons/Recording.svg",
  breakcode1:"/assets/icons/breakcode1.svg",
  Audioprompt:"/assets/icons/Audioprompt.svg",
  Lead1:"/assets/icons/Lead.svg",
  Telecomcircle:"/assets/icons/Telecomcircle.svg",
  Tenantreport:"/assets/icons/Tenantreport.svg",
  Sipprofile:"/assets/icons/Sipprofile.svg",
  Time12:"/assets/icons/Time12.svg",
  Emailsetting:"/assets/icons/Emailsetting.svg",
  SystemDisposition:"/assets/icons/SystemDisposition.svg",
  custom1:"/assets/icons/custom1.svg",
  LeadGroup1:"/assets/icons/LeadGroup.svg",
  DNC:"/assets/icons/DNC.svg",
  CDRs:"/assets/icons/CDRs.svg",
  lender:"/assets/icons/lender.svg",
  houseowner:"/assets/icons/houseowner.svg",
  Plugins:"/assets/icons/plugin.svg",
  Googledrive:"/assets/icons/google-drive.svg",


  // CALL - BLACK
  CallUser: "/assets/icons/call-user.svg",
  CallTrunk: "/assets/icons/trunk.svg",
  CallIncoming: "/assets/icons/call-incoming.svg",
  CallSip: "/assets/icons/sip-call.svg",
  Calling: "/assets/icons/calling.svg",
  CallOutgoing: "/assets/icons/call-out.svg",
  CallMenu: "/assets/icons/call-menu.svg",
  CallPlus: "/assets/icons/call-plus1.svg",
  CallOut: "/assets/icons/call-out.svg",
  CallBlock: "/assets/icons/call-block.svg",
  CallMissed: "/assets/icons/call-missed.svg",

  // FILL - BLACK
  UserFill: "/assets/icons/user-fill.svg",
  LockFill: "/assets/icons/lock-fill.svg",
  MailFill: "/assets/icons/mail-fill.svg",
  WebhookFill: "/assets/icons/webhook.svg",

  // WHITE
  RefreshWhite: "/assets/icons/white/refresh.svg",
  PlusWhite: "/assets/icons/white/plus.svg",
  DeleteWhite: "/assets/icons/white/delete.svg",
  DeleteWhiteNew: "/assets/icons/white/delete-white.svg",
  CheckMarkWhite: "/assets/icons/white/check-mark.svg",
  ArrowLeftWhite: "/assets/icons/white/arrow-left.svg",
  Refresh2White: "/assets/icons/white/refresh-2.svg",
  CloseCircleWhite: "/assets/icons/white/close-circle.svg",
  CloseWhite: "/assets/icons/white/close.svg",
  SaveWhite: "/assets/icons/white/save-icon.svg",
  LoginIcon: "/assets/icons/white/login-icon.svg",
  UpsideArrowWhite: "/assets/icons/white/UpsideArrow.svg",
  DownsideArrowWhite: "/assets/icons/white/DownsideArrow.svg",


  // BLACK
  ArrowLeftBlack: "/assets/icons/black/arrow-left.svg",
  CloseBlack: "/assets/icons/black/Close-black.svg",

  // Blue
  PlusBlue: "/assets/icons/blue/plus.svg",

  // CALL - WHITE
  CallingWhite: "/assets/icons/white/livecalling.svg",
  CallWhite: "/assets/icons/white/call.svg",
  Call_White: "/assets/icons/white/call_white.svg",

  // DARK
  Refresh2Dark: "/assets/icons/refresh-2-dark.svg",

  // DARK - GRAY
  CallDarkGray: "assets/icons/dark-gray/call.svg",
  HomeDarkGray: "/assets/icons/dark-gray/home.svg",
  MonitorDarkGray: "/assets/icons/dark-gray/monitor.svg",
  DriveDarkGray: "/assets/icons/dark-gray/drive.svg",
  GrayEmail: "/assets/icons/gray/mail.svg",
  SipDevices: "/assets/icons/gray/sip-Devices.svg",
  ManagerRoles: "/assets/icons/gray/manager-role.svg",
  OutgoingRules: "/assets/icons/gray/outgoing-rules.svg",
  CallerIdGroup: "/assets/icons/gray/caller-id-group.svg",
  Whatsapp: "/assets/icons/gray/whatsapp.svg",
  SMS: "/assets/icons/gray/sms.svg",
  UserGray: "/assets/icons/gray/user.svg",
  UserGroup: "/assets/icons/gray/user-group.svg",
  Group: "/assets/icons/gray/group.svg",
  Description: "/assets/icons/gray/description.svg",
  Prefix: "/assets/icons/gray/prefix.svg",
  Strip: "/assets/icons/gray/strip.svg",
  Trunk: "/assets/icons/gray/trunk.svg",
  DIDNumber: "/assets/icons/gray/did-numbers.svg",
  TimeOut: "/assets/icons/gray/time-out.svg",
  Id: "/assets/icons/gray/id.svg",
  Type: "/assets/icons/gray/type.svg",
  InformationPrompt: "/assets/icons/gray/information-prompt.svg",
  CallMode: "/assets/icons/gray/call-mode.svg",
  WelcomePrompt: "/assets/icons/gray/welcome-prompt.svg",
  InvalidPrompt: "/assets/icons/gray/invalid-prompt.svg",
  InvalidEntries: "/assets/icons/gray/invalid-entries.svg",
  ExitPrompt: "/assets/icons/gray/exit-prompt.svg",
  FailOption: "/assets/icons/gray/fail-option.svg",
  FailType: "/assets/icons/gray/fail-type.svg",
  Pin: "/assets/icons/gray/pin.svg",
  AgentTimeout: "/assets/icons/gray/agent-timeout.svg",
  Strategy: "/assets/icons/gray/strategy.svg",
  ExtensionName: "/assets/icons/gray/extension-name.svg",
  Position: "/assets/icons/gray/position.svg",
  Level: "/assets/icons/gray/Level.svg",
  Value: "/assets/icons/gray/value.svg",
  Domain: "/assets/icons/gray/domain.svg",
  PhoneCall: "/assets/icons/gray/phone-call.svg",
  Address: "/assets/icons/gray/address.svg",
  Globe: "/assets/icons/gray/globe.svg",
  City: "/assets/icons/gray/city.svg",
  Campaign: "/assets/icons/gray/campaign.svg",
  GroupLead: "/assets/icons/gray/leadgroup.svg",
  FieldLabel: "/assets/icons/gray/field-label.svg",
  PlaceHolder: "/assets/icons/gray/placeholder-text.svg",
  FieldType: "/assets/icons/gray/field-type.svg",
  FieldRank: "/assets/icons/gray/field-rank.svg",
  WrapUpTime: "/assets/icons/gray/wrap-up-time.svg",
  CallTransferRingGroup: "/assets/icons/gray/call-transfer-ring-group.svg",
  AllowedTranferCallQueue: "/assets/icons/gray/allowed-transfer-call-queue.svg",
  AllowedTransferIVR: "/assets/icons/gray/allowed-transfer-IVR.svg",
  Csat: "/assets/icons/csat.svg",
  Webform: "/assets/icons/gray/webform.svg",
  AllowedCallQueue: "/assets/icons/gray/allowed-call-queue.svg",
  WayCallerID: "/assets/icons/gray/3 way-callerID.svg",
  DialMethod: "/assets/icons/gray/dial-method.svg",
  CallerIDTime: "/assets/icons/gray/caller ID time.svg",
  CallerID: "/assets/icons/gray/caller ID.svg",
  Retries: "/assets/icons/gray/retries Time.svg",
  CPS: "/assets/icons/gray/CPS.svg",
  MOH: "/assets/icons/gray/MOH.svg",
  MaxRetries: "/assets/icons/gray/max Retries.svg",
  AllowedMessaging: "/assets/icons/gray/allowed-Messaging-Queue.svg",
  CustomerTimeout: "/assets/icons/gray/customer-timeout.svg",
  Code: "/assets/icons/gray/Code.svg",
  AreaCode: "/assets/icons/gray/area-code.svg",
  Comment: "/assets/icons/gray/comment.svg",
  EndTime: "/assets/icons/gray/end-time.svg",
  StartTime: "/assets/icons/gray/start-time.svg",
  ZoneTime: "/assets/icons/gray/time-zone.svg",
  URL: "/assets/icons/gray/URL.svg",
  Channel: "/assets/icons/gray/channel.svg",
  CallRetriesDisposition: "/assets/icons/gray/call-Retries-Disposition.svg",
  BroadcastType: "/assets/icons/gray/broadcast-type.svg",
  PromptFile: "/assets/icons/gray/prompt-file.svg",
  FromDigit: "/assets/icons/gray/from-digit.svg",
  Provider: "/assets/icons/gray/provider.svg",
  WhatsAppBusiness: "/assets/icons/gray/whatsapp-business.svg",
  Token: "/assets/icons/gray/token.svg",
  PhoneNumber: "/assets/icons/gray/phonenumber.svg",
  From: "/assets/icons/gray/from.svg",
  Port: "/assets/icons/gray/port.svg",
  Host: "/assets/icons/gray/host.svg",
  StatusName: "/assets/icons/gray/status-name.svg",
  CircleName: "/assets/icons/gray/circle-name.svg",
  DeviceName: "/assets/icons/gray/device-name.svg",
  OutboundProxy: "/assets/icons/gray/outbound-proxy.svg",
  RegProxy: "/assets/icons/gray/regProxy.svg",
  Ping: "/assets/icons/gray/ping.svg",
  RegTransport: "/assets/icons/gray/reg-Transport.svg",
  Extension: "/assets/icons/gray/extension.svg",
  ExpireSecond: "/assets/icons/gray/expireSecond.svg",
  ContactParam: "/assets/icons/gray/contact-params.svg",
  Codec:"/assets/icons/gray/Codec.svg",
  IP:"/assets/icons/Frames.svg",
  SetPrefix:"/assets/icons/Prefix.svg",




  Dashboard: "/assets/icons/gray/Dashboard.svg",
  TenantManager: "/assets/icons/gray/tenant-manager.svg",
  IncomingRules: "/assets/icons/gray/incoming-rules.svg",
  ManagementLead: "/assets/icons/gray/lead-management.svg",
  ContentCenter: "/assets/icons/gray/content-center.svg",
  BroadCasting: "/assets/icons/gray/broadcasting.svg",
  Message: "/assets/icons/gray/message.svg",
  Report: "/assets/icons/gray/report.svg",
  Settings: "/assets/icons/gray/settings.svg",
  Integrations: "/assets/icons/gray/integrations.svg",
  ManagerRole: "/assets/icons/gray/Manager role.svg",
  ManagerTenant: "/assets/icons/gray/TenantManager.svg",
  UserRoles: "/assets/icons/gray/User Role.svg",
  SIPTrunk: "/assets/icons/gray/SUP Trunk.svg",
  IPMaping: "/assets/icons/gray/IP Maping.svg",
  ClicktoCall: "/assets/icons/gray/Click to Call.svg",
  Conference: "/assets/icons/gray/Conference.svg",
  BlockInboundCalls: "/assets/icons/gray/Block Inbound Calls.svg",
  FeatureCode: "/assets/icons/gray/Feature Codes.svg",
  TimeCondition: "/assets/icons/gray/Time Condition.svg",
  RingGroup: "/assets/icons/gray/allowed Ring Group.svg",
  Lead: "/assets/icons/gray/Lead.svg",
  Followup: "/assets/icons/gray/Follow up.svg",




  // GRAY
  MoreGray: "/assets/icons/gray/more.svg",
  MoreHoriZontalGray: "/assets/icons/gray/more-horizontal.svg",
  LockGray: "/assets/icons/gray/lock.svg",
  EyeCloseGray: "/assets/icons/gray/eye-close.svg",
  CallGray: "/assets/icons/gray/call.svg",
  EmailGray: "/assets/icons/gray/email.svg",
  ClockGray: "/assets/icons/gray/clock.svg",
  SearchGray: "/assets/icons/gray/search.svg",
  CalendarGray: "/assets/icons/gray/calendar.svg",
  Broadcast: "/assets/icons/gray/broadcast.svg",
  Messaging: "/assets/icons/gray/messaging.svg",
  Remove: "/assets/icons/gray/remove.svg",
  Breakcode: "/assets/icons/gray/break-time.svg",
  Manager: "/assets/icons/gray/manager.svg",
  Integration: "/assets/icons/gray/integration.svg",
  Circle: "/assets/icons/gray/closeCircle.svg",


  // GREEN
  ArrowDownGreen: "/assets/icons/green/arrow-down.svg",
  HomeGreen: "/assets/icons/green/home.svg",
  PbxGreen: "/assets/icons/green/pbx.svg",
  AudioGreen: "/assets/icons/green/audio.svg",
  NotesGreen: "/assets/icons/green/notes.svg",
  ChatGreen: "/assets/icons/green/chat-notification.svg",
  LeadGroupGreen: "/assets/icons/green/lead-group.svg",
  LeadManagementGreen: "/assets/icons/green/lead-management.svg",
  LocationGreen: "/assets/icons/green/location.svg",
  TimeZoneGreen: "/assets/icons/green/timezone.svg",
  MinusCircleGreen: "/assets/icons/green/minus-cirlce.svg",
  PlusCircleGreen: "/assets/icons/green/plus-circle.svg",
  ArrowRightGreen: "/assets/icons/green/arrow-right.svg",
  CloseCircleGreen: "/assets/icons/green/close-circle.svg",
  VoiceMailGreen: "/assets/icons/green/voice-mail.svg",
  MicroPhoneGreen: "/assets/icons/green/microphone.svg",
  RemoteGreen: "/assets/icons/green/remote.svg",
  FollowUpGreen: "/assets/icons/green/followUp.svg",
  ClickToCallGreen: "/assets/icons/green/call-ring.svg",
  BroadcastGreen: "/assets/icons/green/broadcast.svg",
  BreakcodeGreen: "/assets/icons/green/break-time.svg",
  MessagingGreen: "/assets/icons/green/messaging.svg",
  ManagerGreen: "/assets/icons/green/manager.svg",
  IntegrationGreen: "/assets/icons/green/integration.svg",

  // USER - GREEN
  UserTenantGreen: "/assets/icons/green/tenant.svg",
  UserSipGreen: "/assets/icons/green/sip-profile.svg",
  UserGreen: "/assets/icons/green/user.svg",
  UserAudioGreen: "/assets/icons/green/user-audio.svg",
  UserRoleGreen: "/assets/icons/green/user-role.svg",
  UserAddGreen: "/assets/icons/green/user-add.svg",

  // CALL - GREEN
  CallTrunkGreen: "/assets/icons/green/trunk.svg",
  CallIncomingGreen: "/assets/icons/green/call-incoming.svg",
  SettingGreen: "/assets/icons/green/settings.svg",
  CallSipGreen: "/assets/icons/green/sip-call.svg",
  CallUserGreen: "/assets/icons/green/call-user.svg",
  CallingGreen: "/assets/icons/green/calling.svg",
  CallOutgoingGreen: "/assets/icons/green/call-out.svg",
  CallMenuGreen: "/assets/icons/green/call-menu.svg",
  CallOutGreen: "/assets/icons/green/call-out.svg",
  CallBlockGreen: "/assets/icons/green/call-block.svg",
  CallMissedGreen: "/assets/icons/green/call-missed.svg",

  // FILL - GREEN
  UserFillGreen: "/assets/icons/green/user-fill.svg",
  LockFillGreen: "/assets/icons/green/lock-fill.svg",
  MailFillGreen: "/assets/icons/green/mail-fill.svg",
  WebhookFillGreen: "/assets/icons/green/webhook.svg",

  // RED
  DeleteRed: "/assets/icons/red/delete.svg",
  SwitchRed: "/assets/icons/red/switch.svg",
  CloseCircleRed: "/assets/icons/red/close-circle.svg",
  stopRed: "/assets/icons/red/stop.svg",

  // IMAGES
  Search404: "/assets/images/Search404.svg",
  SearchImage: "/assets/images/search.svg",
  LogoImage: "/assets/images/logo.svg",
  SmallLogoImage: "/assets/images/SmallLogo.png",
  MenuLogoExpandedImage: "/assets/images/ringingo_expanded_logo.svg",
  MenuLogoCollapsedImage: "/assets/images/ringingo_collapsed_logo.svg",
  NoRecordFound:"/assets/images/no-records-new.svg",


  // OTHERS
  CallDashboard: "/assets/icons/others/call-dashboard1.svg",
  CallIncomingDashboard: "/assets/icons/green/call-incoming-dark1.svg",
  CallOutgoingDashboard: "/assets/icons/others/call-outgoing-dashboard1.svg",
  CallCloseDashboard: "/assets/icons/others/call-close-dashboard1.svg",
  CallErrorDashboard: "/assets/icons/others/call-error-dashboard1.svg",

  AudioDashboard: "/assets/icons/others/audio-dashboard.svg",
  CallNotesDashboard: "/assets/icons/others/call-notes-dashboard.svg",
  CallUsersDashboard: "/assets/icons/others/call-users-dashboard.svg",
  CallingDashborad: "/assets/icons/others/calling-dashboard.svg",
  UserAudioDashboard: "/assets/icons/others/user-audio-dashboard.svg",
  UserRemoveDashboard: "/assets/icons/others/user-remove-dashboard.svg",

  ActiveCall: "/assets/icons/others/active-call.svg",
  CallRinging: "/assets/icons/others/call-ringing.svg",
  AwaitingAgent: "/assets/icons/others/awaiting-agent.svg",
  AgentLogin: "/assets/icons/others/agent-login.svg",
  AgentWaiting: "/assets/icons/others/agent-waiting.svg",
  AgentOnCall: "/assets/icons/others/agent-on-call.svg",
  AgentOnBreak: "/assets/icons/others/agent-on-break.svg",
  FiloverTrunk2:"/assets/icons/gray/FailOver Trunk 2.svg",
  FiloverTrunk1:"/assets/icons/gray/FailOver Trunk1.svg",
  Length:"/assets/icons/Lenght.svg",
  

  ArrowDropDown: "/assets/icons/others/arrow-drop-down.svg",
  // Domain:"/assets/icons/domian.svg",





  call_inbond: "/assets/icons/others/call-inbond.svg",
  call_outbound: "/assets/icons/others/call-outbound.svg",
  call_missed: "/assets/icons/others/call-missed.svg",
  Frame: "/assets/icons/Frame.svg",
  sms: "/assets/icons/sms.svg",
  whatsapp: "/assets/icons/whatsapp.svg",
  ChevronRight: "/assets/icons/chevron-right.svg"
};

const Photo = (
  props: Omit<IconProps, "tooltip" | "alt" | "name"> & {
    alt: string;
    src: string;
  }
) => {
  const { className = "", src, alt, width, height, onClick } = props;
  return (
    <>
      {width || height ? (
        <Image
          className={`${className} ${onClick ? "cursor-pointer" : ""}`}
          src={src}
          alt={alt}
          width={width || 10}
          height={height || 10}
          onClick={onClick}
          unoptimized
        />
      ) : (
        <div
          className={`${className} ${onClick ? "cursor-pointer" : ""} relative`}
          onClick={onClick}
        >
          <Legacy src={src} alt={alt} layout="fill" />
        </div>
      )}
    </>
  );
};
const Icon = (props: IconProps) => {
  const { className = "", name, alt, width, height, tooltip, onClick } = props;

  return (
    <>
      {tooltip ? (
        <div
          className={`${className} group relative inline-flex items-center justify-center ${onClick ? "cursor-pointer" : ""
            }`}
          onClick={onClick}
        >
          {/* Tooltip */}
          <div className="absolute z-20 bottom-[5px] mb-2 hidden group-hover:flex flex-col items-center transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100">
            <span className="px-3 py-1 text-xs  text-white bg-secondary rounded shadow-md whitespace-nowrap">
              {tooltip}
            </span>
            <div className="w-2.5 h-2.5 rotate-45 bg-secondary mt-[-4px]"></div>
          </div>

          {/* Icon */}
          <Photo
            className="max-w-[unset] transition-transform duration-150 group-hover:scale-105"
            src={icons[name]}
            alt={alt ?? name ?? "Icon"}
            width={width}
            height={height}
          />
        </div>
      ) : (
        <Photo
          className={`${className} max-w-[unset] ${onClick ? "cursor-pointer" : ""
            } transition-transform duration-150 hover:scale-105`}
          src={icons[name]}
          alt={alt ?? name}
          width={width}
          height={height}
          onClick={onClick}
        />
      )}
    </>
  );
};

export default Icon;
