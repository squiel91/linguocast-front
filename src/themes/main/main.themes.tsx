import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { Button } from "../../ui/button.ui"
import { Footer } from "./footer.themes"
import linguocastLogo from '@/assets/linguocast-logo.svg' 
import { useAuth } from "../../auth/auth.context"
import { PencilIcon, UserPlusIcon } from "lucide-react"
import { Avatar } from "@/ui/avatar.ui"
import { useEffect, useState } from "react"

const MainTheme = () => {
  const {
    isLoggedIn,
    user,
    openRegisterHandler,
    openLoginHandler
  } = useAuth()

  const location = useLocation()
  const { episodeId } = useParams()

  const [isVistingViewEpisode, setIsVistingViewEpisode] = useState(false)

  useEffect(() => {
    setIsVistingViewEpisode(location.pathname.startsWith('/episodes/'))
  }, [location.pathname])

  return (
    <>
      {user?.isAdmin && isVistingViewEpisode && (
        <div className="bg-slate-900 py-2">
          <div className="container text-slate-100">
            <Link to={`/episodes/${episodeId}/edit`}>
              <button className="bg-slate-800 rounded-lg py-1 px-4 flex gap-2 items-center">
                <PencilIcon size={14} />
                Edit episode
              </button>
            </Link>
          </div>
        </div>
      )}
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
