import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import { useAuth } from '../AuthContext'

const NAV_LINKS = [
  { label: 'Home',  id: 'home' },
  { label: 'Voice', id: 'voice', userOnly: true },
  { label: 'Audio', id: 'audio', userOnly: true },
  { label: 'Video', id: 'video', userOnly: true },
  { label: 'About', id: 'about' },
]

const SOCIALS = [
  { label: 'GitHub',   href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter',  href: '#' },
]

export default function Footer({ onNav }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        position: 'relative', zIndex: 10,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(181,242,61,0.12)',
        padding: '52px 48px 28px',
        marginTop: 'auto',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'space-between', marginBottom: 40 }}>

        {/* Brand */}
        <div style={{ maxWidth: 280 }}>
          <div style={{ marginBottom: 14 }}>
            <img src={logo} alt="Translatify" style={{ height: 36, objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
            AI-powered audio & video translation. Break language barriers with state-of-the-art Whisper + NLLB-200 models.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <div style={{ fontSize: '0.68rem', color: '#b5f23d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>
            Navigation
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NAV_LINKS.filter(n => !n.userOnly || !isAdmin).map(n => (
              <li key={n.id}>
                <motion.button
                  onClick={() => onNav(n.id)}
                  whileHover={{ color: '#b5f23d', x: 4 }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#555', fontSize: '0.88rem', fontFamily: 'inherit',
                    padding: 0, transition: 'color 0.2s',
                  }}
                >
                  {n.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <div style={{ fontSize: '0.68rem', color: '#b5f23d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>
            Powered By
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['OpenAI Whisper', 'Meta NLLB-200', 'Flask + SocketIO', 'React + Vite', 'gTTS', 'MoviePy'].map(t => (
              <li key={t} style={{ color: '#555', fontSize: '0.85rem' }}>{t}</li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <div style={{ fontSize: '0.68rem', color: '#b5f23d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>
            Connect
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SOCIALS.map(s => (
              <motion.a
                key={s.label}
                href={s.href}
                whileHover={{ color: '#b5f23d', x: 4 }}
                style={{
                  color: '#555', fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {s.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

      {/* Bottom row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ color: '#333', fontSize: '0.78rem' }}>
          © {new Date().getFullYear()} Translatify. Built for Design Thinking.
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <motion.div
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#b5f23d' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ color: '#333', fontSize: '0.78rem' }}>AI Translation Active</span>
        </div>
      </div>
    </motion.footer>
  )
}
