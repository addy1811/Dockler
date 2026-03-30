import { useState , useRef , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useDoc } from "../context/DocContext"
import { askQuestion , clearChatHistory} from '../api'
import MessageBubble from '../Components/MessageBubble'
import InputBar from '../Components/InputBar'

export default function ChatPage() {
    const {docId , docName , chunkCount , clearDocument} = useDoc()
    const [messages , setMessages] = useState([])
    const [loading , setLoading] = useState(false)
    const[error , setError] = useState(null)
    const chatRef = useRef()
    const navigate = useNavigate()

    useEffect( () => {
        if(!docId) navigate("/app")
    } , [docId , navigate])

    useEffect( () => {
      if(docId) {
        setMessages([{
          id : 'welcome',
          role : 'ai',
          content : `Document loaded! I've indexed "${docName}" into ${chunkCount} chunks.\n`,
          timestamp : new Date().toISOString()
        }])
      }
    }, [docId])

    useEffect( () => {
      chatRef.current?.scrollIntoView({ behavior : 'smooth'})
    }, [messages])

    const handleSend = async(question) => {
      const usrMsg = {
        id : Date.now().toString(),
        role : 'user',
        content : question,
        timestamp : new Date().toISOString()
      }
      setMessages(prev => [...prev , usrMsg])
      setLoading(true)
      setError(null)

    try{
      const data = await askQuestion(docId , question)
      const aiMsg = {
        id : Date.now().toString() + '_ai',
        role : 'ai',
        content : data.answer,
        timestamp : new Date().toISOString(),
        chunkUsed : data.chunk_used
      }
      setMessages(prev => [...prev , aiMsg])
    } catch(err){
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      }
    }
    
    const handleClear = async () => {
      try {
        await clearChatHistory(docId)
        setMessages([{
          id: 'cleared',
          role: 'ai',
          content: 'Chat history cleared. Ask me anything about the document.',
          timestamp: new Date().toISOString()
        }])
      } catch {
        setError('Failed to clear history.')
      }
    }
   
    const handleNewDoc = () => {
      clearDocument()
      navigate('/app')
    }
   
    if (!docId) return null
   
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', maxWidth: 800, margin: '0 auto',
      borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)'
    }}>

      <div style={{
        padding: '14px 20px', background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0
      }}>

        <div style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16
        }}>◈</div>
 
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
            color: 'var(--text)', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis'
          }}>{docName}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {chunkCount} chunks indexed · Gemini AI
          </p>
        </div>
 
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={handleClear}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12,
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontFamily: 'Syne', fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--border-bright)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
          >
            Clear
          </button>
          <button
            onClick={handleNewDoc}
            className="btn-accent"
            style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12 }}
          >
            + New Doc
          </button>
        </div>
      </div>
 
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px 20px',
        display: 'flex', flexDirection: 'column'
      }}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
 
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
            }}>◈</div>
            <div style={{
              padding: '14px 18px', borderRadius: '18px 18px 18px 4px',
              background: 'var(--bg3)', border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--accent)',
                    animation: 'blink 1.2s ease infinite',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
 
        {error && (
          <div style={{
            margin: '8px 0 16px', padding: '12px 16px', borderRadius: 10,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', fontSize: 13
          }}>
            ⚠ {error}
          </div>
        )}
 
        <div ref={chatRef} />
      </div>
 
      <InputBar onSend={handleSend} disabled={loading} />
    </div>
  )
}
