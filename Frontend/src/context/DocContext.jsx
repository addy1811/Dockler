import { createContext, useContext, useState } from 'react'
const DocContext = createContext(null)
 
export function DocProvider({ children }) {
  const [docId, setDocId]       = useState(null)
  const [docName, setDocName]   = useState(null)
  const [chunkCount, setChunkCount] = useState(null)
 
  const setDocument = (id, name, chunks) => {
    setDocId(id)
    setDocName(name)
    setChunkCount(chunks)
  }
 
  const clearDocument = () => {
    setDocId(null)
    setDocName(null)
    setChunkCount(null)
  }
 
  return (
    <DocContext.Provider value={{ docId, docName, chunkCount, setDocument, clearDocument }}>
      {children}
    </DocContext.Provider>
  )
}
 
export const useDoc = () => useContext(DocContext)