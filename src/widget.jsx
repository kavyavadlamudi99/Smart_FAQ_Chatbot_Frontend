import React from 'react'
import { createRoot } from 'react-dom/client'
import ChatWidget from './components/ChatWidget'
import './index.css'

function mountWidget() {
  const containerId = 'smart-faq-chatbot-root'

  if (document.getElementById(containerId)) return

  const container = document.createElement('div')
  container.id = containerId
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(<ChatWidget />)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWidget)
} else {
  mountWidget()
}
