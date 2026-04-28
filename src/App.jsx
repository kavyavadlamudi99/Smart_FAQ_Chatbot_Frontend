import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import FaqManagementPage from './pages/FaqManagementPage'
import ChatLogsPage from './pages/ChatLogsPage'
import WidgetDemoPage from './pages/WidgetDemoPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="faqs" element={<FaqManagementPage />} />
          <Route path="chat-logs" element={<ChatLogsPage />} />
          <Route path="widget-demo" element={<WidgetDemoPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
