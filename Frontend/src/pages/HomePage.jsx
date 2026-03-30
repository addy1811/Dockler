import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadDocument } from '../api'
import { useDoc } from '../context/DocContext'
import UploadBox from '../Components/UploadBox'
 
export default function HomePage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState(null)
  const [progress, setProgress]   = useState(0)
  const navigate                  = useNavigate()
  const { setDocument }           = useDoc()
 
  const handleUpload = async (file, validationError) => {
    if (validationError) { setError(validationError); return }
    if (!file) return
 
    setUploading(true)
    setError(null)
 
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 8, 85))
    }, 200)
 
    try {
      const data = await uploadDocument(file)
      clearInterval(interval)
      setProgress(100)
      setDocument(data.doc_id, data.filename, data.chunk_count)
      setTimeout(() => navigate('/chat'), 400)
    } catch (err) {
      clearInterval(interval)
      setProgress(0)
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }
 
  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">

      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(124,106,247,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
 
      <div className="text-center mb-12 animate-fade-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20
          }}>◈</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            DocuMind
          </span>
        </div>
        <h1 style={{
          fontFamily: 'Syne', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1,
          color: 'var(--text)', marginBottom: 16
        }}>
          Chat with your<br />
          <span style={{ color: 'var(--accent)' }}>documents.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 400, margin: '0 auto' }}>
          Upload a PDF and ask anything. Powered by Gemini + RAG pipeline.
        </p>
      </div>
 
      <div className="animate-fade-up delay-200" style={{ width: '100%', maxWidth: 520 }}>
        <UploadBox
          onUpload={handleUpload}
          uploading={uploading}
          progress={progress}
          error={error}
        />
      </div>
    </div>
  )
}