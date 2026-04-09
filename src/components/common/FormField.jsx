import clsx from 'clsx'
import React, { forwardRef } from 'react'

export default function FormField({ label, error, required, children, hint }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {children}

      {hint && !error && (
        <p className="text-xs text-slate-lms mt-1">{hint}</p>
      )}

      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  )
}

/* ================= INPUT ================= */

export const Input = forwardRef(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'input',
          error && 'input-error',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'


/* ================= SELECT ================= */

export const Select = forwardRef(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          'input',
          error && 'input-error',
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'


/* ================= TEXTAREA ================= */

export const Textarea = forwardRef(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'input min-h-[100px] resize-y',
          error && 'input-error',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'