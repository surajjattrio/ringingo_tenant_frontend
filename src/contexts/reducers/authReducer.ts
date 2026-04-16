// PROJECT IMPORTS
import { LOGIN, LOGIN_DATA, LOGOUT, PROCESS } from "../actions";

// TYPES
interface InitialStateProps {
  user?: any;
  isLoggedIn?: boolean;
  isInitialized?: boolean;
  loginDetails?: any
}

interface ReducerActionProps {
  type: string;
  payload?: InitialStateProps;
}

const initialState: any = {
  user: null,
  isLoggedIn: false,
  isInitialized: false,
  loginDetails: null
};

export const authReducer = (
  state = initialState,
  action: ReducerActionProps
) => {
  switch (action.type) {
    case LOGIN:
      const { user } = action.payload!;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        isInitialized: true,
        user: null,
      };
    case PROCESS:
      return {
        ...state,
        isLoggedIn: false,
        isInitialized: false,
        user: null
      };
    case LOGIN_DATA:
      const { loginDetails } = action.payload!;
      return {
        ...state,
        loginDetails
      };
    default:
      return {
        ...state,
      };
  }
};
