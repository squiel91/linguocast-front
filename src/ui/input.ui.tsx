import { ReactNode } from 'react'
import { cn } from '../utils/styles.utils'

interface Props {
  name?: string
  value: string | null
  type?: 'text' | 'number' | 'password' | 'email'
  label?: ReactNode
  max?: number,
  min?: number
  details?: string
  onChange?: (value: string | null) => void
  onEnter?: () => void
  placeholder?: string
  disabled?: boolean
  prepend?: ReactNode
  append?: ReactNode
  className?: string
  noAutocoplete?: boolean
}

export const Input = ({
  name,
  value,
  type = 'text',
  label,
  max,
  min,
  details,
  onChange: changeHandler,
  onEnter: enterHandler,
  placeholder,
  disabled = false,
  prepend,
  append,
  noAutocoplete = false,
  className
}: Props) => {
  const inputElement = (
    <div className={cn('relative', label ? '' : className)}>
      {prepend && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500 appearance-none bg-transparent'>
          {prepend}
        </div>
      )}
      <input
        autoComplete={noAutocoplete ? 'off' : 'on'}
        className={cn(
          'p-4 py-2 w-full border-2 border-solid border-slate-200 rounded-md',
          prepend ? 'pl-9' : '',
          append ? 'pr-9' : '',
          disabled ? 'opacity-60' : ''
        )}
        onKeyDown={(event) => {
          if (event.key === 'Enter') enterHandler?.()
        }}
        name={name}
        max={max}
        min={min}
        id={name}
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={event => changeHandler?.(event.target.value || null)}
        disabled={disabled}
      />
      {append && (
        <div className='absolute right-3 top-1/2 -translate-y-1/2'>
          {append}
        </div>
      )}
    </div>
  )
  if (label) return (
    <label className={className}>
      {label && <div className='text-sm mb-1'>{label}</div>}
      {inputElement}
      {details && <div className='text-sm mt-1 text-gray-400 italic'>{details}</div>}
    </label>
  )
  return inputElement
}
