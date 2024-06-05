import { useAuth } from "@/auth/auth.context"
import { Loader } from "@/ui/loader.ui"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const EntyPoint = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // Redirects to the users feed if started in the base domain
  useEffect(() => {
    navigate(isLoggedIn ? '/feed' : '/explore', { replace: true })
  }, [isLoggedIn, navigate])

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader />
    </div>
  )
}

export default EntyPoint
