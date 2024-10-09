import { useModalStore } from '../stores/useModalStore'
import MODAL_TYPE from '../constants/modalType'
import DemoModal from '../components/Modal/DemoModal'

export const ModalManager = () => {
  const { isOpen, type, onAction, onClose, props } = useModalStore()
  if (!isOpen || !type) return null

  return (
    {
      [MODAL_TYPE.MODAL_DEMO]: (
        <DemoModal {...props} onClose={onClose} onAction={onAction} />
      )
    }[type] || null
  )
}
