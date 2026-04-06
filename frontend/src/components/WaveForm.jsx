import { motion } from 'framer-motion'

const G = '#b5f23d'

export default function WaveForm({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 52, padding: '0 4px' }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          style={{ width: 3, borderRadius: 2, background: active ? G : '#1a1a1a' }}
          animate={active
            ? { height: [4, 8 + (i % 6) * 7, 4], opacity: [0.5, 1, 0.5] }
            : { height: 4, opacity: 0.15 }}
          transition={active
            ? { duration: 0.5 + (i % 5) * 0.08, repeat: Infinity, delay: i * 0.03, ease: 'easeInOut' }
            : { duration: 0.3 }}
        />
      ))}
    </div>
  )
}
