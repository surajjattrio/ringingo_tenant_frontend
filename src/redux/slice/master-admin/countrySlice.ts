import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  country,
  createCountry,
  allCountry,
  deleteCountry,
  searchCountry,
  singleCountry,
  updateCountry,
  updateCountryStatus,
} from "../../services/master-admin/countryService";

interface InitialState {
  isLoading: boolean;
  allCountryData: any;
  countryData: any;
  countryOptions: any;
}

const initialState: InitialState = {
  isLoading: false,
  countryData: [],
  allCountryData: [],
  countryOptions: [],
};

export const countryGet = createAsyncThunk(
  "country/get",
  async (params: any) => {
    return await country(params);
  }
);

export const countrySingleGet = createAsyncThunk(
  "country/single-get",
  async (id: string) => {
    return await singleCountry(id);
  }
);

export const countryGetAll = createAsyncThunk("country/getAll", async () => {
  return await allCountry();
});

export const countrySearch = createAsyncThunk(
  "country/search",
  async (payload: any) => {
    return await searchCountry(payload);
  }
);

export const countryCreate = createAsyncThunk(
  "country/create",
  async (payload: any) => {
    return await createCountry(payload);
  }
);

export const countryUpdate = createAsyncThunk(
  "country/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateCountry(id, rest);
  }
);

export const countryStatusUpdate = createAsyncThunk(
  "country-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateCountryStatus(id, rest);
  }
);

export const countryDelete = createAsyncThunk(
  "country/delete",
  async (id: string) => {
    return await deleteCountry(id);
  }
);

export const countryOptionsGet = createAsyncThunk(
  "country-options/getAll",
  async () => {
    return await allCountry();
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;
  const newData = data.map((val: any) => ({
    ...val,
    country_name:
      val.country?.length && val.country[0]?.nicename
        ? val.country[0].nicename
        : "",
  }));
  return { data: newData, count };
};
const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    clearCountry: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(countryGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(countryGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.countryData = prepareData(action.payload);
        state.isLoading = false;
      })
      .addCase(countryGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(countrySearch.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(countrySearch.fulfilled, (state, action: PayloadAction<any>) => {
        state.countryData = prepareData(action.payload);
        state.isLoading = false;
      })
      .addCase(countrySearch.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder.addCase(
      countryOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data?.length ? action.payload.data : [];
        state.countryOptions = data?.map((val: any) => ({
          value: val.uuid,
          label: val.country,
        }));
      }
    );
  },
});

export default countrySlice.reducer;
export const { clearCountry } = countrySlice.actions;

export const selectIsLoading = (state: RootState) => state.country.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectCountryData = (state: RootState) =>
  state.country.countryData;
export const useCountryData = () => {
  const countryData = useAppSelector(selectCountryData);
  return useMemo(() => countryData, [countryData]);
};

export const selectAllCountryData = (state: RootState) =>
  state.country.allCountryData;
export const useAllCountryData = () => {
  const allCountryData = useAppSelector(selectAllCountryData);
  return useMemo(() => allCountryData, [allCountryData]);
};

export const selectCountryOptions = (state: RootState) =>
  state.country.countryOptions;
export const useCountryOptions = () => {
  const countryOptions = useAppSelector(selectCountryOptions);
  return useMemo(() => countryOptions, [countryOptions]);
};
