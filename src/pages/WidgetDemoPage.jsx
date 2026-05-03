import React, { useRef, useEffect, useState } from 'react'
import apiClient from '../services/api'

export default function WidgetDemoPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const question = input.trim()
    const userMessage = { id: Date.now(), type: 'user', text: question }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await apiClient.post('/chat', { message: question })
      const answer = response.data?.answer ?? response.data?.message ?? JSON.stringify(response.data)
      const botMessage = { id: Date.now() + 1, type: 'bot', text: answer }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errText = error.response?.data?.message || 'Something went wrong. Please try again.'
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: errText }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Widget Demo</h1>
        <p className="mt-2 text-sm text-gray-600">
          Try out the FAQ chatbot widget in action.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
        {/* Chat Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">FAQ Assistant</h2>
          <p className="text-sm text-blue-100">Online</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="border-t p-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Integration Code
        </h3>
        <pre className="bg-blue-900 text-blue-50 p-4 rounded text-xs overflow-x-auto">
{`<script src="https://your-domain.com/widget.js"></script>
<script>
  FaqChatbot.init({
    containerId: 'chatbot-widget',
    apiKey: 'your-api-key'
  })
</script>`}
        </pre>
      </div>
    </div>
  )
}
