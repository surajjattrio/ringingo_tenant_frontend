export interface ColumnsType {
  name: string;
  title: string;
  sortable?: boolean;
  action?: any;
  showDelete?: boolean;
  showEdit?: boolean;
  sort?: string;
  isBold?: boolean;
}

export interface OrderProps {
  name: string;
  sort: string;
}
