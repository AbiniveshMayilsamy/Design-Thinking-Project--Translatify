import { useEffect, useRef, useState } from 'react'

export default function CursorEffect() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailsRef = useRef([])
  const pos = useRef({ x: -100, y: -100 })
  const smooth = useRef({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none'

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }

      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.opacity = '1'
        dotRef.current.style.left = e.clientX - 4 + 'px'
        dotRef.current.style.top = e.clientY - 4 + 'px'
      }

      // Spawn trail particle
      spawnTrail(e.clientX, e.clientY)
    }

    let trailCount = 0
    const spawnTrail = (x, y) => {
      trailCount++
      if (trailCount % 3 !== 0) return // every 3rd move

      const el = document.createElement('div')
      const size = Math.random() * 6 + 4
      const colors = ['#b5f23d', '#00e5cc', '#9b6dff', '#ffb830']
      const color = colors[Math.floor(Math.random() * colors.length)]

      el.style.cssText = `
        position: fixed;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 99998;
        box-shadow: 0 0 ${size * 2}px ${color};
        transition: opacity 0.5s, transform 0.5s;
        opacity: 0.8;
      `
      document.body.appendChild(el)

      requestAnimationFrame(() => {
        el.style.opacity = '0'
        el.style.transform = `scale(0.1) translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`
      })

      setTimeout(() => el.remove(), 500)
    }

    // Smooth ring animation
    let raf
    const animate = () => {
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.12
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = smooth.current.x - 20 + 'px'
        ringRef.current.style.top = smooth.current.y - 20 + 'px'
        ringRef.current.style.opacity = '1'
      }
      raf = requestAnimationFrame(animate)
    }

    // Hover expand on interactive elements
    const addHover = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea, label').forEach(el => {
        el.style.cursor = 'none'
        el.addEventListener('mouseenter', () => {
          if (ringRef.current) {
            ringRef.current.style.width = '52px'
            ringRef.current.style.height = '52px'
            ringRef.current.style.borderColor = '#00e5cc'
            ringRef.current.style.boxShadow = '0 0 20px rgba(0,229,204,0.5)'
          }
          if (dotRef.current) {
            dotRef.current.style.background = '#00e5cc'
            dotRef.current.style.boxShadow = '0 0 12px #00e5cc'
            dotRef.current.style.transform = 'scale(1.5)'
          }
        })
        el.addEventListener('mouseleave', () => {
          if (ringRef.current) {
            ringRef.current.style.width = '40px'
            ringRef.current.style.height = '40px'
            ringRef.current.style.borderColor = '#b5f23d'
            ringRef.current.style.boxShadow = '0 0 14px rgba(181,242,61,0.4)'
          }
          if (dotRef.current) {
            dotRef.current.style.background = '#b5f23d'
            dotRef.current.style.boxShadow = '0 0 8px #b5f23d'
            dotRef.current.style.transform = 'scale(1)'
          }
        })
      })
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)

    // Re-apply hover listeners when DOM changes
    const observer = new MutationObserver(addHover)
    observer.observe(document.body, { childList: true, subtree: true })
    addHover()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <>
      {/* Lagging ring */}
      <div ref={ringRef} style={{
        position: 'fixed',
        width: 40, height: 40,
        borderRadius: '50%',
        border: '1.5px solid #b5f23d',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        boxShadow: '0 0 14px rgba(181,242,61,0.4)',
        transition: 'width 0.2s, height 0.2s, border-color 0.2s, box-shadow 0.2s',
        willChange: 'left, top',
        mixBlendMode: 'screen',
      }} />

      {/* Instant dot */}
      <div ref={dotRef} style={{
        position: 'fixed',
        width: 8, height: 8,
        borderRadius: '50%',
        background: '#b5f23d',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        boxShadow: '0 0 8px #b5f23d, 0 0 20px rgba(181,242,61,0.6)',
        transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
        willChange: 'left, top',
        mixBlendMode: 'screen',
      }} />
    </>
  )
}
