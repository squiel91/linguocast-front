import React from 'react'
import ReactDOM from 'react-dom/client'
import './tailwind.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { AuthContextWrapper } from './auth/auth.context.tsx'
import axios from 'axios'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

axios.interceptors.request.use(config => {
  const authToken = localStorage.getItem('token')
  if (authToken) config.headers.Authorization =  `Bearer ${authToken}`
  return config
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextWrapper>
        <RouterProvider router={router} />
      </AuthContextWrapper>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  </React.StrictMode>
)
