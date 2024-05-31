import { Link, Outlet } from "react-router-dom"
import { Button } from "../../ui/button.ui"
import { Footer } from "./footer.themes"
import linguocastLogo from '@/assets/linguocast-logo.svg' 
import { useAuth } from "../../auth/auth.context"
import { LogOut, UserPlusIcon } from "lucide-react"

const MainTheme = () => {
  const {
    isLoggedIn,
    user,
    openRegisterHandler,
    openLoginHandler,
    logoutHandler
  } = useAuth()

  return (
    <>
      <nav className="container flex justify-between flex-wrap pt-8 pb-2 gap-4">
        <Link to="/"><img src={linguocastLogo} className='w-56' /></Link>
        {isLoggedIn
          ? <div className="flex items-center gap-2">
              {user && `Hey ${user.name}!`}
              <Button
                variant='discrete'
                prepend={<LogOut size={16} />}
                onClick={logoutHandler}
              >
                Logout
              </Button>
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
