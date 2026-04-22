import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FAQManagement from './pages/FAQManagement'
import ChatLogs from './pages/ChatLogs'
import WidgetPreview from './pages/WidgetPreview'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="faq-management" element={<FAQManagement />} />
          <Route path="chat-logs" element={<ChatLogs />} />
          <Route path="widget-preview" element={<WidgetPreview />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
