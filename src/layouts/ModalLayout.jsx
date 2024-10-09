import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../utils/common/cn'

const ModalLayout = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true
}) => {
  const modalRef = useRef(null)
  const contentRef = useRef(null)

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEsc, onClose])

  // Handle click outside
  const handleBackdropClick = (event) => {
    if (
      closeOnClickOutside &&
      modalRef.current === event.target &&
      !contentRef.current?.contains(event.target)
    ) {
      onClose()
    }
  }

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[90vw] min-h-[90vh]'
  }

  const modalContent = (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden='true'
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className={cn(
          'relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          'transform transition-all duration-300',
          sizeClasses[size],
          isOpen ? 'scale-100' : 'scale-95'
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-4 border-b dark:border-gray-700'>
            {title && (
              <div>
                <h2
                  id='modal-title'
                  className='text-lg font-semibold text-gray-900 dark:text-white'
                >
                  {title}
                </h2>
                {description && (
                  <p
                    id='modal-description'
                    className='mt-1 text-sm text-gray-500 dark:text-gray-400'
                  >
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
                aria-label='Close modal'
              >
                <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className='p-4 overflow-y-auto max-h-[calc(90vh-8rem)]'>
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default ModalLayout
