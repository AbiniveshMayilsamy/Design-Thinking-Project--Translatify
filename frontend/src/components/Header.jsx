import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import { useAuth } from '../AuthContext'

const G = '#b5f23d'

const NAV = [
  { id: 'home',  label: 'Home' },
  { id: 'voice', label: 'Voice', userOnly: true },
  { id: 'audio', label: 'Audio', userOnly: true },
  { id: 'video', label: 'Video', userOnly: true },
  { id: 'about', label: 'About' },
]

export default function Header({ connected, status, page, onNav }) {
  const { user, isLoggedIn, logout } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0 48px',
        display: 'flex', alignItems: 'center', gap: 40,
        height: 62,
      }}
    >
      {/* Logo */}
      <motion.div
        onClick={() => onNav('home')}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        style={{ cursor: 'pointer', flexShrink: 0 }}
      >
        <img src={logo} alt="Translatify" style={{ height: 30, objectFit: 'contain', display: 'block' }} />
      </motion.div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {NAV.filter(n => !n.userOnly || !isAdmin).map(n => {
          const isActive = page === n.id
          return (
            <motion.button
              key={n.id}
              onClick={() => onNav(n.id)}
              whileHover={{ color: G }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'relative', padding: '8px 18px',
                border: 'none', background: 'transparent',
                color: isActive ? G : '#555',
                fontFamily: 'inherit', fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', transition: 'color 0.2s',
                letterSpacing: '0.2px',
              }}
            >
              {n.label}
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute', bottom: 0, left: 18, right: 18,
                    height: 2, background: G, borderRadius: 1,
                    boxShadow: '0 0 8px rgba(181,242,61,0.8)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}

        {/* Admin link — only for admins */}
        {isAdmin && (
          <motion.button
            onClick={() => onNav('admin')}
            whileHover={{ color: G }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'relative', padding: '8px 18px',
              border: 'none', background: 'transparent',
              color: page === 'admin' ? G : '#555',
              fontFamily: 'inherit', fontSize: '0.88rem',
              fontWeight: page === 'admin' ? 700 : 500,
              cursor: 'pointer', transition: 'color 0.2s',
            }}
          >
            Admin
            {page === 'admin' && (
              <motion.div
                layoutId="nav-underline"
                style={{
                  position: 'absolute', bottom: 0, left: 18, right: 18,
                  height: 2, background: G, borderRadius: 1,
                  boxShadow: '0 0 8px rgba(181,242,61,0.8)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        )}
      </nav>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>

        {/* Connection dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.div
            style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? G : '#333' }}
            animate={connected ? { boxShadow: ['0 0 0 0 rgba(181,242,61,0.6)', '0 0 0 6px rgba(181,242,61,0)', '0 0 0 0 rgba(181,242,61,0)'] } : {}}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span style={{ fontSize: '0.78rem', color: connected ? G : '#444', fontWeight: 500 }}>{status}</span>
        </div>

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(181,242,61,0.15)',
              border: `1px solid ${G}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 800, color: G,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600, lineHeight: 1.2 }}>{user?.name}</span>
              <span style={{ fontSize: '0.65rem', color: user?.role === 'admin' ? G : '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</span>
            </div>
            <motion.button
              onClick={logout}
              whileHover={{ color: '#ff6b6b' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6, background: 'transparent',
                color: '#555', fontFamily: 'inherit',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              Logout
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => onNav('login')}
            whileHover={{ scale: 1.04, boxShadow: `0 0 20px rgba(181,242,61,0.3)` }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '7px 20px', borderRadius: 7,
              background: G, border: 'none',
              color: '#000', fontFamily: 'inherit',
              fontSize: '0.85rem', fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Login
          </motion.button>
        )}
      </div>
    </motion.header>
  )
}
