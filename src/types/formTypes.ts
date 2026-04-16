export interface OptionTypes {
  value: string | number;
  label?: string;
  url?: string;
}

export interface ObjectOptionTypes {
  value: {
    name: string;
    uuid: string;
  };
  label?: string;
}

export interface ManagerNameTypes {
  managerName?: string;
}

export interface ManagerPageTypes {
  managerName?: string | null;
  name?: string | null;
}