import { Button } from "@/ui/button.ui"
import { Input } from "@/ui/input.ui"

import { isValidEmail } from "@/utils/validations.utils"
import axios, { isAxiosError } from "axios"
import { useState } from "react"
import { useAuth } from "@/auth/auth.context"
import Dialog from "@/ui/dialog.ui"
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, MailIcon } from "lucide-react"
import { Select } from "@/ui/select.ui"
import { Language, Level, SelfUser } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { capitalize } from "@/utils/text.utils"
import { useNavigate } from "react-router-dom"
import { LEVELS } from "@/constants/levels.constants"
import logo from '@/assets/logo.svg'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const RegisterModal = ({ isOpen, onClose: closeHandlerExternal }: Props) => {
  const navigate = useNavigate()
  const { openRegisterHandler, openLoginHandler, loginHandler: loginAuthHandler } = useAuth()

  const { data: languages, isFetching: isFetchingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data)
  })

  const [stage, setStage] = useState(0)
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [loginUserName, setLoginUserName] = useState<string | null>(null)
  const [learning, setLearning] = useState<string | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [revelePassword, setRevelePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  
  const registerHandler = async () => {
    try {
      setIsLoading(true)
      const { data: { token, user } } = await axios.post<{ token: string, user: SelfUser }>('/api/users', {
        email, name, password, learning
      })
      loginAuthHandler(user, token)
      openRegisterHandler(false)
      if (location.pathname === '/explore') navigate('/feed')
    } catch (error) {
      console.error(error)
      alert('There was an unexpected error! Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const prevStepHandler = () => {
    if (stage === 1) setLoginUserName(null)
    setStage(stage - 1)
  }

  const loginHandler = async () => {
    setIsLoading(true)
    try {
      const { data: { token, user } } = await axios.post<{ token: string, user: SelfUser }>(
        '/api/user/authenticate',
        { email, password }
      )
      loginAuthHandler(user, token)
      openRegisterHandler(false)
      if (location.pathname === '/explore') navigate('/feed')
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 401) {
        alert('The password is incorrect.')
      } else {
        console.error(error)
        alert('There was an unexpected error!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isLogin = !!loginUserName 

  const nextStepHandler = async () => {
    switch (stage) {
      case 0:
        if (!isValidEmail(email ?? '')) return alert('The emails is not valid.')
          setIsLoading(true)
          try {
            const userName = (await axios.get<{ name: string } |  null>('/api/users', { params: { email } })).data?.name ?? null
            setLoginUserName(userName)
          } catch (error) {
            console.error(error)
            return alert('There was an error while checking your email. Please try again.')
          } finally {
            setIsLoading(false)
          }
        setStage(1)
        break
      case 1:
        if (!isLogin && !name) return alert('The name is required.')
        if ((password?.length ?? 0) < 6) return alert('The password must be at lest 6 characters long.')
        if (isLogin) return loginHandler()
        setStage(2)
        break
      case 2:
        if (!learning) return alert('You need to choose the language you are learning.')
        if (!level) return alert('You need to choose your current level.')
        registerHandler()
    }
  }

  const closeHandler = () => {
    openLoginHandler(false)
    closeHandlerExternal()
  }


  return (
    <Dialog isOpen={isOpen} onClose={closeHandler} className="w-[800px] lg:h-[400px] flex flex-col gap-8 p-8 lg:p-12">
      <div className="grow grid grid-cols-1 lg:grid-cols-2 gap-8 content-stretch">
        <div>
          <h2 className="text-3xl mb-2">
            {loginUserName ? `Welcome back ${loginUserName}!` : stage > 0 ? 'Sign up' : 'Sign in/up'}
          </h2>
          <p>Save your progress, take quizzes, make comments, save and review word, etc.</p>
        </div>
        <div className="flex items-center h-full w-full">
          {stage === 0 && (
            <>
              <Input
                className="w-full"
                name="email"
                type="email"
                placeholder="jhon@smith.com"
                prepend={<MailIcon size={16} />}
                label="Email"
                value={email ?? ''}
                onChange={(value) => setEmail(value)}
                onEnter={nextStepHandler}
                disabled={isLoading}
              />
            </>
          )}
          {stage === 1 && (
            <div className="flex flex-col gap-4 w-full">
              {!isLogin && (
                <Input
                  name="name"
                  className="w-full"
                  label="Public name"
                  placeholder="Jhon Smith"
                  value={name ?? ''}
                  onChange={(value) => setName(value)}
                  disabled={isLoading}
                />
              )}
              <div>
                <Input
                  name="password"
                  label={isLogin ? 'Password' : 'New password'}
                  className="w-full"
                  type={revelePassword ? 'text' : 'password'}
                  value={password ?? ''}
                  onEnter={nextStepHandler}
                  onChange={(value) => setPassword(value)}
                  disabled={isLoading}
                  append={revelePassword
                    ? <EyeOffIcon strokeWidth={3} className="text-slate-300" onClick={() => setRevelePassword(r => !r)} />
                    : <EyeIcon strokeWidth={3} className="text-slate-300" onClick={() => setRevelePassword(r => !r)} />
                  }
                />
                {!isLogin
                  ? <p className="mt-1 text-sm text-slate-400">6 characters minumum.</p>
                  : <div className="mt-2 block text-sm">Can't remember? <a className="text-primary" href="malto:hey@linguocast.com">Recover it.</a></div>}
              </div>

            </div>
          )}
          {stage === 2 && (
            <div className="flex flex-col gap-4 w-full">
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
                onChange={setLearning}
              />
              <Select
                label="Level"
                value={level}
                disabled={isLoading}
                options={[
                  { value: null, text: '- Select a level -', selectable: false },
                  ...(LEVELS?.map(level => {
                    return ({ value: level, text: capitalize(level) })
                  }) ?? [])
                ]}
                onChange={level => setLevel(level as Level)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end lg:justify-between gap-2 items-center">
        <img src={logo} className="hidden lg:block w-8 mb-2 scale-125" />
        <div className="flex gap-2">
          {stage > 0 && (
            <Button
              variant="discrete"
              onClick={prevStepHandler}
              disabled={isLoading}
              prepend={<ArrowLeftIcon size={18} />}
            >
              Go back            
            </Button>
          )}
          <Button
            onClick={nextStepHandler}
            isLoading={isLoading}
            append={<ArrowRightIcon size={18} />}
          >
            {stage === 2 ? 'Finish' : stage === 1 && isLogin ? 'Sign in' : 'Next'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}