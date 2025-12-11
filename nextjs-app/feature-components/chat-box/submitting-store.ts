import { create } from 'zustand';

interface SubmittingStoreState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useSubmittingStore = create<SubmittingStoreState>(set => ({
  loading: false,
  setLoading: loading => set({ loading }),
}));
