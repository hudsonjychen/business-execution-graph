import { create } from 'zustand';

const useStatusStore = create((set) => ({
    loadingStatus: null,
    setLoadingStatus: (data) => set({ loadingStatus: data }),
    mode: 'discovery',
    setMode: (data) => set({ mode: data })
}))

export default useStatusStore