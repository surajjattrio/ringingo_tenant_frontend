import { useMemo } from "react";

// PROJECT IMPORT
import {
  createSmtpConfiguration,
  createWebHook,
  getWebHook,
  smtpConfiguration,
  updateSmtpConfiguration,
} from "../services/profileServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";

// TYPES
interface InitialState {
  smtpConfiguration: any;
}

const initialState: InitialState = {
  smtpConfiguration: {},
};

export const smtpConfigurationGet = createAsyncThunk("smtp/get", async () => {
  return await smtpConfiguration();
});

export const smtpConfigurationCreate = createAsyncThunk(
  "smtp/create",
  async (payload: any) => {
    return await createSmtpConfiguration(payload);
  }
);

export const smtpConfigurationUpdate = createAsyncThunk(
  "smtp/update",
  async (payload: any) => {
    return await updateSmtpConfiguration(payload);
  }
);

export const webHookCreate = createAsyncThunk(
  "web-hook/create",
  async (payload: any) => {
    return await createWebHook(payload);
  }
);

export const webHookGet = createAsyncThunk(
  "web-hook/get",
  async (id: string) => {
    return await getWebHook(id);
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(smtpConfigurationGet.fulfilled, (state, action) => {
      // state.smtpConfiguration = action.payload
    });
  },
});

export default profileSlice.reducer;

export const selectSmtpConfiguration = (state: RootState) =>
  state.profile.smtpConfiguration;
export const useSmtpConfiguration = () => {
  const smtpConfiguration = useAppSelector(selectSmtpConfiguration);
  return useMemo(() => smtpConfiguration, [smtpConfiguration]);
};
