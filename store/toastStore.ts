import { create } from 'zustand';

export type ToastTone = 'success' | 'info' | 'danger';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastState {
  toast: ToastItem | null;
  show: (message: string, tone?: ToastTone) => void;
  hide: () => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (message, tone = 'success') =>
    set({ toast: { id: nextId++, message, tone } }),
  hide: () => set({ toast: null }),
}));