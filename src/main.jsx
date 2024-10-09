import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Demo from './DemoOpenModal.jsx'
import ModalSwitcher from './containers/ModalSwitcher.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Demo />
    <ModalSwitcher />
  </StrictMode>
)
