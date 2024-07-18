import { cn } from "@/utils/styles.utils"
import { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ClassNameValue } from "tailwind-merge"

export interface MenuItem {
  smText?: ReactNode
  text: ReactNode
  icon?: ReactNode
  link?: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}

interface Props {
  items: MenuItem[]
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
    {items.map(({ smText, text, icon, link, onClick: clickHandler, selected = false, disabled = false }, index) => (
      <li key={index} className={cn('py-1 border-y-4 border-transparent', selected ? 'border-b-4 border-b-primary' : '', disabled ? 'opacity-50 pointer-events-none' : '')}>
        {link ? (
          <Link to={link}>
            <MenuButton icon={icon} onClick={clickHandler} forCreators={forCreators}>
              {smText
                ? (
                  <>
                    <div className="md:hidden">{smText}</div>
                    <div className="hidden md:inline-block">{text}</div>
                  </>
                )
                : text
              }
            </MenuButton>
          </Link>
        ) : (
          <MenuButton icon={icon} onClick={clickHandler}>
            {smText
              ? (
                <>
                  <div className="md:hidden">{smText}</div>
                  <div className="hidden md:inline-block">{text}</div>
                </>
              )
              : text
            }
          </MenuButton>
        )}
      </li>
    ))}
  </menu>
)