import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

let scrollY = 0, mouseX = 0, mouseY = 0
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => { scrollY = window.scrollY }, { passive: true })
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1
  })
}

function Globe() {
  const globeRef = useRef()
  const wireRef = useRef()
  const ringRef1 = useRef()
  const ringRef2 = useRef()
  const dotsRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scrollRot = scrollY * 0.003

    // Main globe rotates with scroll
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.12 + scrollRot
      globeRef.current.rotation.x = Math.sin(t * 0.08) * 0.08
    }
    // Wireframe slightly faster
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.18 + scrollRot * 1.2
      wireRef.current.rotation.x = Math.sin(t * 0.1) * 0.1
    }
    // Orbit rings
    if (ringRef1.current) {
      ringRef1.current.rotation.z = t * 0.25 + scrollRot * 0.8
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * 0.18 + scrollRot * 0.6
      ringRef2.current.rotation.x = Math.PI / 3
    }
    // Dots orbit
    if (dotsRef.current) {
      dotsRef.current.rotation.y = t * 0.3 + scrollRot * 1.5
    }
  })

  // Generate lat/lon grid dots
  const dotPositions = []
  for (let lat = -80; lat <= 80; lat += 20) {
    for (let lon = 0; lon < 360; lon += 20) {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = lon * (Math.PI / 180)
      const r = 1.52
      dotPositions.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ])
    }
  }

  return (
    <group position={[0, 0, 0]}>

      {/* Core globe — subtle green glass */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#0a1a0a"
          emissive="#b5f23d"
          emissiveIntensity={0.04}
          roughness={0.1}
          metalness={0.3}
          transmission={0.6}
          thickness={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.52, 28, 28]} />
        <meshBasicMaterial
          color="#b5f23d"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Glowing outer shell */}
      <mesh>
        <sphereGeometry args={[1.58, 32, 32]} />
        <meshBasicMaterial
          color="#b5f23d"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Grid dots on surface */}
      <group ref={dotsRef}>
        {dotPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial
              color={i % 5 === 0 ? '#00e5cc' : i % 7 === 0 ? '#9b6dff' : '#b5f23d'}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Orbit ring 1 — equatorial */}
      <mesh ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.012, 8, 120]} />
        <meshBasicMaterial color="#b5f23d" transparent opacity={0.35} />
      </mesh>

      {/* Orbit ring 2 — tilted */}
      <mesh ref={ringRef2} rotation={[Math.PI / 3, 0.3, 0]}>
        <torusGeometry args={[2.4, 0.008, 8, 120]} />
        <meshBasicMaterial color="#00e5cc" transparent opacity={0.25} />
      </mesh>

      {/* Orbit ring 3 — polar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.9, 0.006, 8, 120]} />
        <meshBasicMaterial color="#9b6dff" transparent opacity={0.2} />
      </mesh>

      {/* Orbiting dot on ring 1 */}
      <OrbitingDot radius={2.1} speed={0.5} color="#b5f23d" tilt={Math.PI / 2} />
      <OrbitingDot radius={2.4} speed={-0.35} color="#00e5cc" tilt={Math.PI / 3} />
      <OrbitingDot radius={1.9} speed={0.6} color="#9b6dff" tilt={0} />

    </group>
  )
}

function OrbitingDot({ radius, speed, color, tilt }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + scrollY * 0.002
    ref.current.position.set(
      radius * Math.cos(t),
      radius * Math.sin(t) * Math.sin(tilt),
      radius * Math.sin(t) * Math.cos(tilt)
    )
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 10, 10]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function Scene() {
  const group = useRef()
  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseX * 0.15, 0.03)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouseY * 0.08, 0.03)
  })
  return (
    <group ref={group}>
      <Stars radius={140} depth={60} count={3500} factor={3} saturation={0.2} fade speed={0.6} />
      <Globe />
    </group>
  )
}

export default function StarfieldBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#020403']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 3]} intensity={1.2} color="#b5f23d" />
        <pointLight position={[-4, -3, 2]} intensity={0.7} color="#9b6dff" />
        <pointLight position={[0, 3, -2]} intensity={0.5} color="#00e5cc" />
        <Scene />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} opacity={1.2} />
          <Noise opacity={0.025} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
