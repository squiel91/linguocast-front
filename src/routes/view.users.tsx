import { PrivateUser, PublicUser } from "@/types/types"
import { Avatar } from "@/ui/avatar.ui"
import { Button } from "@/ui/button.ui"
import { Loader } from "@/ui/loader.ui"
import { readableDate } from "@/utils/date.utils"
import { capitalize } from "@/utils/text.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { GlobeLockIcon, MailIcon } from "lucide-react"
import { useParams } from "react-router-dom"

const ViewUser = () => {
  const { userId } = useParams()

  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => axios.get<PrivateUser | PublicUser>(`/api/users/${userId}`).then(res => res.data)
  })

  if (!user) return <Loader />
  
  return (
    <div className="container">
      <div className="grid grid-cols-3 gap-8 py-8">
        <Avatar avatarUrl={user.avatar} className="w-full" />
        <div>
          <h1 className="text-4xl pb-8">{user.name}</h1>
          {!('createdAt' in user)
            ? (
              <div className="flex items-center gap-2 mt-2 text-gray-400">
                <GlobeLockIcon />
                This profile is private
              </div>
            )
            : (
              <>
                {user.canOthersContact ? (<a href={`mailto:hey+${user.id}@linguocast.com`}><Button variant="discrete" prepend={<MailIcon size={16} />}>Send message</Button></a>) : ''}
                <div>Studying {capitalize(user.learning)}.</div>
                {user.level && <div>{capitalize(user.level)} level</div>}
                <div>Member since {readableDate(user.createdAt)}.</div>
                TODO: following podcasts<br />
                TODO: latest comments && reviews<br />
                TODO: Summary of its learning journey<br />
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ViewUser
