import { useAuth } from "@/auth/auth.context"
import { Button } from "@/ui/button.ui"
import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

export const CreatorsLanding = () => {
  const { user, modifyUser } = useAuth()
  const [isActivatingCreatorsMode, setIsActivatingCreatorsMode] = useState(false)

  const activateCretorModeHandler = async () => {
    try {
      setIsActivatingCreatorsMode(true)
      await axios.patch('/api/user', { isCreator: true })
      modifyUser({ ...user!, isCreator: true })
    } catch (error) {
      console.error(error)
      alert('There was an error while trying to activate the creator mode. Please try again or contact support.')
    } finally {
      setIsActivatingCreatorsMode(false)
    }
  }
  return (
    <div className="container">
      <section className="my-16">
        <h1 className="text-6xl">Become a creator</h1>
        <ol>
          <li>Expand your audience</li>
          <li>Make your episodes more engaging and effective for language learners</li>
          <li>Monetize for subscriptions</li>
        </ol>
        <p>The space for your language learning podcast</p>
        {!user && <Button>Sign-up as a creator</Button>}
        {user && !user.isCreator && (
          <Button
            isLoading={isActivatingCreatorsMode}
            onClick={activateCretorModeHandler}
          >
            Activate creator mode
          </Button>
        )}
        {user && user.isCreator && (
          <Link to="/creators/podcasts">
            <Button>Manage my podcasts</Button>
          </Link>
        )}
      </section>
      <section>
        Host it for free
      </section>
    </div>
  )
}