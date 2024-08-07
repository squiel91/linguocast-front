import { ReactNode } from 'react'
import { ChevronsUpDownIcon } from 'lucide-react'

export interface Option {
  value: string | null
  text: string
  append?: ReactNode
  selectable?: boolean
}

interface Props {
  label?: string
  value: string | null
  options: Option[]
  onChange: (value: string | null) => void
  disabled?: boolean
}

const NULL = '_virtual_null'

export const Select = ({ value,
  options,
  onChange: changeHandler,
  label,
  disabled
}: Props) => {
  const appendIcon = options.find(({ value: optionValue }) => optionValue === value)?.append

  const selectElement = (
    <div className='relative'>
      <select
        className='px-4 py-2 w-full border-2 border-solid border-slate-200 rounded-md appearance-none bg-transparent'
        value={value ?? NULL}
        onChange={event => changeHandler(event.target.value === NULL ? null : event.target.value)}
        disabled={disabled}
      >
        {options.map(({ value, text, selectable = true }) => (
          <option value={value ?? NULL} key={value} hidden={!selectable} disabled={!selectable}>{text}</option>
        ))}
      </select>
      {appendIcon && (
        <div className='absolute right-9 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none flex items-center justify-center'>
          {appendIcon}
        </div>
      )}
      <ChevronsUpDownIcon strokeWidth={1} className='w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' />
    </div>
  )

  if (!label) return selectElement

  return (
    <label>
      <div className='mb-1 text-sm'>{label}</div>
      {selectElement}
    </label>
  )
}