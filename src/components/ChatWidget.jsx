import React, { useState, useRef, useEffect } from 'react'
import apiClient from '../services/api'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const question = input.trim()
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: question,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Add loading message
    const loadingMessage = {
      id: Date.now() + 0.5,
      sender: 'bot',
      text: 'Typing...',
      isLoading: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, loadingMessage])
    setLoading(true)

    try {
      const response = await apiClient.post('/chat', { message: question })
      const answer = response.data?.answer ?? response.data?.message ?? JSON.stringify(response.data)
      
      // Replace loading message with bot response
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingMessage.id
            ? {
                id: msg.id,
                sender: 'bot',
                text: answer,
                isLoading: false,
                timestamp: new Date()
              }
            : msg
        )
      )
    } catch (error) {
      const errText = error.response?.data?.message || 'Something went wrong. Please try again.'
      
      // Replace loading message with error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingMessage.id
            ? {
                id: msg.id,
                sender: 'bot',
                text: errText,
                isLoading: false,
                timestamp: new Date()
              }
            : msg
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">FAQ Assistant</h2>
              <p className="text-xs text-blue-100">Always here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-100 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-full ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  } ${message.isLoading ? 'flex items-center gap-2' : ''}`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200 p-4 bg-white"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask something..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white font-semibold ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
            <path d="M15 7l-4 4m0 0l-4-4m4 4v6" opacity="0" />
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10 2a1 1 0 11-2 0 1 1 0 012 0z" opacity="0" />
            <path d="M3.055 11H5V9H3l.055 2zm14.001 0h1.944L19 9h-2v2zm-16-4h2v2H1V7zm16 0h2v2h-2V7z" opacity="0" />
            <path
              fillRule="evenodd"
              d="M5 9a2 2 0 110-4 2 2 0 010 4zm0 0a6 6 0 100 12 6 6 0 000-12z"
              opacity="0"
            />
            {/* Chat icon */}
            <path d="M3 8a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm3.5 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        )}
      </button>
    </div>
  )
}
