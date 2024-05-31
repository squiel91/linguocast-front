import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Fragment } from "react"

interface Props {
  current: string
  crumbs?: { name: string, to: string }[]
}

export const Breadcrumb = ({ current, crumbs = [] }: Props) => (
  <div className='flex gap-2 mb-6 items-center text-gray-400'>
    <Link className='text-primary' to="/">Home</Link>
    {crumbs.map(({ name, to }) => (
      <Fragment key={to}>
        <ChevronRightIcon size={16} />
        <Link className='text-primary' to={to}>{name}</Link>
      </Fragment>
    ))}
    <ChevronRightIcon size={16} />
    <div>{current}</div>
  </div>
)
