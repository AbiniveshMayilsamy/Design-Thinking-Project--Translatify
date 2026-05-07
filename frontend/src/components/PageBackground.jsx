import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

let mouseX = 0, mouseY = 0
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1
  })
}

// Floating particle field
function ParticleField() {
  const points = useRef()
  const count = 120
  const positions = new Float32Array(count * 3)
  const speeds = []
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    speeds.push(Math.random() * 0.4 + 0.1)
  }
  useFrame((state) => {
    if (!points.current) return
    const pos = points.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.008
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = state.clock.elapsedTime * 0.04
  })
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#b5f23d" size={0.04} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Pulsing wave rings
function WaveRings() {
  const rings = useRef([])
  useFrame((state) => {
    rings.current.forEach((r, i) => {
      if (!r) return
      const t = (state.clock.elapsedTime * 0.5 + i * 1.2) % 4
      r.scale.setScalar(0.5 + t * 0.8)
      r.material.opacity = Math.max(0, 0.4 - t * 0.1)
    })
  })
  return (
    <group position={[0, 0, -3]}>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} ref={el => rings.current[i] = el} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.015, 8, 80]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#b5f23d' : '#00e5cc'} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// Floating geometric shapes
function FloatingShapes() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.06
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.1
  })
  const shapes = [
    { pos: [-4, 2, -5], color: '#b5f23d', type: 'oct' },
    { pos: [4, -2, -6], color: '#9b6dff', type: 'tet' },
    { pos: [-3, -3, -4], color: '#00e5cc', type: 'oct' },
    { pos: [3, 3, -7], color: '#b5f23d', type: 'tet' },
    { pos: [0, -4, -5], color: '#9b6dff', type: 'oct' },
  ]
  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.pos}>
          {s.type === 'oct'
            ? <octahedronGeometry args={[0.3, 0]} />
            : <tetrahedronGeometry args={[0.35, 0]} />
          }
          <meshBasicMaterial color={s.color} wireframe transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  const group = useRef()
  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseX * 0.1, 0.03)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouseY * 0.06, 0.03)
  })
  return (
    <group ref={group}>
      <Stars radius={120} depth={50} count={3000} factor={2.5} saturation={0.2} fade speed={0.5} />
      <ParticleField />
      <WaveRings />
      <FloatingShapes />
    </group>
  )
}

export default function PageBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#020403']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 3, 2]} intensity={0.8} color="#b5f23d" />
        <pointLight position={[-3, -2, 1]} intensity={0.5} color="#9b6dff" />
        <Scene />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} opacity={1.0} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
