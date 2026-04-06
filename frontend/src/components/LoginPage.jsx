import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../AuthContext'
import logo from '../assets/logo.png'

const G = '#b5f23d'

const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: '#fff',
  fontSize: '0.9rem', fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box',
}

export default function LoginPage({ onSuccess }) {
  const { login, register } = useAuth()
  const [tab, setTab]       = useState('login')
  const [form, setForm]     = useState({ name: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let data
      if (tab === 'login') {
        data = await login(form.email, form.password)
      } else {
        data = await register(form.name, form.email, form.password)
      }
      onSuccess(data.user.role)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '40px 36px',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <img src={logo} alt="Translatify" style={{ height: 40, objectFit: 'contain' }} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.05)',
          borderRadius: 8, padding: 4, marginBottom: 28,
        }}>
          {['login', 'register'].map(t => (
            <motion.button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1, padding: '9px 0',
                border: 'none', borderRadius: 6,
                background: tab === t ? G : 'transparent',
                color: tab === t ? '#000' : '#555',
                fontFamily: 'inherit', fontSize: '0.85rem',
                fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence>
            {tab === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <input
                  style={inputStyle}
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            style={inputStyle}
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            required
          />

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(255,60,60,0.12)',
                border: '1px solid rgba(255,60,60,0.25)',
                color: '#ff6b6b', fontSize: '0.83rem',
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: `0 0 30px rgba(181,242,61,0.35)` }}
            whileTap={{ scale: 0.98 }}
            style={{
              marginTop: 6,
              padding: '13px', borderRadius: 8,
              background: loading ? 'rgba(181,242,61,0.4)' : G,
              border: 'none', color: '#000',
              fontFamily: 'inherit', fontSize: '0.92rem',
              fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        {/* Demo credentials */}
        {tab === 'login' && (
          <div style={{
            marginTop: 20, padding: '14px 16px', borderRadius: 8,
            background: 'rgba(181,242,61,0.06)',
            border: '1px solid rgba(181,242,61,0.15)',
          }}>
            <div style={{ fontSize: '0.7rem', color: G, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Demo Accounts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Admin', email: 'admin@translatify.com', pass: 'admin123' },
                { label: 'User',  email: 'user@translatify.com',  pass: 'user123'  },
              ].map(a => (
                <div key={a.label}
                  onClick={() => setForm(f => ({ ...f, email: a.email, password: a.pass }))}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#555' }}>
                    <span style={{ color: a.label === 'Admin' ? G : '#888', fontWeight: 700, marginRight: 8 }}>{a.label}</span>
                    {a.email}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#333' }}>{a.pass}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#333', marginTop: 8 }}>Click a row to auto-fill</div>
          </div>
        )}

        <p style={{ textAlign: 'center', color: '#333', fontSize: '0.78rem', marginTop: 16 }}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}
            style={{ color: G, cursor: 'pointer', fontWeight: 600 }}
          >
            {tab === 'login' ? 'Register' : 'Sign In'}
          </span>
        </p>
      </motion.div>
    </div>
  )
}
