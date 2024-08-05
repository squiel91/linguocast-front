import ReactDOM from 'react-dom/client'
import './tailwind.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import axios from 'axios'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import store from '@/store/store.ts'

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
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {import.meta.env.DEV && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        )}
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
