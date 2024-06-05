import { Button } from "@/ui/button.ui"
import { Input } from "@/ui/input.ui"

import { isValidEmail } from "@/utils/validations.utils"
import axios from "axios"
import { useState } from "react"
import { useAuth } from "@/auth/auth.context"
import Dialog from "@/ui/dialog.ui"
import { MoveRightIcon } from "lucide-react"
import { Select } from "@/ui/select.ui"
import { Language, SelfUser } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { capitalize } from "@/utils/text.utils"
import { useNavigate } from "react-router-dom"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const RegisterModal = ({ isOpen, onClose: closeHandler }: Props) => {
  const navigate = useNavigate()
  const { openRegisterHandler, openLoginHandler, loginHandler: loginAuthHandler } = useAuth()

  const { data: languages, isFetching: isFetchingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data)
  })

  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [learning, setLearning] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const registerHandler = async () => {
    if (!isValidEmail(email ?? '')) return alert('The emails is not valid.')
    if (!name) return alert('The name is required.')
    if (!learning) return alert('You need to choose the language you are learning.')
    if ((password?.length ?? 0) < 6) return alert('The password must be at lest 6 characters long.')

    try {
      setIsLoading(true)
      const { data: { token, user } } = await axios.post<{ token: string, user: SelfUser }>('/api/users', {
        email, name, password, learning
      })
      loginAuthHandler(user, token)
      openRegisterHandler(false)
      navigate('/feed')
      
      
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
          <Input name="email" type="email" label="Email" value={email ?? ''} onChange={(value) => setEmail(value)} disabled={isLoading} />
          <Input name="name" label="Name" value={name ?? ''} onChange={(value) => setName(value)} disabled={isLoading} />
          <Select
            label="Studying"
            value={learning}
            disabled={isFetchingLanguages || isLoading}
            options={[
              { value: null, text: '- Select a language -', selectable: false },
              ...(languages?.map(({ name }) => {
                return ({ value: name, text: capitalize(name), append: <img src={`/flags/${name}.svg`} /> })
              }) ?? [])
            ]}
            onChange={languageCode => setLearning(languageCode)}
          />
          <Input name="password" label="Password" type="password" value={password ?? ''} onChange={(value) => setPassword(value)} disabled={isLoading} />
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