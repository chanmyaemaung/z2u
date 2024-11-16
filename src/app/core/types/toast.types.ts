export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
