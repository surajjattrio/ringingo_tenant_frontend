import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    searchLoginLogout,
    loginLogout,
    singleLoginLogoutInfo,
    allLoginLogout,
    exportLoginLogoutWithInfo,
} from "@/redux/services/tenant-admin/loginLogoutServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    loginLogoutData: any;
    allLoginLogoutData: any;
    loginLogoutOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    loginLogoutData: {},
    allLoginLogoutData: {},
    loginLogoutOptions: [],
};

export const loginLogoutGet = createAsyncThunk(
    "loginLogout/get",
    async (params: any) => {
        
        return await loginLogout(params);
    }
);

export const loginLogoutSearch = createAsyncThunk(
    "loginLogout/search",
    async (params: any) => {
        return await searchLoginLogout(params);
    }
);

export const loginLogoutAllSearch = createAsyncThunk(
    "loginLogout-all/search",
    async (params: any) => {
        return await searchLoginLogout(params);
    }
);

export const loginLogoutAllGet = createAsyncThunk(
    "loginLogout-all/get",
    async (params: any) => {
        return await allLoginLogout(params);
    }
);

export const getSingleLoginLogoutInfo = createAsyncThunk(
    "loginLogout/singleInfo",
    async (params: any) => {
       return await singleLoginLogoutInfo(params);
    }
);

export const exportLoginLogoutWithInfoData = createAsyncThunk(
    "loginLogout/export",
    async (params: any) => {
       return await exportLoginLogoutWithInfo(params);
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        return {
            ...val,
            agent_name: val?.agent?.username || "",
            fullname: val?.agent?.fullname || "",
        };
    });
    return { data: newData, count };
};

const loginLogoutSlice = createSlice({
    name: "loginLogout",
    initialState,
    reducers: {
        clearLoginLogout: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            loginLogoutGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loginLogoutData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
           loginLogoutSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loginLogoutData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            loginLogoutAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allLoginLogoutData = prepareData(action.payload);
            }
        );

        builder.addCase(
            loginLogoutAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allLoginLogoutData = prepareData(action.payload);
            }
        );
    },
});

export default loginLogoutSlice.reducer;
export const { clearLoginLogout } = loginLogoutSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.loginLogout.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectLoginLogout = (state: RootState) =>
    state.loginLogout.loginLogoutData;
export const useLoginLogout = () => {
    const loginLogout = useAppSelector(selectLoginLogout);
    return useMemo(() => loginLogout, [loginLogout]);
};

export const selectAllLoginLogout = (state: RootState) =>
    state.loginLogout.allLoginLogoutData;
export const useAllLoginLogout = () => {
    const allLoginLogout = useAppSelector(selectAllLoginLogout);
    return useMemo(() => allLoginLogout, [allLoginLogout]);
};
