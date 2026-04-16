import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
    allCustomFields,
    createCustomFields,
    deleteCustomFields,
    customFields,
    searchCustomFields,
    singleCustomFields,
    updateCustomFields,
   // updateTenantDispositionStatus,
} from "@/redux/services/tenant-admin/customFieldsService";

interface InitialState {
    isLoading: boolean;
    customFieldsData: any;
    allCustomFieldsData: any;
    getSingleCustomFields: any;
    singleCustomFieldsData: any;
    customFieldsOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    customFieldsData: [],
    allCustomFieldsData: [],
    getSingleCustomFields: {},
    singleCustomFieldsData: {},
    customFieldsOptions: [],
};

export const customFieldsGet = createAsyncThunk(
    "customFields/get",
    async (params: any) => {
        return await customFields(params);
    }
);

export const customFieldsSingleGet = createAsyncThunk(
    "customFields/single-get",
    async (id: string) => {
        return await singleCustomFields(id);
    }
);

export const customFieldsSearch = createAsyncThunk(
    "customFields/search",
    async (payload: any) => {
        return await searchCustomFields(payload);
    }
);

export const customFieldsCreate = createAsyncThunk(
    "customFields/create",
    async (payload: any) => {
        return await createCustomFields(payload);
    }
);

export const customFieldsUpdate = createAsyncThunk(
    "customFields/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateCustomFields(id, rest);
    }
);

// export const tenantDispositionStatusUpdate = createAsyncThunk(
//     "tenant-lead-status/update",
//     async (payload: any) => {
//         const { id, ...rest } = payload;
//         return await updateTenantDispositionStatus(id, rest);
//     }
// );

export const customFieldsDelete = createAsyncThunk(
    "customFields/delete",
    async (id: string) => {
        return await deleteCustomFields(id);
    }
);

export const customFieldsOptionsGet = createAsyncThunk(
    "customFields-options/getAll",
    async () => {
        return await allCustomFields();
    }
);

const customFieldsSlice = createSlice({
    name: "customFields",
    initialState,
    reducers: {
        updateSingleCustomFieldsData: (state, action) => {
            state.singleCustomFieldsData = action.payload ? action.payload : {};
        },
        clearCustomFields: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(customFieldsGet.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(
                customFieldsGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const count = action.payload?.count;
                    const newData = data?.map((val: any) => ({
                        ...val,

                        //uuid: val.uuid,
                        lead_group_name:val?.lead_group[0]?.name || "",
                        //name: val?.name,
                    }));
                    state.customFieldsData = { data: newData, count };
                    state.isLoading = false;
                    //console.log("DDDD",state.customFieldsData);
                }
            )

            .addCase(
                customFieldsGet.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder
            .addCase(
                customFieldsSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )

            .addCase(
                customFieldsSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const count = action.payload?.count;
                    const newData = data?.map((val: any) => ({
                        ...val,

                      //  uuid: val.disposition_uuid,
                        uuid: val.uuid,
                        disabled: val?.created_flag === "0",
                        name: val?.name,
                    }));
                    state.customFieldsData = { data: newData, count };
                    state.isLoading = false;
                }
            )

            .addCase(
                customFieldsSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );
        

            builder.addCase(
                customFieldsOptionsGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    state.customFieldsOptions = data?.map((val: any) => ({
                        value: {
                            name: val?.name,
                            uuid: val?.uuid,
                        },
                        label: val?.name,
                    })) || [];
            }
        );

     
    },
});

export default customFieldsSlice.reducer;

export const { updateSingleCustomFieldsData, clearCustomFields } =
customFieldsSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.customFields.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectCustomFieldsData = (state: RootState) =>
    state.customFields.customFieldsData;
export const useCustomFieldsData = () => {
    const customFieldsData = useAppSelector(selectCustomFieldsData);
    return useMemo(() => customFieldsData, [customFieldsData]);
};

export const selectSingleCustomFields = (state: RootState) =>
    state.customFields.singleCustomFieldsData;
export const useSingleCustomFields = () => {
    const customFieldsData = useAppSelector(selectSingleCustomFields);
    return useMemo(() => customFieldsData, [customFieldsData]);
};


export const selectCustomFieldsOptions = (state: RootState) =>
    state.customFields.customFieldsOptions;
export const useCustomFieldsOptions = () => {
    const options = useAppSelector(selectCustomFieldsOptions);
    return useMemo(() => options, [options]);
};
