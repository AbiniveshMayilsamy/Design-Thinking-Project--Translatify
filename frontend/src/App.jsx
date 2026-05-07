import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import socket from './socket'
import Header from './components/Header'
import TabBar from './components/TabBar'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import LoginPage from './components/LoginPage'
import AdminPage from './components/AdminPage'
import VoiceRecorder from './components/VoiceRecorder'
import AudioUpload from './components/AudioUpload'
import VideoUpload from './components/VideoUpload'
import Footer from './components/Footer'
import StarfieldBackground from './components/StarfieldBackground'
import PageBackground from './components/PageBackground'
import CursorEffect from './components/CursorEffect'
import { ToastProvider } from './ToastContext'
import { AuthProvider, useAuth } from './AuthContext'
import videoBg from './assets/translation.mp4'

const TRANSLATOR_TABS = ['voice', 'audio', 'video']

function AppInner() {
  const { isLoggedIn, user } = useAuth()
  const [page, setPage]       = useState(() => {
    try {
      const token = localStorage.getItem('translatify_token')
      const u = JSON.parse(localStorage.getItem('translatify_user'))
      if (token && u?.role === 'user') return 'translate'
    } catch {}
    return 'home'
  })
  const [tab, setTab]         = useState('voice')
  const [connected, setConnected] = useState(false)
  const [status, setStatus]   = useState('Connecting...')
  const [langs, setLangs]     = useState({})
  const [use3D, setUse3D]     = useState(true)

  useEffect(() => {
    socket.on('connect',    () => { setConnected(true);  setStatus('Connected') })
    socket.on('disconnect', () => { setConnected(false); setStatus('Disconnected') })
    socket.on('status', d => setStatus(d.message))
    return () => { socket.off('connect'); socket.off('disconnect'); socket.off('status') }
  }, [])

  useEffect(() => {
    fetch('/api/languages').then(r => r.json()).then(setLangs).catch(() => {})
  }, [])

  const handleNav = (id) => {
    if (id === 'login') { setPage('login'); return }
    if (id === 'admin') {
      if (user?.role === 'admin') setPage('admin')
      else setPage('login')
      return
    }
    if (TRANSLATOR_TABS.includes(id)) {
      if (!isLoggedIn) { setPage('login'); return }
      if (user?.role === 'admin') { setPage('admin'); return }
      setTab(id); setPage('translate')
    } else {
      setPage(id)
    }
  }

  const headerPage = page === 'translate' ? tab : page
  const panels = { voice: VoiceRecorder, audio: AudioUpload, video: VideoUpload }
  const Panel = panels[tab]

  return (
    <ToastProvider>
      <CursorEffect />

      {/* Background — Globe for home, particles for other pages */}
      {use3D ? (
        page === 'home' ? <StarfieldBackground /> : <PageBackground />
      ) : (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <video autoPlay loop muted playsInline src={videoBg}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)' }} />
        </div>
      )}

      {/* Toggle */}
      <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '0.68rem', color: '#444', fontWeight: 600 }}>Video</span>
        <div onClick={() => setUse3D(v => !v)} style={{
          width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
          background: use3D ? '#b5f23d' : 'rgba(255,255,255,0.08)',
          position: 'relative', transition: 'background 0.3s',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <div style={{
            position: 'absolute', top: 3, left: use3D ? 20 : 3,
            width: 14, height: 14, borderRadius: '50%',
            background: use3D ? '#000' : '#444',
            transition: 'left 0.3s',
          }} />
        </div>
        <span style={{ fontSize: '0.68rem', color: '#444', fontWeight: 600 }}>3D</span>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header connected={connected} status={status} page={headerPage} onNav={handleNav} />

        <AnimatePresence mode="wait">

          {page === 'home' && (
            <motion.div key="home"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <HomePage onStart={handleNav} />
            </motion.div>
          )}

          {page === 'about' && (
            <motion.div key="about"
              initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <AboutPage />
            </motion.div>
          )}

          {page === 'login' && (
            <motion.div key="login"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <LoginPage onSuccess={(role) => setPage(role === 'admin' ? 'home' : 'translate')} />
            </motion.div>
          )}

          {page === 'admin' && isLoggedIn && user?.role === 'admin' && (
            <motion.div key="admin"
              initial={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <AdminPage />
            </motion.div>
          )}

          {page === 'translate' && isLoggedIn && (
            <motion.div key="translate"
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: '0.68rem', color: '#b5f23d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>
                    Translation Studio
                  </div>
                  <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                    AI Translation
                  </h1>
                </motion.div>
                <TabBar active={tab} onChange={t => setTab(t)} />
                <AnimatePresence mode="wait">
                  <motion.div key={tab}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}>
                    <Panel langs={langs} />
                  </motion.div>
                </AnimatePresence>
              </main>
            </motion.div>
          )}

          {page === 'translate' && !isLoggedIn && (
            <motion.div key="login-redirect"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <LoginPage onSuccess={(role) => setPage(role === 'admin' ? 'admin' : 'translate')} />
            </motion.div>
          )}

        </AnimatePresence>

        <Footer onNav={handleNav} />
      </div>
    </ToastProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
