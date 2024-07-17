import { ChevronDownIcon } from 'lucide-react'
import { Button } from './button.ui'
import { Card } from './card.ui'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/styles.utils'

interface DropdownBase {
  title: string
  description?: string
  icon: ReactNode
  unformated?: boolean
}

interface DropwdownLinkItem extends DropdownBase {
  to: string
}
interface DropwdownActionItem extends DropdownBase {
  onClick: () => void
}

type DropdownItem = DropwdownLinkItem | DropwdownActionItem 

interface Props {
  items: DropdownItem[]
  unformated?: boolean
  children: ReactNode
}

export const Dropdown = ({ items, unformated = false, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleItemClick = (clickHandler: () => void) => {
    clickHandler()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {unformated
        ? <button onClick={() => setIsOpen(o => !o)}>{children}</button>
        : <Button onClick={() => setIsOpen(o => !o)} append={<ChevronDownIcon size={20} strokeWidth={2.5} />} >{children}</Button>
      }
      
      {isOpen && (
        <Card className={cn('flex flex-col gap-2 py-2 px-4 absolute right-0 top-full mt-2 shadow-md mb-4 z-10', unformated ? '' : 'p-2 w-72  mt-4')} >
          {items.map(({ title, description, icon, unformated = false, ...onClickOrLinkTo }) => {
            const button = (
              <button
                key={title}
                className={cn('flex gap-4 text-left text-sm p-2 items-center', unformated ? '' : 'border-[1px] border-slate-200 rounded-md hover:border-black p-4')}
                onClick={'onClick' in onClickOrLinkTo ? () => handleItemClick(onClickOrLinkTo.onClick) : undefined}
              >
                <div className="flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="font-bold">{title}</div>
                  {description && <div>{description}</div>}
                </div>
              </button>
            )
            if ('onClick' in onClickOrLinkTo) return button
            return <Link to={onClickOrLinkTo.to}>{button}</Link>
          })}
        </Card>
      )}
    </div>
  )
}