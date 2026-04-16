import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";


// TYPES
interface InitialState {
  isDrawerOpen: boolean;
  isDrawerHover: boolean;
  openSubItems: string;
  sideBarData: any;
  activeTab: number;
  time: number;
  managerDetail: any;
  callScreen: string;
  showCallingIcon: boolean;
  isShowCallDuration: boolean;
  callerNumber: string;
  dialNumber: string | null;
  addNoteId: string | null;
  addLeadNoteId: string | null;
  startRegistration: boolean;
  setCallType:string;
  agentName:string;
  headerValue:string;
}

const initialState: InitialState = {
  isDrawerOpen: true,
  isDrawerHover: false,
  openSubItems: "",
  sideBarData: {},
  managerDetail: {},
  activeTab: 0,
  time: 30,
  callScreen: "",
  showCallingIcon: false,
  isShowCallDuration: false,
  callerNumber: "",
  dialNumber: null,
  addNoteId: null,
  addLeadNoteId: null,
  startRegistration: false,
  setCallType:"",
  agentName:"",
  headerValue:""
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    openDrawer(state, action: PayloadAction<any>) {
      state.isDrawerOpen = action.payload;
    },
    toggleDrawer: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    onHoverDrawer: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    updateOpenSubItem: (state, action) => {
      state.openSubItems = action.payload ? action.payload : "";
    },
    updateSideBarData: (state, action) => {
      state.sideBarData = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setManagerDetail: (state, action) => {
      state.managerDetail = action.payload;
    },
    setTimes: (state, action) => {
      state.time = action.payload;
    },
    setCallScreen: (state, action) => {
      state.callScreen = action.payload;
    },
    setShowCallingIcon: (state, action) => {
      state.showCallingIcon = action.payload;
    },
    setIsShowCallDuration: (state, action) => {
      state.isShowCallDuration = action.payload;
    },
    setCallerNumber: (state, action) => {
      state.callerNumber = action.payload;
    },
    onDial: (state, action) => {
      state.dialNumber = action.payload;
    },
    onSetAddNoteId: (state, action) => {
      state.addNoteId = action.payload;
    },
    onAddLeadNoteId: (state, action) => {
      state.addLeadNoteId = action.payload;
    },
    onSetStartRegistration: (state, action) => {
      state.startRegistration = action.payload;
    },
    onSetCallType: (state, action) => {
      state.setCallType = action.payload;
    },
    setAgentName: (state, action) => {
      state.agentName = action.payload;
    },
    clearCommonSlice: () => initialState,
    setHeaderValue: (state, action) => {
      state.headerValue = action.payload;
    },
  },
});

export default commonSlice.reducer;

export const {
  openDrawer,

  toggleDrawer,
  updateOpenSubItem,
  updateSideBarData,
  setActiveTab,
  clearCommonSlice,
  setManagerDetail,
  setTimes,
  setCallScreen,
  setShowCallingIcon,
  setIsShowCallDuration,
  setCallerNumber,
  onDial,
  onSetAddNoteId,
  onAddLeadNoteId,
  onSetStartRegistration,
  onSetCallType,
  setAgentName,
  setHeaderValue
} = commonSlice.actions;

// export const selectDrawerOpen = (state: RootState) => state.common.isDrawerOpen;
// export const useDrawerOpen = () => {
//   const isDrawerOpen = useAppSelector(selectDrawerOpen);
//   return useMemo(() => isDrawerOpen, [isDrawerOpen]);
// };
export const selectDrawerOpen = (state: RootState) => state.common.isDrawerOpen;
export const useDrawerOpen = () => {
  const isdrawerOpen = useAppSelector(selectDrawerOpen);
  return useMemo(() => isdrawerOpen, [isdrawerOpen]);
};


export const selectOpenSubItems = (state: RootState) =>
  state.common.openSubItems;
export const useOpenSubItems = () => {
  const openSubItems = useAppSelector(selectOpenSubItems);
  return useMemo(() => openSubItems, [openSubItems]);
};

export const selectSideBarData = (state: RootState) => state.common.sideBarData;
export const useSideBarData = () => {
  const sideBarData = useAppSelector(selectSideBarData);
  return useMemo(() => sideBarData, [sideBarData]);
};

export const selectActiveTab = (state: RootState) => state.common.activeTab;
export const useActiveTab = () => {
  const activeTab = useAppSelector(selectActiveTab);
  return useMemo(() => activeTab, [activeTab]);
};

export const selectTime = (state: RootState) => state.common.time;
export const useTime = () => {
  const time = useAppSelector(selectTime);
  return useMemo(() => time, [time]);
};

export const selectManagerDetails = (state: RootState) =>
  state.common.managerDetail;
export const useManagerDetails = () => {
  const managerDetail = useAppSelector(selectManagerDetails);
  return useMemo(() => managerDetail, [managerDetail]);
};

export const selectCallScreen = (state: RootState) => state.common.callScreen;
export const useCallScreen = () => {
  const callScreen = useAppSelector(selectCallScreen);
  return useMemo(() => callScreen, [callScreen]);
};

export const selectShowCallingIcon = (state: RootState) =>
  state.common.showCallingIcon;
export const useShowCallingIcon = () => {
  const showCallingIcon = useAppSelector(selectShowCallingIcon);
  return useMemo(() => showCallingIcon, [showCallingIcon]);
};

export const selectIsShowCallDuration = (state: RootState) =>
  state.common.isShowCallDuration;
export const useIsShowCallDuration = () => {
  const isShowCallDuration = useAppSelector(selectIsShowCallDuration);
  return useMemo(() => isShowCallDuration, [isShowCallDuration]);
};

export const selectCallerNumber = (state: RootState) =>
  state.common.callerNumber;
export const useCallerNumber = () => {
  const callerNumber = useAppSelector(selectCallerNumber);
  return useMemo(() => callerNumber, [callerNumber]);
};

export const selectDialNumber = (state: RootState) => state.common.dialNumber;
export const useDialNumber = () => {
  const dialNumber = useAppSelector(selectDialNumber);
  return useMemo(() => dialNumber, [dialNumber]);
};

export const selectAddNoteId = (state: RootState) => state.common.addNoteId;
export const useAddNoteId = () => {
  const addNoteId = useAppSelector(selectAddNoteId);
  return useMemo(() => addNoteId, [addNoteId]);
};

export const selectAddLeadNoteId = (state: RootState) =>
  state.common.addLeadNoteId;
export const useAddLeadNoteId = () => {
  const addLeadNoteId = useAppSelector(selectAddLeadNoteId);
  return useMemo(() => addLeadNoteId, [addLeadNoteId]);
};

export const selectStartRegistration = (state: RootState) =>
  state.common.startRegistration;
export const useStartRegistration = () => {
  const startRegistration = useAppSelector(selectStartRegistration);
  return useMemo(() => startRegistration, [startRegistration]);
};

export const selectCallType = (state: RootState) =>
  state.common.setCallType;
export const useCallType = () => {
  const setCallType = useAppSelector(selectCallType);
  return useMemo(() => setCallType, [setCallType]);
};

export const selectAgentName = (state: RootState) =>
  state.common.agentName;
export const useAgentName = () => {
  const agentName = useAppSelector(selectAgentName);
  return useMemo(() => agentName, [agentName]);
};

export const selectHeaderValue = (state: RootState) =>
  state.common.headerValue;
export const useHeaderValue = () => {
  const headerValue = useAppSelector(selectHeaderValue);
  return useMemo(() => headerValue, [headerValue]);
};