import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allUserPerformance,
    searchUserPerformance,
    userPerformance,
    singleUserInfo,
} from "@/redux/services/tenant-admin/userPerformanceServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    userPerformanceData: any;
    allUserPerformanceData: any;
    userPerformanceOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    userPerformanceData: {},
    allUserPerformanceData: {},
    userPerformanceOptions: [],
};

export const userPerformanceGet = createAsyncThunk(
    "userPerformance/get",
    async (params: any) => {
        return await userPerformance(params);
    }
);

export const userPerformanceSearch = createAsyncThunk(
    "userPerformance/search",
    async (params: any) => {
        return await searchUserPerformance(params);
    }
);

export const userPerformanceAllSearch = createAsyncThunk(
    "userPerformance-all/search",
    async (params: any) => {
        return await searchUserPerformance(params);
    }
);

export const userPerformanceAllGet = createAsyncThunk(
    "userPerformance-all/get",
    async (params: any) => {
        return await allUserPerformance(params);
    }
);

export const userPerformanceOptionsGet = createAsyncThunk(
    "userPerformance-options/get",
    async () => {
        return await allUserPerformance();
    }
);

export const getSingleUserInfo = createAsyncThunk(
    "userPerformance/singleInfo",
    async (params: any) => {
        const { id, ...rest } = params;
        return await singleUserInfo(id, rest);
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        return {
            ...val,
            user_name: val?.user?.[0]?.username || "",
        };
    });
    return { data: newData, count };
};

const userPerformanceSlice = createSlice({
    name: "userPerformance",
    initialState,
    reducers: {
        clearUserPerformance: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            userPerformanceGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.userPerformanceData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            userPerformanceSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.userPerformanceData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            userPerformanceAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allUserPerformanceData = prepareData(action.payload);
            }
        );

        builder.addCase(
            userPerformanceAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allUserPerformanceData = prepareData(action.payload);
            }
        );

        builder.addCase(
            userPerformanceOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.userPerformanceOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default userPerformanceSlice.reducer;
export const { clearUserPerformance } = userPerformanceSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.userPerformance.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectUserPerformance = (state: RootState) =>
    state.userPerformance.userPerformanceData;
export const useUserPerformance = () => {
    const userPerformance = useAppSelector(selectUserPerformance);
    return useMemo(() => userPerformance, [userPerformance]);
};

export const selectAllUserPerformance = (state: RootState) =>
    state.userPerformance.allUserPerformanceData;
export const useAllUserPerformance = () => {
    const allUserPErformance = useAppSelector(selectAllUserPerformance);
    return useMemo(() => allUserPErformance, [allUserPErformance]);
};

export const selectUserPerformanceOptions = (state: RootState) =>
    state.userPerformance.userPerformanceOptions;
export const useUserPerformanceOptions = () => {
    const options = useAppSelector(selectUserPerformanceOptions);
    return useMemo(() => options, [options]);
};
