import { Button } from './components/ui/button'
import { useModalStore } from './stores/useModalStore'

const Demo = () => {
  const openModal = useModalStore().openModal
  const closeModal = useModalStore().closeModal

  const handleOpenModal = () => {
    openModal({
      type: 'USER_MODAL',
      onAction: (e) => {
        e.preventDefault()
        closeModal()
      },
      onClose: () => {
        closeModal()
      }
    })
  }

  const handleSettingModal = () => {
    openModal({
      type: 'SETTING_MODAL',
      onAction: (e) => {
        e.preventDefault()
        closeModal()
      },
      onClose: () => {
        closeModal()
      }
    })
  }

  return (
    <div className='mt-10 w-[300px]'>
      <Button onClick={handleOpenModal}>Open Modal</Button>
      <br />
      <Button className='mt-10' onClick={handleSettingModal}>
        SETTING MODAL
      </Button>
    </div>
  )
}

export default Demo
