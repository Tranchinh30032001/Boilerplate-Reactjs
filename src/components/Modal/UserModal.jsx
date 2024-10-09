import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ModalWrapper } from './ModalWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '../ui/button'

const UserModal = ({ onClose, onAction }) => {
  return (
    <ModalWrapper
      size='full'
      title='USER MODAL'
      onClose={onClose}
      onAction={onAction}
    >
      <Tabs defaultValue='personal' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='personal'>Thông Tin Cá Nhân</TabsTrigger>
          <TabsTrigger value='account'>Tài Khoản</TabsTrigger>
          <TabsTrigger value='notifications'>Thông Báo</TabsTrigger>
        </TabsList>
        <form className='h-[300px]'>
          <TabsContent value='personal'>
            <div className='space-y-4 py-4'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage
                    src='/placeholder.svg?height=96&width=96'
                    alt='Avatar'
                  />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <Button variant='outline'>Thay Đổi Ảnh</Button>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Họ Tên
                </Label>
                <Input id='name' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='username' className='text-right'>
                  Tên Người Dùng
                </Label>
                <Input id='username' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='bio' className='text-right'>
                  Tiểu Sử
                </Label>
                <Textarea id='bio' className='col-span-3' />
              </div>
            </div>
          </TabsContent>
          <TabsContent value='account'>
            <div className='space-y-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='email' className='text-right'>
                  Email
                </Label>
                <Input id='email' type='email' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='language' className='text-right'>
                  Ngôn Ngữ
                </Label>
                <Select>
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Chọn ngôn ngữ' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='vi'>Tiếng Việt</SelectItem>
                    <SelectItem value='en'>English</SelectItem>
                    <SelectItem value='fr'>Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='two-factor' />
                <Label htmlFor='two-factor'>Bật xác thực hai yếu tố</Label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='notifications'>
            <div className='space-y-4 py-4'>
              <div className='flex items-center space-x-2'>
                <Switch id='email-notifications' />
                <Label htmlFor='email-notifications'>
                  Nhận thông báo qua email
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='push-notifications' />
                <Label htmlFor='push-notifications'>Bật thông báo đẩy</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='marketing-emails' />
                <Label htmlFor='marketing-emails'>Nhận email tiếp thị</Label>
              </div>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </ModalWrapper>
  )
}

export default UserModal
