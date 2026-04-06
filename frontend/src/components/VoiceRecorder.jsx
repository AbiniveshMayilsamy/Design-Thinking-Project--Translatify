import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import socket from '../socket'
import { useAuth } from '../AuthContext'
import LangRow from './LangRow'
import ResultPanel from './ResultPanel'
import WaveForm from './WaveForm'
import { useToast } from '../ToastContext'

const G = '#b5f23d'

function getSupportedMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
  return types.find(t => MediaRecorder.isTypeSupported(t)) || ''
}

export default function VoiceRecorder({ langs }) {
  const toast = useToast()
  const { token } = useAuth()
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [srcLang, setSrcLang] = useState('auto')
  const [tgtLang, setTgtLang] = useState('en')
  const [result, setResult] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  useEffect(() => {
    const onStatus       = d => setStatusMsg(d.message)
    const onTranscript   = d => {
      setStatusMsg('Transcribed — translating...')
      setResult(p => ({ ...(p || {}), original: d.text, detectedLang: d.language }))
    }
    const onTranslation  = d => {
      setStatusMsg('Translated — generating audio...')
      setResult(p => ({ ...(p || {}), translated: d.text }))
    }
    const onTtsReady     = d => {
      setResult(p => ({ ...(p || {}), audioUrl: d.audio_url }))
      setProcessing(false)
      setStatusMsg('')
      toast('Translation complete!', 'success')
    }
    const onError        = d => {
      toast(d.message || 'An error occurred', 'error')
      setProcessing(false)
      setStatusMsg('')
    }

    socket.on('status',        onStatus)
    socket.on('transcription', onTranscript)
    socket.on('translation',   onTranslation)
    socket.on('tts_ready',     onTtsReady)
    socket.on('error',         onError)

    return () => {
      socket.off('status',        onStatus)
      socket.off('transcription', onTranscript)
      socket.off('translation',   onTranslation)
      socket.off('tts_ready',     onTtsReady)
      socket.off('error',         onError)
    }
  }, [])

  const sendAudio = async (chunks, mimeType) => {
    const blob = new Blob(chunks, { type: mimeType || 'audio/webm' })
    const buf  = await blob.arrayBuffer()
    if (buf.byteLength < 1000) {
      toast('Recording too short — please speak for at least 1 second', 'error')
      setProcessing(false)
      setStatusMsg('')
      return
    }
    setProcessing(true)
    setResult(null)
    setStatusMsg('Sending audio...')
    // Send as binary buffer — much faster than Array.from integer array
    socket.emit('stream_audio', {
      audio: buf,
      src_lang: srcLang,
      tgt_lang: tgtLang,
      token: token,
    })
  }

  const startRecording = async () => {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getSupportedMimeType()
      chunksRef.current = []

      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        sendAudio(chunksRef.current, mr.mimeType)
      }
      mr.start(250)
      mediaRef.current = mr
      setRecording(true)
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } catch {
      toast('Microphone access denied', 'error')
    }
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    setRecording(false)
    mediaRef.current?.stop()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 14, padding: '28px', borderLeft: '2px solid rgba(181,242,61,0.25)' }}>
        <div style={{ fontSize: '0.7rem', color: G, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 20 }}>Real-Time Voice Translation</div>

        <LangRow langs={langs} srcVal={srcLang} tgtVal={tgtLang} onSrc={setSrcLang} onTgt={setTgtLang} />
        <WaveForm active={recording} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 20 }}>
          <motion.button
            onClick={recording ? stopRecording : startRecording}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
            animate={recording
              ? { boxShadow: ['0 0 0 0 rgba(255,80,80,0.5)', '0 0 0 20px rgba(255,80,80,0)', '0 0 0 0 rgba(255,80,80,0)'] }
              : { boxShadow: [`0 0 0 0 rgba(181,242,61,0.4)`, `0 0 0 16px rgba(181,242,61,0)`, `0 0 0 0 rgba(181,242,61,0)`] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 72, height: 72, borderRadius: '50%', border: 'none', flexShrink: 0,
              background: recording ? '#ff4040' : G,
              color: recording ? '#fff' : '#000',
              fontSize: '1.6rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700,
            }}
          >{recording ? '⏹' : '🎙'}</motion.button>

          <div>
            <motion.div
              animate={{ color: recording ? '#ff4040' : '#333' }}
              style={{ fontSize: '2rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', letterSpacing: 2, lineHeight: 1 }}
            >{fmt(seconds)}</motion.div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 4 }}>
              {recording ? '● Recording — click to stop' : 'Click mic to start'}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {processing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 20 }}>
              <div style={{ fontSize: '0.78rem', color: G, marginBottom: 8 }}>{statusMsg || 'Processing...'}</div>
              <div className="progress-track"><div className="progress-fill" style={{ width: '75%' }} /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {result && (
        <ResultPanel
          original={result.original || ''}
          translated={result.translated || ''}
          detectedLang={result.detectedLang || ''}
          audioUrl={result.audioUrl || ''}
        />
      )}
    </motion.div>
  )
}
