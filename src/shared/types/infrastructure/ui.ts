// UI-specific technical types
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface ListView<T> {
  items: T[];
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  isLoading?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}