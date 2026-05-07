import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

let mouseX = 0, mouseY = 0
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1
  })
}

// Energy grid
function EnergyGrid() {
  const group = useRef()
  useFrame((s) => {
    if (!group.current) return
    group.current.rotation.x = Math.PI / 2.5 + Math.sin(s.clock.elapsedTime * 0.15) * 0.05
    group.current.position.y = -2 + Math.sin(s.clock.elapsedTime * 0.2) * 0.3
    group.current.material && (group.current.material.opacity = 0.06 + Math.sin(s.clock.elapsedTime * 0.5) * 0.02)
  })
  return (
    <group ref={group} position={[0, -2, -3]} rotation={[Math.PI / 2.5, 0, 0]}>
      {/* Horizontal lines */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`h${i}`} position={[0, (i - 6) * 0.7, 0]}>
          <planeGeometry args={[16, 0.012]} />
          <meshBasicMaterial color="#b5f23d" transparent opacity={0.08} />
        </mesh>
      ))}
      {/* Vertical lines */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={`v${i}`} position={[(i - 8) * 0.9, 0, 0]}>
          <planeGeometry args={[0.012, 10]} />
          <meshBasicMaterial color="#b5f23d" transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  )
}

// Flowing particle streams
function ParticleStreams() {
  const ref = useRef()
  const { positions, colors, speeds } = useMemo(() => {
    const count = 300
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = []
    const palette = [
      [0.71, 0.95, 0.24],
      [0, 0.9, 0.8],
      [0.61, 0.43, 1.0],
      [1, 0.72, 0.19],
      [1, 1, 1],
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
      spd.push((Math.random() - 0.5) * 0.012)
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]
    }
    return { positions: pos, colors: col, speeds: spd }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < 300; i++) {
      pos[i * 3 + 1] += speeds[i]
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5
      if (pos[i * 3 + 1] < -5) pos[i * 3 + 1] = 5
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

// Pulsing concentric rings
function PulseRings() {
  const rings = useRef([])
  useFrame((s) => {
    rings.current.forEach((r, i) => {
      if (!r) return
      const t = (s.clock.elapsedTime * 0.45 + i * 0.9) % 3.5
      r.scale.setScalar(0.3 + t * 1.1)
      r.material.opacity = Math.max(0, 0.5 - t * 0.14)
    })
  })
  const colors = ['#b5f23d', '#00e5cc', '#9b6dff', '#ffb830', '#b5f23d']
  return (
    <group position={[0, 0, -4]}>
      {colors.map((c, i) => (
        <mesh key={i} ref={el => rings.current[i] = el} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.018, 8, 80]} />
          <meshBasicMaterial color={c} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// Floating glowing orbs
function GlowOrbs() {
  const orbs = useRef([])
  const data = useMemo(() => [
    { pos: [-5, 2, -6], color: '#b5f23d', speed: 0.4, r: 0.35 },
    { pos: [5, -2, -7], color: '#9b6dff', speed: 0.6, r: 0.45 },
    { pos: [-3, -3, -5], color: '#00e5cc', speed: 0.5, r: 0.3 },
    { pos: [4, 3, -8], color: '#ffb830', speed: 0.35, r: 0.4 },
    { pos: [0, -4, -6], color: '#b5f23d', speed: 0.7, r: 0.25 },
  ], [])

  useFrame((s) => {
    orbs.current.forEach((o, i) => {
      if (!o) return
      const d = data[i]
      o.position.y = d.pos[1] + Math.sin(s.clock.elapsedTime * d.speed) * 0.5
      o.position.x = d.pos[0] + Math.cos(s.clock.elapsedTime * d.speed * 0.7) * 0.3
    })
  })

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={el => orbs.current[i] = el} position={d.pos}>
          <sphereGeometry args={[d.r, 16, 16]} />
          <meshBasicMaterial color={d.color} transparent opacity={0.18} />
        </mesh>
      ))}
    </>
  )
}

function Scene() {
  const group = useRef()
  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseX * 0.12, 0.03)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouseY * 0.07, 0.03)
  })
  return (
    <group ref={group}>
      <Stars radius={130} depth={60} count={4500} factor={3} saturation={0.25} fade speed={0.6} />
      <EnergyGrid />
      <ParticleStreams />
      <PulseRings />
      <GlowOrbs />
    </group>
  )
}

export default function PageBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#010302']} />
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 2]} intensity={1.2} color="#b5f23d" />
        <pointLight position={[-4, -3, 1]} intensity={0.8} color="#9b6dff" />
        <pointLight position={[0, 3, -1]} intensity={0.6} color="#00e5cc" />
        <Scene />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.85} height={400} opacity={1.4} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0005, 0.0005]} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
