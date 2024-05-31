import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Fragment } from "react"

interface Props {
  current: string
  crumbs?: { name: string, to: string }[]
}

export const Breadcrumb = ({ current, crumbs = [] }: Props) => (
  <div className='flex flex-wrap gap-2 mb-6 items-center text-gray-400'>
    <Link className='text-primary' to="/">Home</Link>
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
