import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/faqs', label: 'FAQ Management', icon: '❓' },
    { path: '/chat-logs', label: 'Chat Logs', icon: '💬' },
    { path: '/widget-demo', label: 'Widget Demo', icon: '🎨' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out shadow-lg overflow-y-auto`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg font-bold text-lg">
              ⚡
            </div>
            {isSidebarOpen && <h1 className="text-lg font-bold text-white">FAQ Bot</h1>}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors hidden sm:block"
            title={isSidebarOpen ? 'Collapse' : 'Expand'}
          >
            {isSidebarOpen ? '‹' : '›'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-red-600/20 transition-all duration-200 ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            {isSidebarOpen && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Welcome back!</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                🔔
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
