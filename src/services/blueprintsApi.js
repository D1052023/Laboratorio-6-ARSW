import api from './apiClient.js'

const blueprintsApi = {

  getAll: async () => {
    const { data } = await api.get('/blueprints')
    return data.data
  },

  getByAuthor: async (author) => {
    const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`)
    return data.data
  },

  getByAuthorAndName: async (author, name) => {
    const { data } = await api.get(
      `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`
    )
    return data.data
  },

  create: async (blueprint) => {
    const { data } = await api.post('/blueprints', blueprint)
    return data
  },
}

export default blueprintsApi