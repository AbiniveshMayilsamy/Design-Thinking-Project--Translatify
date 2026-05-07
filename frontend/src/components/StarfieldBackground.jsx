import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

let mouseX = 0, mouseY = 0, scrollY = 0
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1
  })
  window.addEventListener('scroll', () => { scrollY = window.scrollY }, { passive: true })
}

// Glowing globe core
function Globe() {
  const globe = useRef()
  const wire = useRef()
  const dots = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  const dotPositions = useMemo(() => {
    const arr = []
    for (let lat = -80; lat <= 80; lat += 15) {
      for (let lon = 0; lon < 360; lon += 15) {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = lon * (Math.PI / 180)
        const r = 1.55
        arr.push([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)])
      }
    }
    return arr
  }, [])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    const sr = scrollY * 0.002
    if (globe.current) { globe.current.rotation.y = t * 0.1 + sr; globe.current.rotation.x = Math.sin(t * 0.07) * 0.06 }
    if (wire.current)  { wire.current.rotation.y  = t * 0.16 + sr * 1.3 }
    if (dots.current)  { dots.current.rotation.y  = t * 0.22 + sr * 1.6 }
    if (ring1.current) { ring1.current.rotation.z = t * 0.3 + sr }
    if (ring2.current) { ring2.current.rotation.z = -t * 0.2 + sr * 0.7 }
    if (ring3.current) { ring3.current.rotation.y = t * 0.15 }
  })

  return (
    <group>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial color="#0d2a0d" transparent opacity={0.9} />
      </mesh>
      {/* Main glass globe */}
      <mesh ref={globe}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial color="#071a07" emissive="#b5f23d" emissiveIntensity={0.06}
          roughness={0.05} metalness={0.2} transmission={0.7} thickness={2}
          transparent opacity={0.8} />
      </mesh>
      {/* Wireframe */}
      <mesh ref={wire}>
        <sphereGeometry args={[1.52, 24, 24]} />
        <meshBasicMaterial color="#b5f23d" wireframe transparent opacity={0.1} />
      </mesh>
      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[1.65, 32, 32]} />
        <meshBasicMaterial color="#b5f23d" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      {/* Surface dots */}
      <group ref={dots}>
        {dotPositions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.016, 5, 5]} />
            <meshBasicMaterial color={i % 4 === 0 ? '#00e5cc' : i % 6 === 0 ? '#9b6dff' : i % 9 === 0 ? '#ffb830' : '#b5f23d'} transparent opacity={0.75} />
          </mesh>
        ))}
      </group>
      {/* Orbit rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.014, 8, 128]} />
        <meshBasicMaterial color="#b5f23d" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[2.6, 0.009, 8, 128]} />
        <meshBasicMaterial color="#00e5cc" transparent opacity={0.28} />
      </mesh>
      <mesh ref={ring3} rotation={[0.2, 0, Math.PI / 2]}>
        <torusGeometry args={[2.0, 0.007, 8, 128]} />
        <meshBasicMaterial color="#9b6dff" transparent opacity={0.22} />
      </mesh>
      {/* Orbiting satellites */}
      <OrbitDot radius={2.2} speed={0.55} color="#b5f23d" tilt={Math.PI / 2} size={0.07} />
      <OrbitDot radius={2.6} speed={-0.38} color="#00e5cc" tilt={Math.PI / 3} size={0.055} />
      <OrbitDot radius={2.0} speed={0.7} color="#9b6dff" tilt={0.2} size={0.05} />
      <OrbitDot radius={2.2} speed={0.3} color="#ffb830" tilt={Math.PI / 1.5} size={0.045} />
    </group>
  )
}

function OrbitDot({ radius, speed, color, tilt, size }) {
  const ref = useRef()
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime * speed + scrollY * 0.002
    ref.current.position.set(radius * Math.cos(t), radius * Math.sin(t) * Math.sin(tilt), radius * Math.sin(t) * Math.cos(tilt))
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Aurora light beams
function AuroraBeams() {
  const beams = useRef([])
  useFrame((s) => {
    beams.current.forEach((b, i) => {
      if (!b) return
      b.rotation.z = s.clock.elapsedTime * 0.08 * (i % 2 === 0 ? 1 : -1)
      b.material.opacity = 0.04 + Math.abs(Math.sin(s.clock.elapsedTime * 0.4 + i)) * 0.06
    })
  })
  const colors = ['#b5f23d', '#00e5cc', '#9b6dff', '#b5f23d', '#ffb830']
  return (
    <>
      {colors.map((c, i) => (
        <mesh key={i} ref={el => beams.current[i] = el}
          position={[0, 0, -4]}
          rotation={[0, 0, (i / colors.length) * Math.PI * 2]}>
          <planeGeometry args={[0.08, 18]} />
          <meshBasicMaterial color={c} transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  )
}

// Floating particle cloud
function ParticleCloud() {
  const ref = useRef()
  const { positions, colors } = useMemo(() => {
    const count = 200
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [[0.71, 0.95, 0.24], [0, 0.9, 0.8], [0.61, 0.43, 1], [1, 0.72, 0.19]]
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.y = s.clock.elapsedTime * 0.05
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.03) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

function Scene() {
  const group = useRef()
  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseX * 0.18, 0.03)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouseY * 0.1, 0.03)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -scrollY * 0.0012, 0.06)
  })
  return (
    <group ref={group}>
      <Stars radius={160} depth={70} count={5000} factor={3.5} saturation={0.3} fade speed={0.7} />
      <AuroraBeams />
      <ParticleCloud />
      <Globe />
    </group>
  )
}

export default function StarfieldBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 52 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#010302']} />
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 3]} intensity={1.5} color="#b5f23d" />
        <pointLight position={[-5, -3, 2]} intensity={0.9} color="#9b6dff" />
        <pointLight position={[0, 4, -2]} intensity={0.7} color="#00e5cc" />
        <pointLight position={[3, -4, 1]} intensity={0.5} color="#ffb830" />
        <Scene />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.85} height={400} opacity={1.5} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0006, 0.0006]} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
