import noAvatar from '@/assets/no-avatar.jpg'
import { cn } from '@/utils/styles.utils'

interface Props {
  avatarUrl?: string,
  className?: string
}

export const Avatar = ({ avatarUrl, className }: Props) => (
  <img
    src={avatarUrl ?? noAvatar}
    className={cn(
      'aspect-square w-12 object-center object-cover rounded-full',
      className
    )}
  />
)