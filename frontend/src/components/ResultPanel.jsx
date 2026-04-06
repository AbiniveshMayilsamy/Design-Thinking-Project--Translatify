import { motion, AnimatePresence } from 'framer-motion'

const G = '#b5f23d'

function Box({ label, text }) {
  return (
    <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 10, padding: '18px 20px', minHeight: 90 }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: G, marginBottom: 10 }}>{label}</div>
      <AnimatePresence mode="wait">
        {text
          ? <motion.p key={text.slice(0,20)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#ddd', whiteSpace: 'pre-wrap' }}>{text}</motion.p>
          : <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: '0.88rem', color: '#333', fontStyle: 'italic' }}>Waiting...</motion.p>
        }
      </AnimatePresence>
    </div>
  )
}

export default function ResultPanel({ original, translated, detectedLang, audioUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
      style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 14, padding: '24px', marginTop: 16, borderLeft: `2px solid ${G}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>Translation Results</div>
        {detectedLang && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: 'rgba(181,242,61,0.08)', color: G }}>
            {detectedLang.toUpperCase()}
          </motion.span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Box label="Original" text={original} />
        <Box label="Translated" text={translated} />
      </div>

      <AnimatePresence>
        {audioUrl && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: 14, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.68rem', color: G, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Translated Audio</div>
            <audio controls src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${audioUrl}`} style={{ width: '100%', borderRadius: 8 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
