import React, { useEffect, useState, useCallback } from 'react'
import apiClient from '../services/api'

export default function ChatLogsPage() {
  const [chatLogs, setChatLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  const fetchChatLogs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/chat-logs')
      setChatLogs(response.data || [])
    } catch (error) {
      console.error('Error fetching chat logs:', error)
      setChatLogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchKeyword.trim()) {
      fetchChatLogs()
      return
    }

    setSearchLoading(true)
    try {
      const response = await apiClient.get('/chat-logs/search', {
        params: { keyword: searchKeyword }
      })
      setChatLogs(response.data || [])
    } catch (error) {
      console.error('Error searching chat logs:', error)
      setChatLogs([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter)
    setLoading(true)
    try {
      let response
      if (newFilter === 'needs-review') {
        response = await apiClient.get('/chat-logs/unanswered')
      } else if (newFilter === 'all') {
        response = await apiClient.get('/chat-logs')
      } else {
        response = await apiClient.get('/chat-logs', {
          params: { sourceType: newFilter }
        })
      }
      setChatLogs(response.data || [])
    } catch (error) {
      console.error('Error fetching filtered chat logs:', error)
      setChatLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChatLogs()
  }, [])

  if (loading && !searchLoading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chat Logs</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage all chat interactions.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4 bg-white shadow rounded-lg p-6">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by keyword..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
          {searchKeyword && (
            <button
              type="button"
              onClick={() => {
                setSearchKeyword('')
                fetchChatLogs()
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition"
            >
              Clear
            </button>
          )}
        </form>

        {/* Filter Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="needs-review">Needs Review</option>
            <option value="faq-context">FAQ Context</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Chat Logs Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {chatLogs.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No chat logs available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bot Answer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Needs Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chatLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <p className="truncate max-w-xs">{log.userQuestion || log.message}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <p className="truncate max-w-xs">{log.botAnswer || log.response}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.sourceType === 'faq-context'
                          ? 'bg-blue-100 text-blue-800'
                          : log.sourceType === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.sourceType || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.needsReview
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {log.needsReview ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(log.createdAt || log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
