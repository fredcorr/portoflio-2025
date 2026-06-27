'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  label?: string
  error?: string
  /** Disabled placeholder option text for single-select fields. Defaults to `label`. */
  placeholder?: string
  /** Class applied to the wrapping element. */
  wrapperClassName?: string
}

/**
 * Native `<select>` atom.
 *
 * - Single-select renders as a styled form field: a disabled placeholder
 *   option (from `placeholder` or `label`) plus optional error text.
 * - Pass `multiple` for the bare, caller-styled variant used by filters and as
 *   the mobile fallback for custom dropdowns (keeps the native iOS experience).
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      options,
      error,
      placeholder,
      required,
      multiple,
      className,
      wrapperClassName,
      onChange,
      ...props
    },
    ref
  ) => {
    const fieldId = id || props.name || 'select'
    const errorId = `${fieldId}-error`
    const placeholderText = placeholder ?? label
    const [isPlaceholder, setIsPlaceholder] = React.useState(!multiple)

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={fieldId} className="sr-only">
            {label}
            {required && ' *'}
          </label>
        )}
        <select
          id={fieldId}
          ref={ref}
          multiple={multiple}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          defaultValue={multiple ? undefined : ''}
          onChange={event => {
            onChange?.(event)
            !multiple && setIsPlaceholder(event.target.value === '')
          }}
          className={cn(
            !multiple &&
              'w-full appearance-none border border-transparent border-gray-100 bg-gray-50 px-5 py-4 text-body-md focus:border-gray-200 focus:outline-none focus:ring-1 focus:ring-black dark:bg-gray-100',
            !multiple &&
              (isPlaceholder
                ? 'text-black/40 dark:text-foreground/60'
                : 'text-black dark:text-foreground'),
            className
          )}
          {...props}
        >
          {!multiple && placeholderText && (
            <option value="" disabled>
              {placeholderText}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-sm text-status-error"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
export { Select }
