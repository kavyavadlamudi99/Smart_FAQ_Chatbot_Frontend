import { useState } from 'react'

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([...faqs, { id: Date.now(), ...newFaq }])
      setNewFaq({ question: '', answer: '' })
      setShowModal(false)
    }
  }

  const handleDelete = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">FAQ Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          + Add New FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No FAQs yet. Click 'Add New FAQ' to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New FAQ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddFaq}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FAQManagement
