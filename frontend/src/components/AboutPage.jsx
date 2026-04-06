import { motion } from 'framer-motion'

const G = '#b5f23d'

const STACK = [
  { name: 'Whisper large-v3', desc: "OpenAI's most accurate ASR model — beam search, VAD filter, word timestamps" },
  { name: 'NLLB-200', desc: "Meta's No Language Left Behind — 200 languages, neural machine translation" },
  { name: 'gTTS', desc: 'Google Text-to-Speech for natural audio synthesis in 28+ languages' },
  { name: 'Flask + SocketIO', desc: 'Python backend with real-time WebSocket for live voice streaming' },
  { name: 'React + Vite', desc: 'Fast modern frontend with Framer Motion animations' },
  { name: 'MoviePy', desc: 'Video processing — audio extraction from any video format' },
]

const ARCH = ['Voice / File Input', 'Whisper ASR', 'NLLB-200', 'gTTS Output']

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '72px 64px 100px', maxWidth: 1200 }}>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 64 }}>
        <div style={{ fontSize: '0.72rem', color: G, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>ABOUT</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1, marginBottom: 20 }}>
          Built for<br /><span style={{ color: G }}>Design Thinking</span>
        </h1>
        <p style={{ color: '#888', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 560 }}>
          Translatify is a full-stack AI translation system combining cutting-edge ML models
          with a minimal, accessible UI to break language barriers in real time.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 12, padding: '36px 40px', marginBottom: 64, borderLeft: `3px solid ${G}` }}>
        <div style={{ fontSize: '0.72rem', color: G, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>MISSION</div>
        <p style={{ color: '#999', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 640 }}>
          To make communication accessible across all languages using AI — enabling real-time voice translation,
          audio file processing, and video subtitle generation with state-of-the-art machine learning models.
        </p>
      </motion.div>

      {/* Tech Stack */}
      <div style={{ fontSize: '0.72rem', color: G, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 32 }}>TECHNOLOGY STACK</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 64 }}>
        {STACK.map((s, i) => (
          <motion.div key={s.name}
            initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
            whileHover={{ background: 'rgba(181,242,61,0.04)' }}
            style={{ background: 'rgba(0,0,0,0.45)', padding: '28px', transition: 'background 0.2s' }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: G, marginBottom: 6 }}>{s.name}</div>
            <div style={{ fontSize: '0.83rem', color: '#666', lineHeight: 1.6 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Architecture */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 12, padding: '36px 40px' }}>
        <div style={{ fontSize: '0.72rem', color: G, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 28 }}>PIPELINE</div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
          {ARCH.map((step, i) => (
            <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, color: i === 0 ? '#fff' : G }}>
                {step}
              </div>
              {i < ARCH.length - 1 && <div style={{ padding: '0 12px', color: '#444', fontSize: '1.2rem' }}>→</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
