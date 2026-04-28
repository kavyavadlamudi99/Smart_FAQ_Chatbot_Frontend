import React, { useEffect, useState } from 'react'
import { checkBackendHealth } from '../services/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalFaqs: 0,
    totalChats: 0,
    activeUsers: 0,
    avgResTime: 0
  })
  const [backendStatus, setBackendStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check backend health
        const health = await checkBackendHealth()
        setBackendStatus(health)

        // Mock stats data for now
        setStats({
          totalFaqs: 42,
          totalChats: 156,
          activeUsers: 28,
          avgResTime: 1.2
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setBackendStatus({
          status: 'unhealthy',
          message: 'Failed to connect to backend'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your FAQ chatbot.
        </p>
      </div>

      {backendStatus && (
        <div
          className={`rounded-md p-4 ${
            backendStatus.status === 'healthy'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className={`h-5 w-5 ${
                  backendStatus.status === 'healthy'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3
                className={`text-sm font-medium ${
                  backendStatus.status === 'healthy'
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                Backend Status: {backendStatus.status === 'healthy' ? '✓ Healthy' : '✗ Unhealthy'}
              </h3>
              <div
                className={`mt-2 text-sm ${
                  backendStatus.status === 'healthy'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                <p>{backendStatus.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total FAQs" value={stats.totalFaqs} />
        <StatCard label="Total Chats" value={stats.totalChats} />
        <StatCard label="Active Users" value={stats.activeUsers} />
        <StatCard label="Avg Response Time" value={`${stats.avgResTime}s`} />
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-12">
            <p className="text-gray-500">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          {label}
        </dt>
        <dd className="mt-1 text-3xl font-extrabold text-gray-900">
          {value}
        </dd>
      </div>
    </div>
  )
}
