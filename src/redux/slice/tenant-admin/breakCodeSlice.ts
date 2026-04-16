import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    createBreakCode,
    deleteBreakCode,
    breakCode,
    searchBreakCode,
    singleBreakCode,
    updateBreakCode,
    updateBreakCodeStatus,
    allBreakCode,
} from "@/redux/services/tenant-admin/breakCodeServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    breakCodeData: any;
    getSingleBreakCode: any;
    singleBreakCodeData: any;
    breakCodeOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    breakCodeData: {},
    getSingleBreakCode: {},
    singleBreakCodeData: {},
    breakCodeOptions: [],
};

export const breakCodeGet = createAsyncThunk("breakCode/get", async (params: any) => {
    return await breakCode(params);

});

export const breakCodeSingleGet = createAsyncThunk("breakCode/single-get", async (id: string) => {
  return await singleBreakCode(id);
});
  

export const breakCodeSearch = createAsyncThunk("breakCode/search", async (params: any) => {
    return await searchBreakCode(params);
});

export const breakCodeCreate = createAsyncThunk(
    "breakCode/create",
    async (payload: any) => {
        return await createBreakCode(payload);
    }
);

export const breakCodeUpdate = createAsyncThunk(
    "breakCode/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
       return await updateBreakCode(id, rest);

    }
);

export const breakCodeStatusUpdate = createAsyncThunk(
    "breakCode-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateBreakCodeStatus(id, rest);
    }
);
export const breakCodeDelete = createAsyncThunk("breakCode/delete", async (id: string) => {
    return await deleteBreakCode(id);
});

export const breakCodeOptionsGet = createAsyncThunk("breakCode-options/get", async () => {
    return await allBreakCode();
});

const breakCodeSlice = createSlice({
    name: "breakCode",
    initialState,
    reducers: {
    updateSingleBreakCodeData: (state, action) => {
       
      state.singleBreakCodeData = action.payload ? action.payload : {};
    },
        clearBreakCode: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(breakCodeGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(breakCodeGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.breakCodeData = action.payload;
                state.isLoading = false;
            })
            .addCase(breakCodeGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(breakCodeSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                breakCodeSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.breakCodeData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(breakCodeSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            breakCodeOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.breakCodeOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default breakCodeSlice.reducer;
export const { updateSingleBreakCodeData, clearBreakCode } =
breakCodeSlice.actions;

export const selectIsLoading = (state: RootState) => state.breakCode.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectBreakCodeData = (state: RootState) => state.breakCode.breakCodeData;
export const useBreakCode = () => {
    const breakCode = useAppSelector(selectBreakCodeData);
    return useMemo(() => breakCode, [breakCode]);
};

export const selectSingleBreakCode = (state: RootState) =>
  state.breakCode.singleBreakCodeData;
export const useSingleBreakCode = () => {
  const breakCode = useAppSelector(selectSingleBreakCode);
  return useMemo(() => breakCode, [breakCode]);
};

export const selectBreakCodeOptions = (state: RootState) =>
    state.breakCode.breakCodeOptions;
export const useBreakCodeOptions = () => {
    const options = useAppSelector(selectBreakCodeOptions);
    return useMemo(() => options, [options]);
};
