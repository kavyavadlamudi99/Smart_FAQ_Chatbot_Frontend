const ChatLogs = () => {
  // Mock data for demonstration
  const mockLogs = [
    {
      id: 1,
      user: 'User 1',
      message: 'What are your business hours?',
      response: 'We are open Monday-Friday, 9am-5pm',
      timestamp: '2024-01-15 10:30 AM'
    },
    {
      id: 2,
      user: 'User 2',
      message: 'How can I reset my password?',
      response: 'You can reset your password by clicking on "Forgot Password" on the login page',
      timestamp: '2024-01-15 11:15 AM'
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Chat Logs</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No chat logs available
                </td>
              </tr>
            ) : (
              mockLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.response}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ChatLogs
