import ModalLayout from '../../layouts/ModalLayout'
import { useModalStore } from '../../stores/useModalStore'

const DemoModal = ({ onClose, onAction }) => {
  const closeModal = useModalStore().closeModal

  const handleCloseModal = () => {
    onClose()
    closeModal()
  }

  return (
    <ModalLayout onClose={handleCloseModal} title='Submit Form' size='md'>
      <form onSubmit={onAction} className='space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium'>
            Name
          </label>
          <input
            id='name'
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        <div className='flex justify-end space-x-2'>
          <button
            type='button'
            onClick={handleCloseModal}
            className='px-4 py-2 border rounded-md'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded-md'
          >
            Submit
          </button>
        </div>
      </form>
    </ModalLayout>
  )
}

export default DemoModal
