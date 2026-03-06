import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './providers/UserProvider.tsx'
import { ConfirmProvider } from './providers/ConfirmProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <ConfirmProvider>
    <StrictMode>
      <App />
    </StrictMode>
    </ConfirmProvider>
  </UserProvider>,
)
