import { motion, AnimatePresence } from 'framer-motion'

const G = '#b5f23d'
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`

export default function SegmentList({ segments }) {
  if (!segments?.length) return null
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 14, padding: '24px', marginTop: 16, borderLeft: `2px solid ${G}` }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 16 }}>Subtitle Segments</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
        <AnimatePresence>
          {segments.map((seg, i) => (
            <motion.div key={i} className="segment-item"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="segment-time">{fmt(seg.start)}<br />→ {fmt(seg.end)}</div>
              <div>
                <div className="segment-orig">{seg.original}</div>
                <div className="segment-trans">{seg.translated}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
