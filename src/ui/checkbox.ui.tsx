import { CheckIcon } from 'lucide-react'
import { cn } from '../utils/styles.utils'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}
export const Checkbox = ({ checked, onChange: changeHandler, disabled = false }: Props) => (
  <>
    <div
      className={cn(
        'w-4 h-4 border-2 border-solid border-slate-200 rounded-sm text-primary flex items-center justify-center not-sr-only',
        disabled ? 'opacity-50' : '')
      }
    >
      {checked && <CheckIcon strokeWidth={4} />}
    </div>
    <input
      type='checkbox'
      checked={checked}
      onChange={event => changeHandler(event.target.checked)}
      className="sr-only"
      disabled={disabled}
    />
  </>
)
