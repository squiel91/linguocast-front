import { useState, createContext, ReactNode, useContext } from "react"
import axios from "axios"
import { LoginModal } from "./login-modal.auth"
import { RegisterModal } from "./register-modal.auth"
import { useQuery } from "@tanstack/react-query"
import { SelfUser } from "@/types/types"

interface Auth {
  user: SelfUser | null
  isLoggedIn: boolean
  isLoginOpen: boolean
  isRegisterOpen: boolean
  loginHandler: (user: SelfUser, token: string) => void
  logoutHandler: () => void 
  openLoginHandler: (isOpen: boolean) => void
  openRegisterHandler: (isOpen: boolean) => void
}

interface Props {
  children: ReactNode
}

export const AuthContext = createContext<Auth>({
  user: null,
  isLoggedIn: false,
  isLoginOpen: false,
  isRegisterOpen: false,
  loginHandler: () => console.info('loginHandler'),
  logoutHandler: () => console.info('Token set'),
  openLoginHandler: () => console.info('openLoginHandler'),
  openRegisterHandler: () => console.info('openRegisterHandler')
})

export const AuthContextWrapper = ({ children }: Props) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') ?? null)
  const [user, setUser] = useState<SelfUser | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const { data: retrivedUser } = useQuery({
    queryKey: ['user'],
    enabled: token ? true : false,
    queryFn: () => axios.get<SelfUser>('/api/user').then(res => res.data)
  })

  if(!user && retrivedUser) setUser(retrivedUser)

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!token,
      isLoginOpen: isLoginOpen,
      isRegisterOpen: isRegisterOpen,
      loginHandler: (user: SelfUser, token: string) => {
        setUser(user)
        setToken(token)
        localStorage.setItem('token', token)
      },
      logoutHandler: () => {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
      },
      openLoginHandler: (isOpen) => setIsLoginOpen(isOpen),
      openRegisterHandler: (isOpen) => setIsRegisterOpen(isOpen),
    }}>
      {children}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
