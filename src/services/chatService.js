import apiClient from './api'

export const chatService = {
  getChatLogs: async (params) => {
    const response = await apiClient.get('/chats', { params })
    return response.data
  },

  getChatById: async (id) => {
    const response = await apiClient.get(`/chats/${id}`)
    return response.data
  },

  sendMessage: async (message) => {
    const response = await apiClient.post('/chats/message', { message })
    return response.data
  },

  deleteChatLog: async (id) => {
    const response = await apiClient.delete(`/chats/${id}`)
    return response.data
  }
}
