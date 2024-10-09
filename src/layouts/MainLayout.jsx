import { ModalManager } from '../features/ModalManager'
import { useModalStore } from '../stores/useModalStore'

const MainLayout = () => {
  const openModal = useModalStore().openModal
  const closeModal = useModalStore().closeModal
  const handleOpenModal = () => {
    openModal({
      type: 'MODAL_DEMO',
      props: { title: 'Demo Modal' },
      onAction: (e) => {
        e.preventDefault()
        closeModal()
      },
      onClose: () => {}
    })
  }

  return (
    <div>
      <button onClick={handleOpenModal}>openMOdalDemo</button>
      <ModalManager />
    </div>
  )
}

export default MainLayout
