import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  createRole,
  deleteRole,
  getRoles,
  roles,
  searchRole,
  updateRole,
  updateRoleStatus,
} from "../../services/master-admin/roleService";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
  isLoading: boolean;
  roleData: any;
  singleRoleData: any;
  rolesOptions: OptionTypes[];
}

const initialState: InitialState = {
  isLoading: false,
  roleData: {},
  singleRoleData: {},
  rolesOptions: [],
};

export const rolesOptionsGet = createAsyncThunk("roles/get-all", async () => {
  return await roles();
});

export const rolesGet = createAsyncThunk("roles/get", async (params: any) => {
  return await getRoles(params);
});

export const roleSearch = createAsyncThunk(
  "role/search",
  async (payload: any) => {
    return await searchRole(payload);
  }
);

export const roleCreate = createAsyncThunk(
  "role/create",
  async (payload: any) => {
    return await createRole(payload);
  }
);

export const roleUpdate = createAsyncThunk(
  "role/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateRole(id, rest);
  }
);

export const roleStatusUpdate = createAsyncThunk(
  "role-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateRoleStatus(id, rest);
  }
);

export const roleDelete = createAsyncThunk(
  "role/delete",
  async (id: string) => {
    return await deleteRole(id);
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    updateSingleRoleData: (state, action) => {
      state.singleRoleData = action.payload ? action.payload : {}
    },
    clearRole : () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(rolesGet.pending, (state, action: PayloadAction<any>) => {
      state.isLoading = true;
    })
      .addCase(rolesGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.roleData = action.payload;
        state.isLoading = false;
      })
      .addCase(rolesGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder.addCase(
      roleSearch.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    )
      .addCase(
        roleSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.roleData = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(
        roleSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      rolesOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data || []
        
        state.rolesOptions = data?.filter((val: any) => val?.status === "0")?.map((val: any) => ({
          value: val?.uuid, label:val?.role_name
        }))
      }
    );

  },
});

export default roleSlice.reducer;
export const { clearRole } = roleSlice.actions

export const { updateSingleRoleData } = roleSlice.actions

export const selectIsLoading = (state: RootState) =>
  state.role.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectRoleData = (state: RootState) => state.role.roleData;
export const useRoleData = () => {
  const roleData = useAppSelector(selectRoleData);
  return useMemo(() => roleData, [roleData]);
};

export const selectSingleRoleData = (state: RootState) =>
  state.role.singleRoleData;
export const useSingleRoleData = () => {
  const singleRoleData = useAppSelector(selectSingleRoleData);
  return useMemo(() => singleRoleData, [singleRoleData]);
};

export const selectRolesOptions = (state: RootState) => state.role.rolesOptions;
export const useRolesOptions = () => {
  const rolesOptions = useAppSelector(selectRolesOptions);
  return useMemo(() => rolesOptions, [rolesOptions]);
};