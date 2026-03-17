import { create } from 'zustand';

export const useLoaderStore = create((set) => ({
  isLoading: false,
  message: 'Loading...',
  
  startLoading: (message = 'Loading...') => set({ isLoading: true, message }),
  stopLoading: () => set({ isLoading: false }),
  
  // For initial page load logic
  isInitialLoad: true,
  setInitialLoad: (val) => set({ isInitialLoad: val }),
}));
