import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  createSipDevices,
  deleteSipDevices,
  getAllSipDevices,
  searchSipDevices,
  singleSipDevices,
  sipDevices,
  updateOtherFeatures,
  updateSipDevices,
  updateSipDevicesStatus,
} from "@/redux/services/tenant-admin/sipDevicesServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
  isLoading: boolean;
  sipDevicesData: any;
  sipOptions: OptionTypes[];
  sipNameOptions: OptionTypes[];
}

const initialState: InitialState = {
  isLoading: false,
  sipDevicesData: {},
  sipOptions: [],
  sipNameOptions: [],
};

export const sipDevicesGet = createAsyncThunk(
  "sipDevices/get",
  async (params: any) => {
    return await sipDevices(params);
  }
);

export const sipDevicesSingleGet = createAsyncThunk(
  "sipDevices/single-get",
  async (params: any) => {
    return await singleSipDevices(params);
  }
);

export const sipDevicesSearch = createAsyncThunk(
  "sipDevices/search",
  async (params: any) => {
    return await searchSipDevices(params);
  }
);

export const sipDevicesCreate = createAsyncThunk(
  "sipDevices/create",
  async (payload: any) => {
    return await createSipDevices(payload);
  }
);

export const sipDevicesUpdate = createAsyncThunk(
  "sipDevices/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateSipDevices(id, rest);
  }
);

export const sipDevicesUpdateStatus = createAsyncThunk(
  "sipDevices-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateSipDevicesStatus(id, rest);
  }
);

export const sipDevicesDelete = createAsyncThunk(
  "sipDevices/delete",
  async (id: string) => {
    return await deleteSipDevices(id);
  }
);

export const otherFeaturesUpdate = createAsyncThunk(
  "user/otherfeatures",
  async (payload: any) => {
    const { id, feature, ...rest } = payload;
    return await updateOtherFeatures(id, feature, rest);
  }
);

export const sipOptionsGet = createAsyncThunk("sipDevices/getAll", async () => {
  return await getAllSipDevices();
});

export const sipNameOptionsGet = createAsyncThunk(
  "sip-name-options/get",
  async () => {
    return await getAllSipDevices();
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;
  const newData = data?.map((val: any) => ({
      ...val,
      user_name: val?.user?.[0]?.username || "",
  }));
  return { data: newData, count };
};

const sipDevicesSlice = createSlice({
  name: "sipDevices",
  initialState,
  reducers: {
    clearSipDevices: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sipDevicesGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(sipDevicesGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.sipDevicesData = prepareData(action.payload);
        state.isLoading = false;
      })
      .addCase(sipDevicesGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(
        sipDevicesSearch.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        sipDevicesSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.sipDevicesData = prepareData(action.payload);
          state.isLoading = false;
        }
      )
      .addCase(
        sipDevicesSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      sipOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        state.sipOptions = data?.map((val: any) => ({
          value: val?.uuid,
          label: `${val?.device_name} (${val?.username})`,
          user_uuid: val?.user_uuid
        })) || []
      }
    );

    builder.addCase(
      sipNameOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        const newData = data?.map((val: any) => ({
          value: val?.username,
          label: `${val?.device_name} (${val?.username})`,
          user_uuid: val?.user_uuid
        }));
        state.sipNameOptions = newData;
      }
    );
  },
});

export default sipDevicesSlice.reducer;
export const { clearSipDevices } = sipDevicesSlice.actions;

export const selectIsLoading = (state: RootState) => state.sipDevices.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectSipDevices = (state: RootState) =>
  state.sipDevices.sipDevicesData;
export const useSipDevicesData = () => {
  const sipDevicesData = useAppSelector(selectSipDevices);
  return useMemo(() => sipDevicesData, [sipDevicesData]);
};

export const selectSipOptions = (state: RootState) =>
  state.sipDevices.sipOptions;
export const useSipOptions = () => {
  const options = useAppSelector(selectSipOptions);
  return useMemo(() => options, [options]);
};

export const selectSipNameOptions = (state: RootState) =>
  state.sipDevices.sipNameOptions;
export const useSipNameOptions = () => {
  const options = useAppSelector(selectSipNameOptions);
  return useMemo(() => options, [options]);
};
