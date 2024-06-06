import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Fragment } from "react"
import { useAuth } from "@/auth/auth.context"

interface Props {
  current: string
  crumbs?: { name: string, to: string }[]
}

export const Breadcrumb = ({ current, crumbs = [] }: Props) => {
  const { isLoggedIn } = useAuth()

  return (
    <div className='flex gap-2 md:gap-2 mb-6 items-center text-gray-400'>
      <Link className='text-primary' to={isLoggedIn ? '/feed' : '/explore'}>
      {isLoggedIn ? 'Feed' : 'Explore'}
      </Link>
      {crumbs.map(({ name, to }) => (
        <Fragment key={to}>
          <ChevronRightIcon size={16} className="flex-shrink-0" />
          <Link className="text-primary line-clamp-1" to={to}>{name}</Link>
        </Fragment>
      ))}
      <ChevronRightIcon size={16} className="flex-shrink-0" />
      <div className="line-clamp-1">{current}</div>
    </div>
  )
}
