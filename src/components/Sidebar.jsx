import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/faq-management', name: 'FAQ Management', icon: '❓' },
    { path: '/chat-logs', name: 'Chat Logs', icon: '💬' },
    { path: '/widget-preview', name: 'Widget Preview', icon: '🔍' },
  ]

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h1 className="text-xl font-bold">FAQ Chatbot</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
