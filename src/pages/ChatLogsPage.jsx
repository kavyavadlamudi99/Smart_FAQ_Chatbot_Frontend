import React, { useEffect, useState } from 'react'

export default function ChatLogsPage() {
  const [chatLogs, setChatLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // TODO: Fetch chat logs from API
    const fetchChatLogs = async () => {
      try {
        // Mock data for now
        setChatLogs([
          {
            id: 1,
            user: 'user@example.com',
            message: 'What is your refund policy?',
            response: 'We offer 30-day money-back guarantee...',
            timestamp: new Date().toISOString(),
            status: 'resolved'
          },
          {
            id: 2,
            user: 'another@example.com',
            message: 'How do I reset my password?',
            response: 'You can reset your password from the login page...',
            timestamp: new Date().toISOString(),
            status: 'resolved'
          }
        ])
      } catch (error) {
        console.error('Error fetching chat logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatLogs()
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chat Logs</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage all chat interactions.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'resolved'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Resolved
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Pending
        </button>
      </div>

      <div className="space-y-4">
        {chatLogs.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No chat logs available.</p>
          </div>
        ) : (
          chatLogs.map(log => (
            <div key={log.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-gray-900">{log.user}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>User:</strong> {log.message}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Bot:</strong> {log.response}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
