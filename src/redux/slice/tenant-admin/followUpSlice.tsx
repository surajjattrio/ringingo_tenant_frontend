import { useMemo } from "react";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// PROJECT IMPORTS
import {
  followUpAdd,
  followUpDelete,
  followUpEdit,
  followUpListGet,
  followUpSearch,
} from "@/redux/services/tenant-admin/followUpService";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";

// TYPES
import { FilterTypes } from "@/types/filterTypes";

interface InitialState {
  followUpList: any;
  singleFollowUpData: any;
}

/* ============================== FOLLOW UP SLICE ============================== */

const initialState: InitialState = {
  followUpList: {},
  singleFollowUpData: {},
};

export const getFollowUpList = createAsyncThunk(
  "follow-up/List",
  async (params: FilterTypes) => {
    return await followUpListGet(params);
  }
);

export const searchFollowUpList = createAsyncThunk(
  "follow-up/search",
  async (payload: any) => {
    return await followUpSearch(payload);
  }
);

export const addFollowUp = createAsyncThunk(
  "follow-up/add",
  async (payload: any) => {
    return await followUpAdd(payload);
  }
);

export const editFollowUp = createAsyncThunk(
  "follow-up/edit",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await followUpEdit(id, rest);
  }
);

export const deleteFollowUp = createAsyncThunk(
  "follow-up/delete",
  async (id: string) => {
    return await followUpDelete(id);
  }
);

const mapIsReadedToLabel = (is_readed: any) => {
  switch (is_readed) {
      case "0":
          return "Upcoming";
      case "1":
          return "Past Due";
      case "2":
          return "Completed";
      default:
          return ""; // Handle unknown status
  }
};

const followUpSlice = createSlice({
  name: "followUp",
  initialState,
  reducers: {
    updateSingleFollowUpData: (state, action) => {
      state.singleFollowUpData = action.payload ? action.payload : {};
    },
    clearFollowUpSlice: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      getFollowUpList.fulfilled,
      (state, action: PayloadAction<any>) => {
        const newData =
          typeof action.payload === "string" ? [] : action.payload;
        newData?.data?.map((val: any) => {
          (val.uuid = val?.follow_up_uuid),
            (val.fullName =
              val.lead_details.length && val.lead_details[0].first_name
                ? val.lead_details[0].first_name +
                " " +
                (val.lead_details[0].last_name || "")
                : "");
          val.PhoneNumber = val.lead_details.length
            ? val.lead_details[0].phone_number
            : "";
          val.userName = val?.user?.[0]?.username || "";
          val.fullname = val?.user?.[0]?.fullname || "";
          val.followUpStatus = mapIsReadedToLabel(val.is_readed);
        });
        state.followUpList = newData;
      }
    );
    builder.addCase(
      searchFollowUpList.fulfilled,
      (state, action: PayloadAction<any>) => {
        const newData =
          typeof action.payload === "string" ? [] : action.payload;
        newData?.data?.map((val: any) => {
          val.fullName = val?.lead_details?.length
            ? val?.lead_details[0]?.first_name
              ? val?.lead_details[0]?.first_name
              : "" + " " + val?.lead_details[0]?.last_name
                ? val.lead_details[0].last_name || ""
                : ""
            : "";
          val.PhoneNumber = val?.lead_details?.length
            ? val?.lead_details[0]?.phone_number
            : "";
          val.userName = val?.user?.[0]?.username || "";
          val.fullname = val?.user?.[0]?.fullname || "";
          val.followUpStatus = mapIsReadedToLabel(val.is_readed);
        });
        state.followUpList = newData;
      }
    );
  },
});

export default followUpSlice.reducer;
export const { clearFollowUpSlice, updateSingleFollowUpData } =
  followUpSlice.actions;

export const selectFollowUpList = (state: RootState) =>
  state.followUp.followUpList;
export const useFollowUpList = () => {
  const followUpList = useAppSelector(selectFollowUpList);
  return useMemo(() => followUpList, [followUpList]);
};

export const selectSingleFollowUp = (state: RootState) =>
  state.followUp.singleFollowUpData;
export const useSingleFollowUp = () => {
  const singleFollowUpData = useAppSelector(selectSingleFollowUp);
  return useMemo(() => singleFollowUpData, [singleFollowUpData]);
};
