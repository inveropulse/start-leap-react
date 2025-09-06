// Simple toast hook - basic implementation
import { useContext } from 'react';

// Temporary basic implementation
const toastContext = {
  addToast: (props: any) => console.log('Toast:', props.title, props.description),
  dismiss: () => {},
  dismissAll: () => {},
};

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 5000 }: ToastProps) => {
    toastContext.addToast({
      title: title || '',
      description: description || '',
      type: variant === 'destructive' ? 'error' : 'info',
      duration,
    });
  };

  return {
    toast,
    dismiss: toastContext.dismiss,
    dismissAll: toastContext.dismissAll,
  };
}