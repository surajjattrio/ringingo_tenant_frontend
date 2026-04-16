export interface LoginFormValues {
  username: string;
  password: string;
  tenant_domain: string;
  entity?: string;
  rememberMe: boolean;
  key: string;
  company_code?: string;
}
