import { create } from 'zustand';

const useDataStore = create((set) => ({
    fileInfo: {},
    setFileInfo: (data) => set({ fileInfo: data }),
    clearFileInfo: () => set({ fileInfo: {} }),

    preloadData: {},
    setPreloadData: (data) => set({ preloadData: data }),
    clearPreloadData: () => set({ preloadData: {} }),

    interactionData: {},
    setInteractionData: (data) => set({ interactionData: data }),
    clearInteractionData: () => set({ interactionData: {} }),

    processData: {},
    setProcessData: (data) => set({ processData: data }),
    clearProcessData: () => set({ processData: {} }),

    objectToType: {},
    setObjectToType: (data) => set({ objectToType: data }),
}))

export default useDataStore