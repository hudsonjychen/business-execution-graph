import { create } from 'zustand';

const useSelectorStore = create((set) => ({
    focusingNode: null,
    setFocusingNode: (data) => set({ focusingNode: data }),
    cancelFocusingNode: () => set({ focusingNode: null })
}))

export default useSelectorStore