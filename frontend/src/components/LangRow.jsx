import { motion } from 'framer-motion'

const G = '#b5f23d'

export default function LangRow({ langs, srcVal, tgtVal, onSrc, onTgt }) {
  const entries = Object.entries(langs)
  const swap = () => { const t = srcVal; onSrc(tgtVal); onTgt(t) }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end', marginBottom: 24 }}>
      <div>
        <label style={{ fontSize: '0.7rem', color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
          Source
        </label>
        <select className="select" value={srcVal} onChange={e => onSrc(e.target.value)}>
          <option value="auto">Auto Detect</option>
          {entries.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
        </select>
      </div>

      <motion.button
        onClick={swap}
        whileHover={{ scale: 1.15, rotate: 180, color: G }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{
          width: 40, height: 40, borderRadius: '50%',
          border: 'none', background: '#111',
          color: '#444', fontSize: '1.1rem',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.2s',
        }}
      >⇄</motion.button>

      <div>
        <label style={{ fontSize: '0.7rem', color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
          Target
        </label>
        <select className="select" value={tgtVal} onChange={e => onTgt(e.target.value)}>
          {entries.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
        </select>
      </div>
    </div>
  )
}
