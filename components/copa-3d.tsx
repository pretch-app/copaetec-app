"use client"

import { Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, OrbitControls, useGLTF, ContactShadows, MeshTransmissionMaterial } from "@react-three/drei"
import { Trophy } from "lucide-react"

function Model(props: any) {
  const { scene } = useGLTF("/copa.glb")
  
  // Evitar que el modelo desaparezca al girar (Frustum Culling fix)
  useEffect(() => {
    scene.traverse((child: any) => {
      child.frustumCulled = false
      
      // Aumentar los reflejos específicamente para el vidrio (si el material es de transmisión)
      if (child.isMesh && child.material && child.material.transmission > 0) {
        child.material.envMapIntensity = 2.5 // Fuerte multiplicador de reflejos
        child.material.roughness = 0.05 // Vidrio liso para reflejos claros
        child.material.needsUpdate = true
      }
    })
  }, [scene])
  
  return (
    <primitive 
      object={scene} 
      {...props}
      frustumCulled={false}
    />
  )
}

export function Copa3D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full min-h-[400px] flex items-center justify-center ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }} gl={{ antialias: true, alpha: true }}>
        {/* Dramatic stage lighting */}
        <ambientLight intensity={0.3} color="#ffd700" />
        {/* Key light - warm golden from above */}
        <spotLight position={[0, 15, 8]} angle={0.3} penumbra={0.8} intensity={1.6} color="#ffb142" castShadow />
        {/* Rim light - blue accent from behind */}
        <spotLight position={[-8, 5, -10]} angle={0.4} penumbra={1} intensity={1.2} color="#6495ed" />
        {/* Fill light - subtle warm from below */}
        <pointLight position={[0, -8, 5]} intensity={0.4} color="#ffd700" />
        {/* Secondary accent */}
        <pointLight position={[10, 3, 5]} intensity={0.6} color="#ffffff" />

        <Suspense fallback={null}>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate={false} 
            makeDefault 
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
            <Model scale={4.8} position={[0, -0.2, 0]} rotation={[0, 0, 0]} />
          </Float>

          {/* Studio environment for rich reflections */}
          <Environment preset="studio" environmentIntensity={2} />
          
          <ContactShadows position={[0, -2.0, 0]} opacity={0.5} scale={12} blur={2.5} far={5} color="#b8860b" />
        </Suspense>
      </Canvas>
      
      {/* Loading Fallback (managed via simple HTML overlay for immediate visual feedback before 3D loads) */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-20">
        <Trophy className="w-32 h-32 animate-pulse" />
      </div>
    </div>
  )
}

// Preload the model so it starts downloading immediately
useGLTF.preload("/copa.glb")
