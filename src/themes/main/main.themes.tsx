import { Link, Outlet } from "react-router-dom"
import { Button } from "../../ui/button.ui"
import { Footer } from "./footer.themes"
import linguocastLogo from '@/assets/linguocast-logo.svg' 
import { useAuth } from "../../auth/auth.context"
import { UserPlusIcon } from "lucide-react"
import { Avatar } from "@/ui/avatar.ui"

const MainTheme = () => {
  const {
    isLoggedIn,
    user,
    openRegisterHandler,
    openLoginHandler
  } = useAuth()

  return (
    <>
      <nav className="container flex justify-between flex-wrap pt-4 items-center gap-4">
        <img src={linguocastLogo} className='w-40 md:w-56' />
        {isLoggedIn
          ? <div className="flex items-center gap-3">
              <span className="hidden md:inline">{user && `Hey ${user.name}!`}</span>
              <Link to="/profile">
                <Avatar className="w-10 md:w-12" avatarUrl={user?.avatar} />
              </Link>
            </div>
          : (
            <div className='flex gap-2'>
              <Button
                variant='discrete'
                onClick={() => openLoginHandler(true)}
              >
                Login
              </Button>
              <Button onClick={() => openRegisterHandler(true)}>
                <div className='flex gap-2 items-center px-2'>
                  <UserPlusIcon size={18} />Join</div>
                </Button>
            </div>
          )
        }
      </nav>
      <main className='container mb-24'>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainTheme
