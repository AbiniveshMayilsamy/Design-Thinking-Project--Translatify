import { motion } from 'framer-motion'

const G = '#b5f23d'
const TABS = [
  { id: 'voice', icon: '🎙', label: 'Voice Record' },
  { id: 'audio', icon: '🎵', label: 'Audio File' },
  { id: 'video', icon: '🎬', label: 'Video File' },
]

export default function TabBar({ active, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', gap: 0, borderBottom: '1px solid #111', marginBottom: 32 }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            whileHover={{ color: isActive ? G : '#888' }}
            whileTap={{ scale: 0.97 }}
            style={{
              position: 'relative',
              padding: '14px 24px',
              border: 'none', background: 'transparent',
              color: isActive ? G : '#444',
              fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'color 0.2s',
              letterSpacing: '0.2px',
            }}
          >
            <motion.span
              animate={isActive ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
            >{tab.icon}</motion.span>
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="tab-line"
                style={{
                  position: 'absolute', bottom: -1, left: 0, right: 0,
                  height: 2, background: G,
                  boxShadow: `0 0 10px rgba(181,242,61,0.7)`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
