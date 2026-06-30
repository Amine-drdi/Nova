import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { TRPCProvider } from "./providers/trpc"

createRoot(document.getElementById('root')!).render(
  <TRPCProvider>
    <App />
  </TRPCProvider>
)
