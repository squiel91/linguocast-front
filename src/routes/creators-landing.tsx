import { useAuth } from "@/auth/auth.context"
import { Button } from "@/ui/button.ui"
import axios from "axios"
import { ReactNode, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Zap, Users, Rocket, Heart, Rss, WalletIcon, LucideIcon } from 'lucide-react'
import linguocastLogo from '@/assets/linguocast-logo.svg'

const Section = ({ icon: Icon, title, children }: { icon: LucideIcon, title: string, children: ReactNode }) => (
  <section className="flex items-start space-x-8 py-12 border-b border-gray-200 last:border-b-0">
    <Icon size={48} className="text-primary flex-shrink-0 mt-1" />
    <div>
      <h2 className="text-3xl mb-4">{title}</h2>
      {children}
    </div>
  </section>
)

export const CreatorsLanding = () => {
  const navigate = useNavigate()
  const { user, modifyUser, openRegisterHandler } = useAuth()
  const [isActivatingCreatorsMode, setIsActivatingCreatorsMode] = useState(false)

  const activateCreatorModeHandler = async () => {
    try {
      setIsActivatingCreatorsMode(true)
      await axios.patch('/api/user', { isCreator: true })
      modifyUser({ ...user!, isCreator: true })
      navigate('/creators/podcasts/source')
    } catch (error) {
      console.error(error)
      alert('There was an error while trying to activate the creator mode. Please try again or contact support.')
    } finally {
      setIsActivatingCreatorsMode(false)
    }
  }

  return (
    <div>
      <nav className="border-b-2 px-4 md:px-8 flex justify-between flex-wrap py-6 items-center gap-4 text-slate-800">
        <img src={linguocastLogo} className='w-32 md:w-40' />
      </nav>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <section className="text-center mb-16 flex flex-col items-center">
          <Zap size={64} className="text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl mb-6">
            Supercharge Your Language Learning Podcast
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mb-8">
            Elevate your content on a platform designed exclusively for language learning enthusiasts. It's time to transform your podcast into an immersive educational experience!
          </p>
          {!user && (
            <>
              <Button onClick={() => openRegisterHandler(true, true)} className="text-xl px-8 py-3">Sign-up/in as a creator</Button>
              <p className='mt-2 text-sm'>100% free for creators.</p>
            </>
          )}
          {!!user && !user.isCreator && (
            <Button
              isLoading={isActivatingCreatorsMode}
              onClick={activateCreatorModeHandler}
              className="xtxt-lg px-8 py-3"
            >
              Activate creator mode
            </Button>
          )}
          {!!user && !!user.isCreator && (
            <Link to="/creators/podcasts">
              <Button className="text-xl px-8 py-3">Manage my podcasts</Button>
            </Link>
          )}
        </section>

        <Section icon={Users} title="Tap into a Thriving Community of Language Enthusiasts">
          <p className="text-lg">
            Get discovered by a motivated language learning community and expand your audience in an organic way.
          </p>
        </Section>

        <Section icon={Rocket} title="Skyrocket Engagement with Dedicated Language Learning Tools">
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>Auto-generated transcript for learners to read-along</li>
            <li>Create exercises to test your listeners</li>
            <li>Attach extra context at the precise times of the episode</li>
          </ul>
        </Section>

        <Section icon={WalletIcon} title="Turn Your Passion into Profit">
          <p className="text-lg">Reap rewards from our revenue pool, with earnings directly tied to your growing audience and their engagement. Your success is our success!</p>
        </Section>

        <Section icon={Heart} title="Forge Deeper Connections with Your Audience">
          <p className="text-lg">Gain invaluable insights into your listeners' preferences and interact with them in meaningful, impactful ways.</p>
        </Section>

        <Section icon={Rss} title="Seamless Integration for New and Existing Podcasts">
          <p className="text-lg">
            Whether you're starting fresh or bringing your established show, Linguocast adapts to you. Host for free or easily connect your existing RSS feed - the choice is yours!
          </p>
        </Section>
      </div>
    </div>
  )
}