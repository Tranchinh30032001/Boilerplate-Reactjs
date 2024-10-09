import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw] min-h-[90vh]'
}

export function ModalWrapper({
  title,
  description,
  size,
  onClose,
  onAction,
  children
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onAction}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
