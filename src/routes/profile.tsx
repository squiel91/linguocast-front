import { useAuth } from "@/auth/auth.context"
import { Avatar } from "@/ui/avatar.ui"
import { Breadcrumb } from "@/ui/breadcrumb.ui"
import { Button } from "@/ui/button.ui"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { LogOut } from "lucide-react"

const Profile = () => {
  const { user, logoutHandler } = useAuth()

  if (!user) return <Loader />

  return (
    <>
      <Breadcrumb current="Profile" />
      <h1 className="text-4xl mb-4 font-bold">Profile</h1>
      <Avatar className="w-24" />
      <div>TODO Upload new profile picture</div>
      <div>
        <Input label="Name" value={user.name} />
      </div>
      <div>TODO Profile is private</div>
      <div>TODO Change email (remind email is not visible)</div>
      <div>TODO fluentIn: languages</div>
      <div>TODO learning: languages</div>
      <div>TODO levels</div>
      <div>TODO Delete account</div>
      <Button
        variant='discrete'
        prepend={<LogOut size={16} />}
        onClick={logoutHandler}
      >
        Logout
      </Button>
    </>
  )
}

export default Profile
