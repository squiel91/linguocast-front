import { Loader2Icon } from 'lucide-react'
import { ReactNode } from 'react'
import { cn } from '../utils/styles.utils'

interface Props {
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'outline' | 'discrete',
  compact?: boolean
  wFullInMobile?: boolean
  prepend?: ReactNode
  append?: ReactNode
  children?: ReactNode
}
export const Button = ({
  onClick: clickHandler,
  disabled,
  className,
  isLoading = false,
  variant = 'primary',
  compact = false,
  wFullInMobile = false,
  prepend,
  append,
  children
}: Props) => (
  <button
    onClick={clickHandler}
    disabled={disabled}
    className={cn(
      'relative font-[600]',
      variant === 'primary'
        ? 'bg-red-300 border-[3px] border-slate-800'
        : variant === 'outline'
          ?'text-slate-800 border-slate-800 border-2 border-solid'
          : 'text-slate-800',
      compact ? 'px-3 py-1' : 'text-lg px-5 py-2',
      wFullInMobile ? 'w-full md:w-auto' : 'w-auto',
      'rounded-md',
      disabled? 'opacity-50' : '',
      className
    )}
  >
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
      {isLoading && <Loader2Icon strokeWidth={3} className='animate-spin'/>}
    </div>
    <div className={cn('flex gap-2 items-center justify-center', isLoading ? 'opacity-0' : '')}>
      {prepend}<div>{children}</div>{append}
    </div>
  </button>
)

