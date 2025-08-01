import { create } from 'zustand';

const useStatusStore = create((set) => ({
    loadingStatus: false,
    setLoadingStatus: (data) => set({ loadingStatus: data })
}))

export default useStatusStore