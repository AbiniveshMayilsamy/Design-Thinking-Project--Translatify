import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'

const G = '#b5f23d'
const fmt = b => b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB'

export default function DropZone({ accept, icon, label, hint, file, onFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept, multiple: false, onDrop: f => f[0] && onFile(f[0]),
  })

  return (
    <div>
      <motion.div
        {...getRootProps()}
        animate={{ background: isDragActive ? 'rgba(181,242,61,0.07)' : 'rgba(0,0,0,0.4)', scale: isDragActive ? 1.01 : 1 }}
        whileHover={{ background: 'rgba(0,0,0,0.5)' }}
        transition={{ duration: 0.2 }}
        style={{
          borderRadius: 12, padding: '40px 24px',
          textAlign: 'center', cursor: 'pointer',
          outline: isDragActive ? `2px dashed ${G}` : '2px dashed rgba(255,255,255,0.08)',
          outlineOffset: -2,
          transition: 'outline 0.2s',
        }}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: [1, 1.2, 1] } : { y: [0, -4, 0] }}
          transition={isDragActive ? { duration: 0.4 } : { duration: 2.5, repeat: Infinity }}
          style={{ fontSize: '2.4rem', marginBottom: 12 }}
        >{icon}</motion.div>
        <div style={{ color: '#555', fontSize: '0.9rem' }}>
          {isDragActive
            ? <span style={{ color: G, fontWeight: 700 }}>Drop it here!</span>
            : <>{label} or <span style={{ color: G, fontWeight: 600, cursor: 'pointer' }}>browse</span></>}
        </div>
        <div style={{ color: '#333', fontSize: '0.75rem', marginTop: 6 }}>{hint}</div>
      </motion.div>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 10, padding: '12px 16px',
              background: 'rgba(0,0,0,0.5)', borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 12,
              borderLeft: `2px solid ${G}`,
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>{file.name}</div>
              <div style={{ color: '#444', fontSize: '0.78rem' }}>{fmt(file.size)}</div>
            </div>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: G, fontWeight: 700 }}>✓</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
