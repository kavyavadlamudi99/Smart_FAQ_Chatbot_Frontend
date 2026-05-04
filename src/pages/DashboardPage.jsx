import React, { useEffect, useState } from 'react'
import apiClient from '../services/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalFaqs: 0,
    totalDocuments: 0,
    totalChatLogs: 0,
    needsReviewCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/dashboard/stats')
        setStats({
          totalFaqs: response.data?.totalFaqs || 0,
          totalDocuments: response.data?.totalDocuments || 0,
          totalChatLogs: response.data?.totalChatLogs || 0,
          needsReviewCount: response.data?.needsReviewCount || 0
        })
        setError(null)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        setError('Failed to load dashboard statistics')
        // Set default values on error
        setStats({
          totalFaqs: 0,
          totalDocuments: 0,
          totalChatLogs: 0,
          needsReviewCount: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your FAQ chatbot.
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total FAQs" 
          value={stats.totalFaqs}
          icon="📋"
          color="blue"
        />
        <StatCard 
          label="Total Documents" 
          value={stats.totalDocuments}
          icon="📄"
          color="green"
        />
        <StatCard 
          label="Total Chat Messages" 
          value={stats.totalChatLogs}
          icon="💬"
          color="purple"
        />
        <StatCard 
          label="Questions Needing Review" 
          value={stats.needsReviewCount}
          icon="🔍"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Stats
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">Active FAQs:</span>
                <span className="font-semibold text-gray-900">{stats.totalFaqs}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">Documents:</span>
                <span className="font-semibold text-gray-900">{stats.totalDocuments}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">Total Chats:</span>
                <span className="font-semibold text-gray-900">{stats.totalChatLogs}</span>
              </li>
              <li className="flex justify-between text-sm border-t pt-3">
                <span className="text-gray-600">Pending Review:</span>
                <span className={`font-semibold ${stats.needsReviewCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.needsReviewCount}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border border-blue-200',
    green: 'bg-green-50 text-green-600 border border-green-200',
    purple: 'bg-purple-50 text-purple-600 border border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-600 border border-yellow-200'
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {label}
            </dt>
            <dd className="mt-2 text-3xl font-extrabold text-gray-900">
              {value}
            </dd>
          </div>
          <div className={`p-3 rounded-lg text-2xl ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
