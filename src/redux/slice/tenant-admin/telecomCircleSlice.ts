import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allTelecomCircle,
    createTelecomCircle,
    deleteTelecomCircle,
    telecomCircle,
    searchTelecomCircle,
    updateTelecomCircleStatus,
    updateTelecomCircle,
    importTelecomCircle,
} from "@/redux/services/tenant-admin/telecomCircleSevices";
 import { OptionTypes } from "@/types/formTypes";
// import { timeoutOptions2 } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    telecomCircleData: any;
    allTelecomCircleData: any;
    singleTelecomCircleData: any;
    telecomCircleOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    telecomCircleData: {},
    allTelecomCircleData: {},
    singleTelecomCircleData: {},
    telecomCircleOptions: [],
};

export const telecomCircleGet = createAsyncThunk("telecomCircle/get", async (params: any) => {
    return await telecomCircle(params);
});

export const telecomCircleAllGet = createAsyncThunk(
    "telecomCircle-all/get",
    async (params: any) => {
        return await telecomCircle(params);
    }
);

export const telecomCircleSearch = createAsyncThunk("telecomCircle-all/search",
    async (params: any) => {
        return await searchTelecomCircle(params);
    }
);

export const telecomCircleAllSearch = createAsyncThunk("telecomCircle/search",
    async (params: any) => {
        return await searchTelecomCircle(params);
    }
);

export const telecomCircleCreate = createAsyncThunk("telecomCircle/create",async (payload: any) => {
        return await createTelecomCircle(payload);
    }
);

export const telecomCircleUpdate = createAsyncThunk("telecomCircle/update",async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTelecomCircle(id, rest);
    }
);

export const telecomCircleDelete = createAsyncThunk("telecomCircle/delete", async (id: string) => {
    return await deleteTelecomCircle(id);
});

export const telecomCircleStatusUpdate = createAsyncThunk(
    "telecomCircle-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTelecomCircleStatus(id, rest);
    }
);


export const telecomCircleImport = createAsyncThunk("telecomCircle/import",
    async (payload: any) => {
        return await importTelecomCircle(payload);
    }
);

export const telecomCircleOptionsGet = createAsyncThunk("telecomCircle-options/get", async () => {
    const params = { list: "all" };
    return await allTelecomCircle(params);
});

// const prepareData = (payload: any) => {
//     const data = payload?.data;
//     const count = payload?.count;
//     // const newData = data?.map((val: any) => {
//     //     const timeout = timeoutOptions2?.find(
//     //         (option: any) => option?.value === val?.timeout
//     //     );
//     //     return {
//     //         ...val,
//     //         timeout_value: timeout?.label,
//     //         disabled: val?.flag === "2",
//     //         status_name: val?.status === "0" ? "Enabled" : "Disabled",
//     //     };
//     // });
//     return { data: newData, count };
// };

// const telecomCircleSlice = createSlice({
//     name: "telecomCircle",
//     initialState,
//     reducers: {
//         updateSingleTelecomCircleData: (state, action) => {
//             state.singleTelecomCircleData = action.payload ? action.payload : {};
//         },
//         clearTelecomCircle: () => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(telecomCircleGet.pending, (state, action: PayloadAction<any>) => {
//                 state.isLoading = true;
//             })
//             .addCase(telecomCircleGet.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.didData = prepareData(action.payload);
//                 state.isLoading = false;
//             })
//             .addCase(telecomCircleGet.rejected, (state, action: PayloadAction<any>) => {
//                 state.isLoading = false;
//             });
//         builder
//             .addCase(telecomCircleSearch.pending, (state, action: PayloadAction<any>) => {
//                 state.isLoading = true;
//             })
//             .addCase(telecomCircleSearch.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.didData = prepareData(action.payload);
//                 state.isLoading = false;
//             })
//             .addCase(telecomCircleSearch.rejected, (state, action: PayloadAction<any>) => {
//                 state.isLoading = false;
//             });

//         builder.addCase(
//             telecomCircleAllGet.fulfilled,
//             (state, action: PayloadAction<any>) => {
//                 state.allTelecomCircleData = prepareData(action.payload);
//             }
//         );

//         builder.addCase(
//             telecomCircleAllSearch.fulfilled,
//             (state, action: PayloadAction<any>) => {
//                 state.allTelecomCircleData = prepareData(action.payload);
//             }
//         );

//         builder.addCase(
//             telecomCircleOptionsGet.fulfilled,
//             (state, action: PayloadAction<any>) => {
//                 const data = action.payload?.data;
//                 state.telecomCircleOptions = data?.map((val: any) => ({
//                     value: val?.number,
//                     label: val?.number,
//                 }));
//             }
//         );
//     },
// });

// export default telecomCircleSlice.reducer;
// export const { updateSingleTelecomCircleData, clearTelecomCircle } = telecomCircleSlice.actions;

// export const selectIsLoading = (state: RootState) => state.telecomCircle.isLoading;
// export const useIsLoading = () => {
//     const isLoading = useAppSelector(selectIsLoading);
//     return useMemo(() => isLoading, [isLoading]);
// };

// export const selectTelecomCircle = (state: RootState) => state.telecomCircle.telecomCircleData;
// export const useTelecomCircle = () => {
//     const telecomCircle = useAppSelector(selectTelecomCircle);
//     return useMemo(() => telecomCircle, [telecomCircle]);
// };

// export const selectAllTelecomCircle = (state: RootState) => state.telecomCircle.allTelecomCircleData;
// export const useAllTelecomCircle = () => {
//     const allTelecomCircle = useAppSelector(selectAllTelecomCircle);
//     return useMemo(() => allTelecomCircle, [allTelecomCircle]);
// };

// export const selectSingleTelecomCircle = (state: RootState) => state.telecomCircle.singleTelecomCircleData;
// export const useSingleTelecomCircle = () => {
//     const telecomCircle = useAppSelector(selectSingleTelecomCircle);
//     return useMemo(() => telecomCircle, [telecomCircle]);
// };

// export const selectTelecomCircleOptions = (state: RootState) => state.telecomCircle.telecomCircleOptions;
// export const useTelecomCircleOptions = () => {
//     const telecomCircle = useAppSelector(selectTelecomCircleOptions);
//     return useMemo(() => telecomCircle, [telecomCircle]);
// };
const telecomCircleSlice = createSlice({
    name: "telecomCircle",
    initialState,
    reducers: {
    updateSingleTelecomCircleData: (state, action) => {
       
      state.singleTelecomCircleData = action.payload ? action.payload : {};
    },
        clearTelecomCircle: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(telecomCircleGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(telecomCircleGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.telecomCircleData = action.payload;
                state.isLoading = false;
            })
            .addCase(telecomCircleGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(telecomCircleSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                telecomCircleSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.telecomCircleData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(telecomCircleSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            telecomCircleOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.telecomCircleOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default telecomCircleSlice.reducer;
export const { updateSingleTelecomCircleData, clearTelecomCircle } =
telecomCircleSlice.actions;

export const selectIsLoading = (state: RootState) => state.telecomCircle.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTelecomCircleData = (state: RootState) => state.telecomCircle.telecomCircleData;
export const useTelecomCircle = () => {
    const telecomCircle = useAppSelector(selectTelecomCircleData);
    return useMemo(() => telecomCircle, [telecomCircle]);
};

export const selectSingleTelecomCircle = (state: RootState) =>
  state.telecomCircle.singleTelecomCircleData;
export const useSingleTelecomCircle = () => {
  const telecomCircle = useAppSelector(selectSingleTelecomCircle);
  return useMemo(() => telecomCircle, [telecomCircle]);
};

export const selectTelecomCircleOptions = (state: RootState) =>
    state.telecomCircle.telecomCircleOptions;
export const useTelecomCircleOptions = () => {
    const options = useAppSelector(selectTelecomCircleOptions);
    return useMemo(() => options, [options]);
};
