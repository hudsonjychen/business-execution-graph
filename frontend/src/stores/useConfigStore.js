import { create } from 'zustand';

const useConfigStore = create((set) => ({
    /** interaction color palette */
    colorScheme: 'disabled',
    setColorScheme: (data) => set({ colorScheme: data }),
    selectedColor: null,
    setSelectedColor: (data) => set({ selectedColor: data }),
    clearInteractionColorConfig: () => set({ colorScheme: 'disabled', selectedColor: null }),

    /** interaction config */
    nodeSizeMetric: 'none',
    setNodeSizeMetric: (data) => set({ nodeSizeMetric: data }),
    edgeNotationMetric: 'none',
    setEdgeNotationMetric: (data) => set({ edgeNotationMetric: data }),
    clearInteractionGraphConfig: () => set({ nodeSizeMetric: 'none', edgeNotationMetric: 'none' }),

    /** knowledge color palette */
    colorSet: {process: null, objectType: null, activity: null},
    setColorSet: (type, color) => set((state) => ({
        colorSet: {
            ...state.colorSet,
            [type]: color,
        },
    })),
    clearKnowledgeColorConfig: () => set({ colorSet: {process: null, objectType: null, activity: null} }),

    /** knowledge config */
    showingNodeType: 'both',
    setShowingNodeType: (data) => set({ showingNodeType: data }),
    nodeSharing: 'both',
    setNodeSharing: (data) => set({ nodeSharing: data }),
    clearKnowledgeGraphConfig: () => set({ showingNodeType: 'both', nodeSharing: 'both' }),

}))

export default useConfigStore