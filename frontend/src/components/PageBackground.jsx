import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

let mouseX = 0, mouseY = 0
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1
  })
}

function WaterflowGradient() {
  const mesh = useRef()
  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uMouse:  { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color('#060d1a') }, // deep dark blue
    uColor2: { value: new THREE.Color('#9b6dff') }, // purple
    uColor3: { value: new THREE.Color('#b5f23d') }, // green
    uColor4: { value: new THREE.Color('#00e5cc') }, // teal
    uColor5: { value: new THREE.Color('#020308') }, // near black bg
  }), [])

  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime * 0.22
    uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.04
    uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.04
  })

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2  uMouse;
          uniform vec3  uColor1;
          uniform vec3  uColor2;
          uniform vec3  uColor3;
          uniform vec3  uColor4;
          uniform vec3  uColor5;

          float hash(vec2 p) {
            p = fract(p * vec2(234.34, 435.345));
            p += dot(p, p + 34.23);
            return fract(p.x * p.y);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1,0)), f.x),
              mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
              f.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p = p * 2.1 + vec2(1.7, 9.2);
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec2 uv = vUv;
            vec2 mouse = uMouse * 0.5 + 0.5;
            float mouseDist = length(uv - mouse);
            float mouseInfluence = smoothstep(0.6, 0.0, mouseDist) * 0.12;

            vec2 q = vec2(
              fbm(uv + vec2(0.0, 0.0) + uTime * 0.15),
              fbm(uv + vec2(5.2, 1.3) + uTime * 0.12)
            );
            vec2 r = vec2(
              fbm(uv + 4.0 * q + vec2(1.7, 9.2) + uTime * 0.1),
              fbm(uv + 4.0 * q + vec2(8.3, 2.8) + uTime * 0.08)
            );

            float f = fbm(uv + 4.0 * r + mouseInfluence);

            vec3 col = mix(uColor5, uColor1, clamp(f * 2.0, 0.0, 1.0));
            col = mix(col, uColor2, clamp(f * f * 3.5, 0.0, 1.0) * 0.3);
            col = mix(col, uColor3, clamp(length(q) * 1.8, 0.0, 1.0) * 0.2);
            col = mix(col, uColor4, clamp(r.x * r.y * 2.5, 0.0, 1.0) * 0.18);

            float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.6);
            col *= vignette * 0.65 + 0.35;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  )
}

function Stars() {
  const ref = useRef()
  const { positions, colors } = useMemo(() => {
    const count = 600
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
      const r = Math.random()
      if (r < 0.25) { col[i*3]=0.61; col[i*3+1]=0.43; col[i*3+2]=1 }
      else if (r < 0.4) { col[i*3]=0.71; col[i*3+1]=0.95; col[i*3+2]=0.24 }
      else { col[i*3]=1; col[i*3+1]=1; col[i*3+2]=1 }
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.y = s.clock.elapsedTime * 0.005 + mouseX * 0.018
    ref.current.rotation.x = s.clock.elapsedTime * 0.003 + mouseY * 0.012
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export default function PageBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 1], near: 0.1, far: 100 }} dpr={[1, 1.5]}>
        <WaterflowGradient />
        <Stars />
      </Canvas>
    </div>
  )
}
