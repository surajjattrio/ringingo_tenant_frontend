"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// PROJECT IMPORT
import tenantSlice from "./slice/master-admin/tenantSlice";
import dispositionSlice from "./slice/master-admin/dispositionSlice";
import commonSlice from "./slice/commonSlice";
import roleSlice from "./slice/master-admin/roleSlice";
import countrySlice from "./slice/master-admin/countrySlice";
import timezoneSlice from "./slice/master-admin/timezoneSlice";
import sipProfileSlice from "./slice/master-admin/sipProfileSlice";
import trunkSlice from "./slice/master-admin/trunkSlice";
import userSlice from "./slice/tenant-admin/userSlice";
import sipDevicesSlice from "./slice/tenant-admin/sipDevicesSlice";
import didSlice from "./slice/tenant-admin/didSlice";
import ringSlice from "./slice/tenant-admin/ringSlice";
import ivrSlice from "./slice/tenant-admin/ivrSlice";
import promptsSlice from "./slice/tenant-admin/promptsSlice";
import tenantRoleSlice from "./slice/tenant-admin/tenantRoleSlice";
import userRoleSlice from "./slice/tenant-admin/userRoleSlice";
import callQueueSlice from "./slice/tenant-admin/callQueueSlice";
import timeConditionSlice from "./slice/tenant-admin/timeConditionSlice";
import userGroupSlice from "./slice/tenant-admin/userGroupSlice";
import tenantTrunkSlice from "./slice/tenant-admin/tenantTrunkSlice";
import featureCodeSlice from "./slice/tenant-admin/featureCodeSlice";
import tenantOutgoingSlice from "./slice/tenant-admin/tenantOutgoingSlice";
import conferenceSlice from "./slice/tenant-admin/conferenceSlice";
import leadManagementSlice from "./slice/tenant-admin/leadManagementSlice";
import cdrsSlice from "./slice/master-admin/cdrsSlice";
import liveCallSlice from "./slice/master-admin/liveCallSlice";
import tenantLiveCallSlice from "./slice/tenant-admin/tenantLiveCallSlice";
import tenantDispositionSlice from "./slice/tenant-admin/tenantDispositionSlice";
import tenantCdrsSlice from "./slice/tenant-admin/tenantCdrsSlice";
import tenantDashboardSlice from "./slice/tenant-admin/tenantDashboardSlice";
import dashboardSlice from "./slice/master-admin/dashboardSlice";
import ipMappingSlice from "./slice/tenant-admin/ipMappingSlice";
import outgoingSlice from "./slice/master-admin/outgoingSlice";
import outboundSlice from "./slice/tenant-admin/outboundSlice";
import inboundSlice from "./slice/tenant-admin/inboundSlice";
import blendedSlice from "./slice/tenant-admin/blendedSlice";
import dncSlice from "./slice/tenant-admin/dncSlice";
import stateSlice from "./slice/tenant-admin/manageStateSlice";
import areaCodeSlice from "./slice/tenant-admin/manageAreaCodeSlice";
import recordingSlice from "./slice/tenant-admin/recordingSlice";
import voicemailSlice from "./slice/tenant-admin/voiceMailSlice";
import leadGroupSlice from "./slice/tenant-admin/leadGroupSlice";
import callerIdGroupSlice from "./slice/tenant-admin/callerIdGroupSlice";
import userPerformanceSlice from "./slice/tenant-admin/userPerformanceSlice";
import profileSlice from "./slice/profileSlice";
import followUpSlice from "./slice/tenant-admin/followUpSlice";
import realtimeReportSlice from "./slice/tenant-admin/realtimeReportSlice";
import adminDidSlice from "./slice/master-admin/adminDidSlice";
import adminIpMappingSlice from "./slice/master-admin/adminIpMappingSlice";
import clickToCallSlice from "./slice/tenant-admin/clickToCallSlice";
import blockInboundCampaignSlice from "./slice/tenant-admin/blockInboundCampaignSlice";
import voiceBroadcastSlice from "./slice/tenant-admin/voiceBroadcastSlice";
import leadReportSlice from "./slice/tenant-admin/leadReportSlice";
import tenantReportSlice from "./slice/master-admin/tenantReportSlice";
import campaignReportSlice from "./slice/tenant-admin/campaignReportSlice";
import voiceBroadcastReportSlice from "./slice/tenant-admin/voiceBroadcastReportSlice";
import managerSlice from "./slice/tenant-admin/managerSlice";
import managerRoleSlice from "./slice/tenant-admin/managerRoleSlice";
import tenantLeadStatusSlice from "./slice/tenant-admin/leadStatusSlice";
import breakCodeSlice from "./slice/tenant-admin/breakCodeSlice";
import telecomCircleSlice from "./slice/tenant-admin/telecomCircleSlice";
import missedCallSlice from "./slice/tenant-admin/missedCallSlice";
import loginLogoutSlice from "./slice/tenant-admin/loginLogoutSlice";
import messagingChannelSlice from "./slice/tenant-admin/messagingChannelSlice";
import messagingQueueSlice from "./slice/tenant-admin/messagingQueueSlice";
import webFormSlice from "./slice/tenant-admin/webFormSlice";
import customFieldsSlice from "./slice/tenant-admin/customFieldsSlice";
import stickyAgentReportSlice from "./slice/tenant-admin/stickyAgentReportSlice";
import didReportSlice from "./slice/tenant-admin/didReportSlice";
import callQueueReportSlice from "./slice/tenant-admin/callQueueReportSlice";
import droppedCallsReportSlice from "./slice/tenant-admin/droppedCallsSlice";
import accountDashboardSlice from "./slice/tenant-admin/accountDashboardSlice";
import omniChannelReportSlice from "./slice/tenant-admin/omniChannelReportSlice"
import tenantCsatReportSlice from "./slice/tenant-admin/tenantCsatSlice";
import scheduleReportSlice from "./slice/tenant-admin/scheduleReportSlice";

// REDUCERS
const rootReducer = combineReducers({
  common: commonSlice,
  profile: profileSlice,

  // MASTER ADMIN
  tenant: tenantSlice,
  disposition: dispositionSlice,
  role: roleSlice,
  country: countrySlice,
  timezone: timezoneSlice,
  sipProfile: sipProfileSlice,
  trunk: trunkSlice,
  outgoing: outgoingSlice,
  cdrs: cdrsSlice,
  liveCall: liveCallSlice,
  adminDid: adminDidSlice,
  adminIpMapping: adminIpMappingSlice,
  tenantReport: tenantReportSlice,

  // TENANT ADMIN
  user: userSlice,
  sipDevices: sipDevicesSlice,
  did: didSlice,
  ring: ringSlice,
  messagingChannel: messagingChannelSlice,
  messagingQueue: messagingQueueSlice,
  ivr: ivrSlice,
  tenantRole: tenantRoleSlice,
  userRole: userRoleSlice,
  prompts: promptsSlice,
  callQueue: callQueueSlice,
  timeCondition: timeConditionSlice,
  userGroup: userGroupSlice,
  tenantTrunk: tenantTrunkSlice,
  featureCode: featureCodeSlice,
  tenantOutgoing: tenantOutgoingSlice,
  conference: conferenceSlice,
  lead: leadManagementSlice,
  tenantCdrs: tenantCdrsSlice,
  tenantLiveCall: tenantLiveCallSlice,
  tenantDashboard: tenantDashboardSlice,
  dashboard: dashboardSlice,
  tenantDisposition: tenantDispositionSlice,
  ipMapping: ipMappingSlice,
  outbound: outboundSlice,
  inbound: inboundSlice,
  blended: blendedSlice,
  dnc: dncSlice,
  state: stateSlice,
  areaCode: areaCodeSlice,
  recording: recordingSlice,
  voiceMail: voicemailSlice,
  leadGroup: leadGroupSlice,
  callerIdGroup: callerIdGroupSlice,
  userPerformance: userPerformanceSlice,
  followUp: followUpSlice,
  realtimeReport: realtimeReportSlice,
  clickToCall: clickToCallSlice,
  blockInboundCampaign: blockInboundCampaignSlice,
  voiceBroadcast: voiceBroadcastSlice,
  leadReport: leadReportSlice,
  campaignReport: campaignReportSlice,
  voiceBroadcastReport: voiceBroadcastReportSlice,
  manager: managerSlice,
  managerRole: managerRoleSlice,
  tenantLeadStatus: tenantLeadStatusSlice,
  breakCode: breakCodeSlice,
  telecomCircle: telecomCircleSlice,
  missedCall: missedCallSlice,
  loginLogout: loginLogoutSlice,
  webForm: webFormSlice,
  customFields: customFieldsSlice,
  stickyAgentReport: stickyAgentReportSlice,
  didReport: didReportSlice,
  callQueueReport: callQueueReportSlice,
  droppedCalls: droppedCallsReportSlice,
  accountDashboard: accountDashboardSlice,
  omniChannelReport: omniChannelReportSlice,
  tenantCsatReport: tenantCsatReportSlice,
  scheduleReport: scheduleReportSlice


});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ============================== STORE ============================== */

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/* ============================== PERSIST-STORE ============================== */

export const persistor = persistStore(store);

/* ============================== TYPES ============================== */

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
