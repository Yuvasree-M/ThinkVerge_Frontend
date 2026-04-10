import { X } from "lucide-react"
import clsx from "clsx"

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">

        {/* header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-navy-900">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* message */}
        <p className="text-sm text-slate-600 mb-6">
          {message}
        </p>

        {/* actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-semibold text-white",
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-royal-gradient"
            )}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  )
}