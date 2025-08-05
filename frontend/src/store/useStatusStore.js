import { create } from 'zustand';

const useStatusStore = create((set) => ({
    loadingStatus: false,
    setLoadingStatus: (data) => set({ loadingStatus: data }),
    mode: 'discovery',
    setMode: (data) => set({ mode: data })
}))

export default useStatusStore