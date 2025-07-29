import { create } from 'zustand';

const useConfigStore = create((set) => ({
    /** color palette */
    colorScheme: 'disabled',
    setColorScheme: (data) => set({ colorScheme: data }),
    selectedColor: null,
    setSelectedColor: (data) => set({ selectedColor: data }),
    clearInteractionColorConfig: () => set({ colorScheme: 'disabled', selectedColor: null }),

    /** color palette */
    nodeSizeMetric: 'none',
    setNodeSizeMetric: (data) => set({ nodeSizeMetric: data }),
    edgeNotationMetric: 'none',
    setEdgeNotationMetric: (data) => set({ edgeNotationMetric: data }),
    clearInteractionGraphConfig: () => set({ nodeSizeMetric: 'none', edgeNotationMetric: 'none' }),

}))

export default useConfigStore