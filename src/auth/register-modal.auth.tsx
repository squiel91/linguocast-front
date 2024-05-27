import { Button } from "@/ui/button.ui"
import { Input } from "@/ui/input.ui"

import { isValidEmail } from "@/utils/validations.utils"
import axios from "axios"
import { useState } from "react"
import { MinifiedUser, useAuth } from "@/auth/auth.context"
import Dialog from "@/ui/dialog.ui"
import { MoveRightIcon } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const RegisterModal = ({ isOpen, onClose: closeHandler }: Props) => {
  const { openRegisterHandler, openLoginHandler, loginHandler: loginAuthHandler } = useAuth()

  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const registerHandler = async () => {
    if (!isValidEmail(email ?? '')) return alert('The emails is not valid')
    if (!name) return alert('The name is required')
    if ((password?.length ?? 0) < 6) return alert('The password must be at lest 6 characters long')

    try {
      setIsLoading(true)
      const { data: { token, user } } = await axios.post<{ token: string, user: MinifiedUser }>('/api/users', {
        email, name, password
      })
      loginAuthHandler(user, token)
      openRegisterHandler(false)
    } catch (error) {
      console.error(error)
      alert('There was an unexpected error!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={closeHandler}>
          <div className="text-lg mb-2 font-bold">Join the language learning community</div>
        <p className="mb-4">
          Join to start commenting, rating and adding and editing podcasts.
        </p>
        <div className="flex flex-col gap-2 mb-4">
          <Input label="Email" value={email ?? ''} onChange={(value) => setEmail(value)} disabled={isLoading} />
          <Input label="Name" value={name ?? ''} onChange={(value) => setName(value)} disabled={isLoading} />
          <Input label="Password" type="password" value={password ?? ''} onChange={(value) => setPassword(value)} disabled={isLoading} />
        </div>
        <div className="flex flex-col gap-4 mt-4 w-full">
        <Button onClick={registerHandler} isLoading={isLoading}>
          Join
        </Button>
        <div className="text-sm">
          Not registered yet? <button className="text-primary inline-flex items-center gap-2" onClick={() => {
            openRegisterHandler(false)
            setTimeout(() => openLoginHandler(true), 100)
          }}>Already registered <MoveRightIcon size={16} /></button>
        </div>
      </div>
    </Dialog>
  )
}