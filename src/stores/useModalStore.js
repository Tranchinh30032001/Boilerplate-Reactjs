import { create } from 'zustand'

const initialState = {
  isOpen: false,
  type: '',
  size: 'md',
  props: {}
}

export const useModalStore = create((set) => ({
  ...initialState,
  openModal: (params) => set({ ...params, isOpen: true }),
  closeModal: () => set(initialState)
}))

