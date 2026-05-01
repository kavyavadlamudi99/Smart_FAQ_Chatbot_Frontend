import React, { useEffect, useState, useRef } from 'react'
import apiClient from '../services/api'
import { faqService } from '../services/faqService'
import FAQFormModal from '../components/FAQFormModal'

export default function FaqManagementPage() {
  const fileInputRef = useRef(null)
  
  // Upload section state
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState(null)
  const [uploadMessageType, setUploadMessageType] = useState(null) // 'success' or 'error'

  // Documents list state
  const [documents, setDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(true)
  const [viewingDocument, setViewingDocument] = useState(null)
  const [documentContent, setDocumentContent] = useState(null)
  const [loadingContent, setLoadingContent] = useState(false)

  // FAQ list state
  const [faqs, setFaqs] = useState([])
  const [loadingFaqs, setLoadingFaqs] = useState(true)
  const [faqMessage, setFaqMessage] = useState(null)
  const [faqMessageType, setFaqMessageType] = useState(null) // 'success' or 'error'
  
  // FAQ modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    fetchUploadedDocuments()
    fetchFaqs()
  }, [])

  const fetchUploadedDocuments = async () => {
    try {
      setLoadingDocuments(true)
      const response = await apiClient.get('/faq-documents')
      setDocuments(response.data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      setUploadMessage('Failed to load documents')
      setUploadMessageType('error')
    } finally {
      setLoadingDocuments(false)
    }
  }

  // FAQ Functions
  const fetchFaqs = async () => {
    try {
      setLoadingFaqs(true)
      const data = await faqService.getAllFAQs()
      setFaqs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setFaqMessage('Failed to load FAQs')
      setFaqMessageType('error')
    } finally {
      setLoadingFaqs(false)
    }
  }

  const handleAddFaq = () => {
    setEditingFaq(null)
    setIsModalOpen(true)
  }

  const handleEditFaq = (faq) => {
    setEditingFaq(faq)
    setIsModalOpen(true)
  }

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return
    }
    try {
      await faqService.deleteFAQ(id)
      setFaqMessage('FAQ deleted successfully!')
      setFaqMessageType('success')
      await fetchFaqs()
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete FAQ'
      setFaqMessage(errorMsg)
      setFaqMessageType('error')
      console.error('Delete error:', error)
    }
  }

  const handleSubmitFaq = async (formData) => {
    try {
      setIsSubmittingFaq(true)
      setFaqMessage(null)

      if (editingFaq) {
        // Edit existing FAQ
        await faqService.updateFAQ(editingFaq.id, formData)
        setFaqMessage('FAQ updated successfully!')
      } else {
        // Add new FAQ
        await faqService.createFAQ(formData)
        setFaqMessage('FAQ created successfully!')
      }
      setFaqMessageType('success')
      setIsModalOpen(false)
      setEditingFaq(null)
      await fetchFaqs()
    } catch (error) {
      const errorMsg = error.response?.data?.message || (editingFaq ? 'Failed to update FAQ' : 'Failed to create FAQ')
      setFaqMessage(errorMsg)
      setFaqMessageType('error')
      console.error('Submit error:', error)
    } finally {
      setIsSubmittingFaq(false)
    }
  }

  const handleCloseFaqModal = () => {
    setIsModalOpen(false)
    setEditingFaq(null)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadMessage(null)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      setUploadMessage('Please select a file to upload')
      setUploadMessageType('error')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setUploading(true)
      setUploadMessage(null)

      const response = await apiClient.post('/faq-documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setUploadMessage('Document uploaded successfully!')
      setUploadMessageType('success')
      setSelectedFile(null)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Refresh documents list
      await fetchUploadedDocuments()
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to upload document'
      setUploadMessage(errorMsg)
      setUploadMessageType('error')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRefresh = () => {
    fetchUploadedDocuments()
  }

  const handleDeleteDocument = async (documentId) => {
    try {
      await apiClient.delete(`/faq-documents/${documentId}`)
      setUploadMessage('Document deleted successfully!')
      setUploadMessageType('success')
      await fetchUploadedDocuments()
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete document'
      setUploadMessage(errorMsg)
      setUploadMessageType('error')
      console.error('Delete error:', error)
    }
  }

  const handleViewDocument = async (doc) => {
    try {
      setViewingDocument(doc)
      setLoadingContent(true)
      const response = await apiClient.get(`/faq-documents/${doc.id}/content`)
      setDocumentContent(response.data?.content || response.data)
    } catch (error) {
      console.error('Error fetching document content:', error)
      setDocumentContent({ error: 'Failed to load document content' })
    } finally {
      setLoadingContent(false)
    }
  }

  const closeModal = () => {
    setViewingDocument(null)
    setDocumentContent(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your FAQs and upload FAQ documents.
        </p>
      </div>

      {/* Section 1: FAQ Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">FAQs</h2>
          <button
            onClick={handleAddFaq}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Add FAQ
          </button>
        </div>

        {/* FAQ Message */}
        {faqMessage && (
          <div
            className={`rounded-md p-4 mb-4 ${
              faqMessageType === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                faqMessageType === 'success'
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}
            >
              {faqMessage}
            </p>
          </div>
        )}

        {loadingFaqs ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading FAQs...</span>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="mt-4 text-gray-500">No FAQs yet.</p>
            <p className="text-sm text-gray-400 mt-1">Create your first FAQ to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Question</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Answer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-xs truncate">
                      {faq.question}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                      {faq.answer}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          faq.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleEditFaq(faq)}
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Upload FAQ Document */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload FAQ Document</h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Document
            </label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.txt"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>

          {/* Message Display */}
          {uploadMessage && (
            <div
              className={`rounded-md p-4 ${
                uploadMessageType === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  uploadMessageType === 'success'
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {uploadMessage}
              </p>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Document'
            )}
          </button>
        </form>
      </div>

      {/* Section 3: Uploaded Documents List */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Uploaded Documents</h2>
          <button
            onClick={handleRefresh}
            disabled={loadingDocuments}
            className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {loadingDocuments ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loadingDocuments ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading documents...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="mt-4 text-gray-500">No documents uploaded yet.</p>
            <p className="text-sm text-gray-400 mt-1">Upload your first FAQ document to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">File Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Uploaded Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{doc.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h6a1 1 0 01.707.293l6.414 6.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2v10h8V4H6z"></path>
                        </svg>
                        {doc.fileName || doc.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Document Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{viewingDocument.fileName || viewingDocument.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded {viewingDocument.uploadedAt ? new Date(viewingDocument.uploadedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingContent ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2 text-gray-600">Loading content...</span>
                </div>
              ) : documentContent?.error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 font-medium">{documentContent.error}</p>
                </div>
              ) : typeof documentContent === 'string' ? (
                <div className="text-sm text-gray-700 whitespace-pre-wrap break-words font-mono bg-gray-50 p-4 rounded">
                  {documentContent}
                </div>
              ) : documentContent ? (
                <div className="text-sm text-gray-700">
                  <pre className="font-mono bg-gray-50 p-4 rounded overflow-x-auto">
                    {JSON.stringify(documentContent, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No content available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Form Modal */}
      <FAQFormModal
        isOpen={isModalOpen}
        onClose={handleCloseFaqModal}
        onSubmit={handleSubmitFaq}
        faqData={editingFaq}
        isLoading={isSubmittingFaq}
      />
    </div>
  )
}
