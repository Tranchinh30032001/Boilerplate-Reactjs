const initialState = {
  isOpen: false,
  type: '',
  size: 'md',
  props: {}
}

export const createModalSlice = (set) => ({
  ...initialState,
  openModal: (params) => set({ ...params, isOpen: true }),
  closeModal: () => set(initialState)
})
