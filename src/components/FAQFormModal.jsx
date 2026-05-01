import React, { useState, useEffect } from 'react'

export default function FAQFormModal({ isOpen, onClose, onSubmit, faqData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (faqData) {
      setFormData({
        question: faqData.question || '',
        answer: faqData.answer || '',
        category: faqData.category || '',
        isActive: faqData.isActive !== undefined ? faqData.isActive : true
      })
    } else {
      setFormData({
        question: '',
        answer: '',
        category: '',
        isActive: true
      })
    }
    setErrors({})
  }, [faqData, isOpen])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required'
    }
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required'
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {faqData ? 'Edit FAQ' : 'Add FAQ'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Question Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter FAQ question"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.question ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-500">{errors.question}</p>
            )}
          </div>

          {/* Answer Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer *
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Enter FAQ answer"
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.answer ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.answer && (
              <p className="mt-1 text-sm text-red-500">{errors.answer}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
