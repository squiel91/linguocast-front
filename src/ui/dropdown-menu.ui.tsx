import { ChevronDownIcon } from 'lucide-react'
import { Button } from './button.ui'
import { Card } from './card.ui'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

interface DropdownBase {
  title: string
  description?: string
  icon: ReactNode
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
  children: ReactNode
}

export const DropdownMenu = ({ items, children }: Props) => {
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
      <Button onClick={() => setIsOpen(o => !o)} append={<ChevronDownIcon size={20} strokeWidth={2.5} />} >{children}</Button>
      {isOpen && (
        <Card className="flex flex-col gap-2 p-2 absolute right-0 top-full w-72 mt-4 shadow-md mb-4 z-10">
          {items.map(({ title, description, icon, ...onClickOrLinkTo }) => {
            const button = (
              <button
                key={title}
                className="border-[1px] border-slate-200 rounded-md flex gap-4 p-4 hover:border-black text-left text-sm"
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