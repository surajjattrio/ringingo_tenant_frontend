import { IconKey } from "@/components/ui-components/Icon";

export interface NavItemsTypes {
  id: string;
  iconActive?: IconKey;
  icon?: IconKey;
  title: string;
  url: string;
  name?:string;
  subItems?: NavItemsTypes[];
}
