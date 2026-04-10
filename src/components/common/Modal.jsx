import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div
        className={clsx(
          "relative bg-white rounded-2xl shadow-xl w-full mx-4",
          size === 'sm' && "max-w-md",
          size === 'md' && "max-w-lg",
          size === 'lg' && "max-w-2xl"
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="font-semibold text-navy-900">
              {title}
            </h3>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>,
    document.body
  )
}