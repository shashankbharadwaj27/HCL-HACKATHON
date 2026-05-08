import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideToast, closeModal } from '../slices/uiSlice'
import BookingModal from '../components/BookingModal'

export function Toast() {
  const dispatch = useDispatch()
  const { toast } = useSelector((s) => s && s.ui)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => dispatch(hideToast()), 3500)
    return () => clearTimeout(t)
  }, [toast, dispatch])

  if (!toast) return null

  return (
    <div className={`toast ${toast.type || ''}`} role="alert">
      <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
      <span>{toast.message}</span>
      <button
        onClick={() => dispatch(hideToast())}
        style={{ marginLeft: 'auto', color: 'inherit', opacity: 0.7, fontSize: '1rem' }}
      >✕</button>
    </div>
  )
}

export function ModalManager() {
  const dispatch = useDispatch()
  const { modal } = useSelector((s) => s.ui)

  if (!modal) return null

  const handleClose = () => dispatch(closeModal())

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">
        {modal.type === 'booking' && <BookingModal room={modal.data} onClose={handleClose} />}
      </div>
    </div>
  )
}