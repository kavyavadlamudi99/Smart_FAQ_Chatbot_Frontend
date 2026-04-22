import apiClient from './api'

export const faqService = {
  getAllFAQs: async () => {
    const response = await apiClient.get('/faqs')
    return response.data
  },

  getFAQById: async (id) => {
    const response = await apiClient.get(`/faqs/${id}`)
    return response.data
  },

  createFAQ: async (faqData) => {
    const response = await apiClient.post('/faqs', faqData)
    return response.data
  },

  updateFAQ: async (id, faqData) => {
    const response = await apiClient.put(`/faqs/${id}`, faqData)
    return response.data
  },

  deleteFAQ: async (id) => {
    const response = await apiClient.delete(`/faqs/${id}`)
    return response.data
  }
}
