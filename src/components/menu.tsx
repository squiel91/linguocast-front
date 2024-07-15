import { cn } from "@/utils/styles.utils"
import { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ClassNameValue } from "tailwind-merge"

interface Props {
  items: {
    text: string
    icon?: ReactNode
    link?: string
    selected?: boolean
    disabled?: boolean
    onClick?: () => void
  }[]
  className?: ClassNameValue
  forCreators?: boolean
  underline?: boolean
}

interface ButtonProps {
  children: ReactNode
  icon?: ReactNode
  forCreators?: boolean
  onClick?: () => void
}

const MenuButton = ({
  children,
  onClick: clickHandler,
  icon,
  forCreators = false
}: ButtonProps) => (
  <button
    onClick={clickHandler}
    className={cn(
      'py-2 px-4 font-[600] rounded-md flex gap-2 items-center',
      forCreators ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
    )}
  >
    {icon}
    {children}
  </button>
)

export const Menu = ({ items, underline = false, forCreators, className }: Props) => (
  <menu
    className={cn(
      'flex gap-2 overflow-x-auto',
      forCreators ? 'text-white' : 'text-slate-900',
      underline ? 'border-b-2 border-slate-200' : '',
      className
    )}
  >
    {items.map(({ text, icon, link, onClick: clickHandler, selected = false, disabled = false }, index) => (
      <li key={index} className={cn('py-1 border-y-4 border-transparent', selected ? 'border-b-4 border-b-primary' : '', disabled ? 'opacity-50 pointer-events-none' : '')}>
        {link ? (
          <Link to={link}>
            <MenuButton icon={icon} onClick={clickHandler} forCreators={forCreators}>{text}</MenuButton>
          </Link>
        ) : (
          <MenuButton icon={icon} onClick={clickHandler}>{text}</MenuButton>
        )}
      </li>
    ))}
  </menu>
)