export type AuthContextType = {
  user: any;
  loginDetails: any;
  isLoggedIn: boolean;
  login: (
    username: string,
    password: string,
    tenant_domain: string,
    key: string,
    rememberMe: boolean,
    entity?: string,
    company_code?: string
  ) => Promise<any>;
  tenantLogin: (uuid: string) => void;
  switchMaster: () => void;
  logout: () => void;
  forgotPassword: (username: string) => Promise<void>;
  resetPassword: (password: string, uuid: string) => Promise<void>;
  changePassword: (password: string, current_password: string) => Promise<void>;
};
