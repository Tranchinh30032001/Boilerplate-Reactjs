import SettingModal from '@/components/Modal/SettingModal'
import UserModal from '@/components/Modal/UserModal'
import MODAL_TYPE from '@/constants/modalType'
import { useModalStore } from '@/stores/useModalStore'

const ModalSwitcher = () => {
  const { isOpen, type, onAction, onClose, props } = useModalStore()
  if (!isOpen || !type) return null

  return (
    {
      [MODAL_TYPE.USER_MODAL]: (
        <UserModal {...props} onClose={onClose} onAction={onAction} />
      ),
      [MODAL_TYPE.SETTING_MODAL]: (
        <SettingModal {...props} onClose={onClose} onAction={onAction} />
      )
    }[type] || null
  )
}

export default ModalSwitcher
