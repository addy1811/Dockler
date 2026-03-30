import axios from "axios";  

const api = axios.create({
    baseURL : '/api',
    timeout : 60000,
})

export const uploadDocument = async(file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/doc/upload', formData , {
        headers: { 'Content-Type' :'multipart/form-data'}
    })
    return res.data
}

export const listDocument = async() => {
    const res = await api.get('/doc/')
    return res.data

}

export const deleteDocument = async() => {
    const res = await api.delete(`/doc/${doc_id}`)
     return res.data
}

export const askQuestion = async(docId , question) => {
    const res = await api.post('/chat/ask' , {
        doc_id : docId , question })
        return res.data
 }

export const getChatHistory = async(docId) => {
    const res = await api.get(`/chat/history/${docId}`)
    return res.data
}

export const clearChatHistory = async(docId) => {
    const res = await api.delete(`/chat/history/${docId}`)
    return res.data
}

export const healthCheck = async () => {
    const res = await api.get('/health')
    return res.data
  }