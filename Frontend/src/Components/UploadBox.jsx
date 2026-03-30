import { useState, useRef, useCallback } from 'react'
 
export default function UploadBox({ onUpload, uploading, progress, error }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile]         = useState(null)
  const inputRef                = useRef()
 
  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      onUpload(null, 'Only PDF files are supported.')
      return
    }
    setFile(f)
  }
 
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])
 
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }
 
  const handleRemove = (e) => {
    e.stopPropagation()
    setFile(null)
  }
 
  return (
    <div style={{ width: '100%' }}>
 
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !file && inputRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : file ? 'var(--border-bright)' : 'var(--border)'}`,
          borderRadius: 20,
          padding: '48px 32px',
          textAlign: 'center',
          cursor: file ? 'default' : 'pointer',
          background: dragging ? 'var(--accent-glow)' : 'var(--bg2)',
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {dragging && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(124,106,247,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
        )}
 
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
 
        {!file ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>⬆</div>
            <p style={{
              fontFamily: 'Syne', fontWeight: 600, fontSize: 18,
              color: 'var(--text)', marginBottom: 8
            }}>
              Drop your PDF here
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              or{' '}
              <span style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                browse files
              </span>
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 12 }}>
              Max 16MB · PDF only
            </p>
          </>
        ) : (
          <div className="animate-fade-in">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'var(--bg3)', borderRadius: 12,
              padding: '14px 18px', border: '1px solid var(--border)',
              marginBottom: progress > 0 ? 20 : 0, textAlign: 'left'
            }}>
              <div style={{
                width: 40, height: 48, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18
              }}>📄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontWeight: 500, color: 'var(--text)', fontSize: 14,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {file.name}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
                  {formatSize(file.size)}
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={handleRemove}
                  style={{
                    color: 'var(--text-dim)', background: 'none',
                    border: 'none', cursor: 'pointer', fontSize: 18
                  }}
                >✕</button>
              )}
            </div>
 
            {uploading && (
              <div style={{ marginTop: 16 }}>
                <div style={{
                  height: 4, background: 'var(--border)',
                  borderRadius: 2, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                    width: `${progress}%`, transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>
                  Processing document... {progress}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
 
      {error && (
        <div style={{
          marginTop: 12, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171', fontSize: 14
        }}>
          ⚠ {error}
        </div>
      )}
 
      <button
        className="btn-accent"
        onClick={() => file && onUpload(file)}
        disabled={!file || uploading}
        style={{
          width: '100%', marginTop: 16, padding: '14px',
          borderRadius: 12, fontSize: 16
        }}
      >
        {uploading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span className="animate-spin-slow" style={{
              display: 'inline-block', width: 18, height: 18,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff', borderRadius: '50%'
            }} />
            Uploading...
          </span>
        ) : 'Upload & Start Chatting →'}
      </button>
 
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 24,
        marginTop: 24, color: 'var(--text-dim)', fontSize: 12
      }}>
        {['RAG Pipeline', 'Gemini AI', 'ChromaDB'].map(f => (
          <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--accent)', fontSize: 10 }}>●</span> {f}
          </span>
        ))}
      </div>
    </div>
  )
}