import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DocProvider } from './context/DocContext'
import { ThemeProvider } from './context/themeContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    <ThemeProvider>
    <DocProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/signup"  element={<SignupPage />} />
          <Route path="/app"     element={<HomePage />} />
          <Route path="/chat"    element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </DocProvider>
  </ThemeProvider>
  )
}