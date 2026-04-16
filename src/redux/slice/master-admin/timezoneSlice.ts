import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  timezone,
  allTimezone,
  createTimezone,
  deleteTimezone,
  searchTimezone,
  singleTimezone,
  updateTimezone,
  updateTimezoneStatus,
} from "../../services/master-admin/timezoneService";

interface InitialState {
  isLoading: boolean;
  timezoneData: any;
  singleTimezone: any;
  allTimezoneData: any;
  timezoneOptions: any;
  countryWisetimezoneData: any;
}

const initialState: InitialState = {
  isLoading: false,
  timezoneData: [],
  singleTimezone: {},
  allTimezoneData: [],
  timezoneOptions: [],
  countryWisetimezoneData: [],
};

export const timezoneGet = createAsyncThunk(
  "timezone/get",
  async (params: any) => {
    return await timezone(params);
  }
);

export const timezoneCountryWiseGet = createAsyncThunk(
  "timezone-country-wise/get",
  async (params: any) => {
    return await timezone(params);
  }
);

export const timezoneSingleGet = createAsyncThunk(
  "timezone/single-get",
  async (id: string) => {
    return await singleTimezone(id);
  }
);

export const timezoneSearch = createAsyncThunk(
  "timezone/search",
  async (payload: any) => {
    return await searchTimezone(payload);
  }
);

export const timezoneCreate = createAsyncThunk(
  "timezone/create",
  async (payload: any) => {
    return await createTimezone(payload);
  }
);

export const timezoneUpdate = createAsyncThunk(
  "timezone/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTimezone(id, rest);
  }
);

export const timezoneStatusUpdate = createAsyncThunk(
  "timezone-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTimezoneStatus(id, rest);
  }
);

export const timezoneDelete = createAsyncThunk(
  "timezone/delete",
  async (id: string) => {
    return await deleteTimezone(id);
  }
);

export const timezoneOptionsGet = createAsyncThunk(
  "timezone-options/getAll",
  async () => {
    return await allTimezone();
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;
  const newData = data?.map((val: any) => ({
    ...val,
    country_name: val?.country?.[0]?.country || "",
  }));
  return { data: newData, count }
}

const timezoneSlice = createSlice({
  name: "timezone",
  initialState,
  reducers: {
    clearTimezone: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(timezoneGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(timezoneGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.timezoneData = prepareData(action.payload)
        state.isLoading = false;
      })
      .addCase(timezoneGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(timezoneSearch.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(
        timezoneSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.timezoneData = prepareData(action.payload)
          state.isLoading = false;
        }
      )
      .addCase(timezoneSearch.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder.addCase(
      timezoneOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data =
          action.payload?.data?.length ? action.payload?.data : [];
        state.timezoneOptions = data?.map((val: any) => ({
          value: val.uuid,
          label: `${val.timezone_name}: ${val.gmttime}`,
        }));
      }
    );

    builder.addCase(
      timezoneCountryWiseGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data?.length ? action.payload?.data : [];
        state.countryWisetimezoneData = data?.map((val: any) => ({
          value: val.uuid,
          label: `${val.timezone_name}: ${val.gmttime}`,
        }));
      }
    );
  },
});

export default timezoneSlice.reducer;
export const { clearTimezone } = timezoneSlice.actions;

export const selectIsLoading = (state: RootState) => state.timezone.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectTimezoneData = (state: RootState) =>
  state.timezone.timezoneData;
export const useTimezoneData = () => {
  const timezoneData = useAppSelector(selectTimezoneData);
  return useMemo(() => timezoneData, [timezoneData]);
};

export const selectAllTimezoneData = (state: RootState) =>
  state.timezone.allTimezoneData;
export const useAllTimezoneData = () => {
  const allTimezoneData = useAppSelector(selectAllTimezoneData);
  return useMemo(() => allTimezoneData, [allTimezoneData]);
};

export const selectTimezoneOptions = (state: RootState) =>
  state.timezone.timezoneOptions;
export const useTimezoneOptions = () => {
  const timezoneOptions = useAppSelector(selectTimezoneOptions);
  return useMemo(() => timezoneOptions, [timezoneOptions]);
};

export const selectTimezoneCountryWiseOptions = (state: RootState) =>
  state.timezone.countryWisetimezoneData;
export const useTimezoneCountryWiseOptions = () => {
  const timezoneOptions = useAppSelector(selectTimezoneCountryWiseOptions);
  return useMemo(() => timezoneOptions, [timezoneOptions]);
};
