import React, { useEffect, useState } from 'react'

export default function FaqManagementPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  })

  useEffect(() => {
    // TODO: Fetch FAQs from API
    const fetchFaqs = async () => {
      try {
        // Mock data for now
        setFaqs([
          {
            id: 1,
            question: 'What is this chatbot?',
            answer: 'This is an intelligent FAQ chatbot powered by AI.'
          },
          {
            id: 2,
            question: 'How do I use it?',
            answer: 'Simply ask your questions and the chatbot will provide relevant answers.'
          }
        ])
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  const handleAddFaq = (e) => {
    e.preventDefault()
    // TODO: Add FAQ to API
    const newFaq = {
      id: faqs.length + 1,
      ...formData
    }
    setFaqs([...faqs, newFaq])
    setFormData({ question: '', answer: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    // TODO: Delete FAQ from API
    setFaqs(faqs.filter(faq => faq.id !== id))
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage your frequently asked questions.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add FAQ'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddFaq} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter FAQ question"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter FAQ answer"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Save FAQ
          </button>
        </form>
      )}

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No FAQs yet. Create your first one!</p>
          </div>
        ) : (
          faqs.map(faq => (
            <div key={faq.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                </div>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
