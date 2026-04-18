// import { createPortal } from 'react-dom'
// import { X } from 'lucide-react'
// import clsx from 'clsx'

// export default function Modal({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = 'md'
// }) {
//   if (!isOpen) return null

//   return createPortal(
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center">

//       {/* overlay */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* modal */}
//       <div
//         className={clsx(
//           "relative bg-white rounded-2xl shadow-xl w-full mx-4",
//           size === 'sm' && "max-w-md",
//           size === 'md' && "max-w-lg",
//           size === 'lg' && "max-w-2xl"
//         )}
//       >
//         {title && (
//           <div className="flex items-center justify-between px-6 py-4 border-b">
//             <h3 className="font-semibold text-navy-900">
//               {title}
//             </h3>

//             <button
//               onClick={onClose}
//               className="p-1 rounded-lg hover:bg-slate-100"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         )}

//         <div className="p-6">
//           {children}
//         </div>

//       </div>
//     </div>,
//     document.body
//   )
// }
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal — flex column, capped at 90vh so it never overflows screen */}
      <div
        className={clsx(
          "relative bg-white rounded-2xl shadow-xl w-full flex flex-col",
          "max-h-[90vh]",          // ← total modal height cap
          size === 'sm' && "max-w-md",
          size === 'md' && "max-w-lg",
          size === 'lg' && "max-w-2xl"
        )}
      >
        {/* Title — sticky, never scrolls away */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <h3 className="font-semibold text-navy-900 truncate pr-4">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Scrollable body — invisible scrollbar */}
        <div
          className="flex-1 min-h-0 p-6 overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.modal-body::-webkit-scrollbar { display: none; }`}</style>
          {children}
        </div>

      </div>
    </div>,
    document.body
  )
}