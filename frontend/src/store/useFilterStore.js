import { create } from 'zustand';

const useFilterStore = create((set) => ({
    selectedObjectTypes: [],
    setSelectedObjectTypes: (data) => set({ selectedObjectTypes: data }),
    selectedProcesses: [],
    setSelectedProcesses: (data) => set({ selectedProcesses: data }),
}))

export default useFilterStore