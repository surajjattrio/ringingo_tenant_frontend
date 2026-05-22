"use client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getInboundCallDebugSnapshot, getInboundCallDebugFormOptions } from "@/redux/services/tenant-admin/inboundCallDebugServices";
import { RootState } from "../../store";
import { useMemo } from "react";
import { useAppSelector } from "../../hooks";

interface InboundCallDebugState {
  loading: boolean;
  error: string | null;
  snapshot: any | null;
  formOptions: {
    campaigns: { uuid: string; name: string }[];
    extensions: { uuid: string; username: string }[];
    users: { uuid: string; username: string; fullname: string }[];
    queues: { uuid: string; name: string }[];
  } | null;
  formOptionsLoading: boolean;
}

const initialState: InboundCallDebugState = {
  loading: false,
  error: null,
  snapshot: null,
  formOptions: null,
  formOptionsLoading: false,
};

export const fetchInboundCallDebugSnapshot = createAsyncThunk(
  "inboundCallDebug/fetchSnapshot",
  async ( params: {
    campaign_uuid: string;
    extension?: string;
    user_uuid?: string;
    call_queue_uuid?: string;
  } ) => {
    return await getInboundCallDebugSnapshot( params );
  }
);

export const fetchInboundCallDebugFormOptions = createAsyncThunk(
  "inboundCallDebug/fetchFormOptions",
  async ( params?: { campaign_uuid?: string } ) => {
    return await getInboundCallDebugFormOptions( params );
  }
);

const inboundCallDebugSlice = createSlice( {
  name: "inboundCallDebug",
  initialState,
  reducers: {
    clearInboundCallDebug: ( state ) => {
      state.snapshot = null;
      state.error = null;
    },
  },
  extraReducers: ( builder ) => {
    builder
      .addCase( fetchInboundCallDebugSnapshot.pending, ( state ) => {
        state.loading = true;
        state.error = null;
      } )
      .addCase( fetchInboundCallDebugSnapshot.fulfilled, ( state, action: PayloadAction<any> ) => {
        state.loading = false;
        const body = action.payload;
        state.snapshot = body?.data ?? body ?? null;
      } )
      .addCase( fetchInboundCallDebugSnapshot.rejected, ( state, action ) => {
        state.loading = false;
        state.error = action.error?.message || "Request failed";
      } )
      .addCase( fetchInboundCallDebugFormOptions.pending, ( state ) => {
        state.formOptionsLoading = true;
      } )
      .addCase( fetchInboundCallDebugFormOptions.fulfilled, ( state, action: PayloadAction<any> ) => {
        state.formOptionsLoading = false;
        const body = action.payload;
        state.formOptions = body?.data ?? body ?? null;
      } )
      .addCase( fetchInboundCallDebugFormOptions.rejected, ( state ) => {
        state.formOptionsLoading = false;
      } );
  },
} );

export const { clearInboundCallDebug } = inboundCallDebugSlice.actions;
export default inboundCallDebugSlice.reducer;

export const selectInboundCallDebugSnapshot = ( state: RootState ) =>
  state.inboundCallDebug.snapshot;
export const selectInboundCallDebugLoading = ( state: RootState ) =>
  state.inboundCallDebug.loading;
export const selectInboundCallDebugError = ( state: RootState ) =>
  state.inboundCallDebug.error;
export const selectInboundCallDebugFormOptions = ( state: RootState ) =>
  state.inboundCallDebug.formOptions;
export const selectInboundCallDebugFormOptionsLoading = ( state: RootState ) =>
  state.inboundCallDebug.formOptionsLoading;

export const useInboundCallDebugSnapshot = () => {
  const snapshot = useAppSelector( selectInboundCallDebugSnapshot );
  return useMemo( () => snapshot, [ snapshot ] );
};
