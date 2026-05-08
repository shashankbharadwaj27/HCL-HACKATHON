import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    modal: null, // { type: 'booking', data: {...} }
    toast: null, // { message, type: 'success'|'error' }
    sidebarOpen: false,
  },
  reducers: {
    openModal: (s, a) => { s.modal = a.payload },
    closeModal: (s) => { s.modal = null },
    showToast: (s, a) => { s.toast = a.payload },
    hideToast: (s) => { s.toast = null },
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen },
  },
})

export const { openModal, closeModal, showToast, hideToast, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer