"use client";
import { useEffect, createContext, useReducer } from "react";

// PROJECT IMPORTS
import {
  managerAdmin,
  masterAdmin,
  masterAdminTitles,
  masterAdminUrls,
  tenantAdmin,
} from "@/components/layouts/MainLayout/SideBar/menuItems";
import { useAppDispatch } from "@/redux/hooks";
import { LOGIN, LOGIN_DATA, LOGOUT, PROCESS } from "./actions";
import { authReducer } from "./reducers/authReducer";
//import { baseUrl } from "@/API/baseURL";
import { Loader } from "@/components/ui-components";
import { apiInstance } from "@/redux/axiosApi";
import {
  setManagerDetail,
  updateSideBarData,
  useManagerDetails,
} from "@/redux/slice/commonSlice";

// THIRD - PARTY IMPORT
import Cookies from "js-cookie";
import axios from "axios";
const baseUrl = process.env.BASE_URL;

// TYPES
import { AuthContextType } from "@/types/auth/authContextTypes";

interface InitialStateProps {
  user?: any;
  loginDetails?: any;
  isInitialized?: boolean;
  isLoggedIn?: boolean;
}

const initialState: InitialStateProps = {
  user: {},
  loginDetails: {},
  isLoggedIn: false,
  isInitialized: false,
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const call = useAppDispatch();
  const manager_detail = useManagerDetails();

  // Preparing Data for SideBar
  const prepareData = (user: any) => {
    if (user?.role === "master_admin") {
      return {
        sideBarData: masterAdmin,
        sideBarUrls: masterAdminUrls,
        sideBarTitles: masterAdminTitles,
      };
    }

    if (user?.role === "manager") {
      const advanceModules =
        user?.manager_detail?.roles?.length &&
          user?.manager_detail?.roles[0]?.module_permission
          ? user?.manager_detail?.roles[0]?.module_permission
          : {};
      let basicModules: any = {};

      if (basicModules?.user_role || basicModules?.tenant_role) {
        basicModules = {
          ...basicModules,
          roles: "0",
        };
      }

      // Make Keys of All Roles
      const combineMainKeys = Object.keys(advanceModules)?.concat(
        Object.keys(basicModules)
      );

      const managerAdminUrls: any = ["/manager-profile"];
      const managerAdminTitleUrls: any = [
        { url: "/manager-profile", title: "Profile" },
      ];

      // Remove Some Modules which Are Disabled and Making SideBar Data
      const newData: any = [];
      managerAdmin?.map((val: any) => {
        if (val?.subItems) {
          const subItems = val?.subItems?.filter((obj: any) => {
            if (combineMainKeys?.flat()?.includes(obj?.name)) {
              managerAdminUrls.push(obj?.url);
              managerAdminTitleUrls.push({ url: obj?.url, title: obj?.title });
              return obj;
            }
          });
          if (subItems?.length) {
            newData.push({
              ...val,
              subItems,
            });
          }
        } else {
          if (val?.url) {
            managerAdminUrls.push(val?.url);
            managerAdminTitleUrls.push({ url: val?.url, title: val?.title });
          }
          newData.push(val);
        }
      });
      return {
        sideBarData: newData,
        sideBarUrls: managerAdminUrls,
        sideBarTitles: managerAdminTitleUrls,
      };
    }

    // Make Data of Advance & Basic Roles
    const advanceModules =
      user?.tenant_detail?.roles?.length &&
        user?.tenant_detail?.roles[0]?.module_permission
        ? user?.tenant_detail?.roles[0]?.module_permission
        : {};

    if (advanceModules.messaging !== undefined && Object.keys(advanceModules.messaging).length > 0) {
      // Remove 'whatsapp' from messaging
      // Object.keys(advanceModules.messaging).forEach(key => delete advanceModules.messaging[key]);

      // Add two new values to messaging
      advanceModules.messaging.messaging_channel = '0';
      advanceModules.messaging.messaging_queue = '0';
    }
    let basicModules: any = {};

    if (basicModules?.user_role || basicModules?.tenant_role) {
      basicModules = {
        ...basicModules,
        roles: "0",
      };
    }

    // Make Keys of All Roles
    const keys = Object.keys(advanceModules || {})?.concat(
      Object.keys(basicModules || {})
    );

    const combineMainKeys = keys.reduce((acc: any[], key: string) => {
      acc.push(key);
      if (advanceModules?.[key] && typeof advanceModules[key] === "object") {
        acc.push(...Object.keys(advanceModules[key]));
      }
      return acc;
    }, []);

    const allKeys = combineMainKeys?.map((val: any) => {
      if (advanceModules[val]) {
        return Object.keys(advanceModules[val]);
      }
      return val;
    });

    const tenantAdminUrls: any = ["/tenant-profile","/tenant-inbound-call-debug"];
    const tenantAdminTitleUrls: any = [
      { url: "/tenant-profile", title: "Profile" },
      { url: "/tenant-inbound-call-debug", title: "inbound call debug" },
    ];

    // Remove Some Modules which Are Disabled and Making SideBar Data
    const newData = tenantAdmin
      ?.filter((val: any) =>
        val?.name ? combineMainKeys.includes(val?.name) : true
      )
      ?.map((val: any) => {
        if (val?.url) {
          tenantAdminUrls.push(val?.url);
          tenantAdminTitleUrls.push({ url: val?.url, title: val?.title });
        }
        if (val?.subItems) {
          const subItems = val?.subItems?.filter((obj: any) => {
            tenantAdminUrls.push(obj?.url);
            tenantAdminTitleUrls.push({ url: obj?.url, title: obj?.title });
            return obj?.name ? allKeys?.flat()?.includes(obj?.name) : true;
          });
          return {
            ...val,
            subItems,
          };
        }
        return val;
      });

    return {
      sideBarData: newData,
      sideBarUrls: tenantAdminUrls,
      sideBarTitles: tenantAdminTitleUrls,
    };
  };

  useEffect(() => {
    const init = async () => {
      try {
        const cookies = Cookies.get("user");
        const masterCookies = Cookies.get("masterUser");
        const user = JSON.parse(cookies ? cookies : "{}");
        const masterUser = JSON.parse(masterCookies ? masterCookies : "{}");

        if (
          (masterUser?.access_token || user?.access_token) &&
          user?.role === "manager"
        ) {
          let userDetail = { ...user, manager_detail };
          call(updateSideBarData(prepareData(userDetail)));
          dispatch({
            type: LOGIN,
            payload: {
              user: userDetail,
            },
          });
        } else if (user?.access_token) {
          call(updateSideBarData(prepareData(user)));
          dispatch({
            type: LOGIN,
            payload: {
              user,
            },
          });
        } else if (masterUser?.access_token) {
          call(updateSideBarData(prepareData(masterUser)));
          dispatch({
            type: LOGIN,
            payload: {
              user: masterUser,
            },
          });
        } else {
          dispatch({
            type: LOGOUT,
          });
        }
      } catch (e) {
        dispatch({ type: LOGOUT });
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tenant or Master Admin Login
  const login = async (
    username: string,
    password: string,
    tenant_domain: string,
    key: string,
    rememberMe: boolean,
    entity?: string,
    company_code?: string
  ) => {
    const geoLat = Cookies.get("geo_lat");
    const geoLng = Cookies.get("geo_lng");
    const requestHeaders = {
      'x-geo-lat': geoLat,
      'x-geo-lng': geoLng
    };

    try {
      dispatch({
        type: LOGIN_DATA,
        payload: {
          loginDetails: { username, password, tenant_domain, entity, company_code },
        },
      });
      if (!key) {
        const response: any = await axios.get(
          baseUrl + "/login/check-license",
          { params: { domain: tenant_domain } }
        );
        if (response?.data) {
          const user: any = await axios.post(baseUrl + "/login", {
            username,
            password,
            tenant_domain,
            entity,
            company_code
          }, { headers: requestHeaders });
          if (user?.data?.access_token) {
            call(updateSideBarData(prepareData(user?.data)));
            const data = {
              ...user.data,
              name:
                (user?.data?.role === "tenant"
                  ? user?.data?.tenant_detail?.tenant_name
                  : user?.data?.role === "manager"
                    ? user?.data?.manager_detail?.username
                    : user.data?.username) || "",
              title:
                user?.data?.role === "tenant"
                  ? "Admin"
                  : user?.data?.role === "manager"
                    ? "Manager"
                    : "Master Admin",
              noSwitch:
                user?.data?.role === "tenant" || user?.data?.role === "manager",
            };

            dispatch({
              type: LOGIN,
              payload: {
                user: data,
              },
            });

            if (user?.data?.role === "manager") {
              const { manager_detail, ...ndata } = data;

              call(setManagerDetail(manager_detail));

              Cookies.set("role", "manager", {
                expires: rememberMe ? 30 : 1,
              });

              Cookies.set("user", JSON.stringify(ndata), {
                expires: rememberMe ? 30 : 1,
              });

              Cookies.set("masterUser", JSON.stringify(ndata), {
                expires: rememberMe ? 30 : 1,
              });
            } else {
              Cookies.set("user", JSON.stringify(data), {
                expires: rememberMe ? 30 : 1,
              });

              Cookies.set("masterUser", JSON.stringify(data), {
                expires: rememberMe ? 30 : 1,
              });
            }
          }
          return user?.data;
        } else {
          return response;
        }
      } else {
        const user: any = await axios.post(baseUrl + "/login", {
          username,
          password,
          tenant_domain,
          key,
          entity,
          company_code
        }, { headers: requestHeaders });
        if (user?.data?.access_token) {
          call(updateSideBarData(prepareData(user?.data)));
          const data = {
            ...user.data,
            name:
              (user?.data?.role === "tenant"
                ? user?.data?.tenant_detail?.tenant_name
                : user?.data?.role === "manager"
                  ? user?.data?.manager_detail?.username
                  : user.data?.username) || "",
            title:
              user?.data?.role === "tenant"
                ? "Admin"
                : user?.data?.role === "manager"
                  ? "Manager"
                  : "Master Admin",
            noSwitch:
              user?.data?.role === "tenant" || user?.data?.role === "manager",
          };

          dispatch({
            type: LOGIN,
            payload: {
              user: data,
            },
          });

          Cookies.set("user", JSON.stringify(data), {
            expires: rememberMe ? 30 : 1,
          });

          Cookies.set("masterUser", JSON.stringify(data), {
            expires: rememberMe ? 30 : 1,
          });
        }
        return user?.data;
      }
    } catch (err: any) {
      console.error("Login In Context Err =-=>", err);
      return err?.response?.data;
    }
  };

  // Tenant Login
  const tenantLogin = async (uuid: string) => {
    const cloneUser = state?.user;
    try {
      dispatch({
        type: PROCESS,
      });
      const user: any = await axios.get(baseUrl + "/tenant/login/" + uuid);

      if (user?.data?.access_token) {
        call(updateSideBarData(prepareData(user?.data)));
        const data = {
          ...user.data,
          name: user.data?.tenant_detail?.tenant_name,
          title: "Admin",
        };

        Cookies.set("user", JSON.stringify(data), {
          expires: 1,
        });
        dispatch({
          type: LOGIN,
          payload: {
            user: data,
          },
        });
      }
      return user?.data;
    } catch (err: any) {
      dispatch({
        type: LOGIN,
        payload: {
          user: cloneUser,
        },
      });
      console.error("Tenant Login In Context Err =-=>", err);
      return err?.response?.data;
    }
  };

  // Switch Back to Master Admin & Clear All Redux Tenant Data
  const switchMaster = () => {
    try {
      dispatch({
        type: PROCESS,
      });
      const cookie = Cookies.get("masterUser");
      const masterUser = JSON.parse(cookie ? cookie : "{}");
      Cookies.set("user", JSON.stringify(masterUser), { expires: 1 });
      call(updateSideBarData(prepareData(masterUser)));
      dispatch({
        type: LOGIN,
        payload: {
          user: masterUser,
        },
      });
      return masterUser;
    } catch (err: any) {
      console.error("Switch Back to Master Err =-=>", err);
      return err?.response?.data;
    }
  };

  // Logout & Clear All Cookies and Redux Data
  const logout = async () => {
    dispatch({
      type: LOGOUT,
    });
    Cookies.remove("user");
    Cookies.remove("masterUser");
    Cookies.remove("geo_lat");
    Cookies.remove("geo_lng");
  };

  // Forgot Password
  const forgotPassword = async (username: string) => {
    try {
      const res: any = await axios.post(baseUrl + "/auth/forgot-password", {
        username,
        entity: "tenant",
      });
      return res?.data;
    } catch (err: any) {
      console.error("Forgot Password In Context Err =-=>", err);
      return err?.response?.data;
    }
  };

  // Reset Password
  const resetPassword = async (password: string, uuid: string) => {
    try {
      const res: any = await axios.post(baseUrl + "/auth/update-password", {
        password,
        entity: "tenant",
        uuid: uuid,
      });
      return res?.data;
    } catch (err: any) {
      console.error("Reset Password In Context Err =-=>", err);
      return err?.response?.data;
    }
  };

  // Change Password
  const changePassword = async (password: string, current_password: string) => {
    try {
      const res: any = await apiInstance.post("/profile/change-password", {
        password,
        current_password,
      });
      return res;
    } catch (err: any) {
      console.error("Change Password In Context Err =-=>", err);
      return err?.response?.data;
    }
  };

  if (!state.isInitialized) {
    return <Loader />;
  }
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        tenantLogin,
        switchMaster,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
