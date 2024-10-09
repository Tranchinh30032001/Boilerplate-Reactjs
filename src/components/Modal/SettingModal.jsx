import { ModalWrapper } from './ModalWrapper'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const SettingModal = ({ onClose, onAction }) => {
  return (
    <ModalWrapper title='Setting Info' onAction={onAction} onClose={onClose}>
      <form>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Tên
            </Label>
            <Input id='name' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Tên người dùng
            </Label>
            <Input id='username' className='col-span-3' />
          </div>
        </div>
      </form>
    </ModalWrapper>
  )
}

export default SettingModal
