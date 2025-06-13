'use client'

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { AsciiRenderer, useGLTF, OrbitControls } from "@react-three/drei"
import { lerp } from "three/src/math/MathUtils.js"

// load the logo model
function LogoModel(){
    const meshRef = useRef<THREE.Mesh>(null!) // ref to the mesh
    const { scene } = useGLTF('/models/skye-logo.glb') // load the logo model

    // return the mesh with the logo model
        return (
            <group ref={meshRef}>
                <primitive object={scene} 
                scale={0.8}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                />
            </group>
        )
}

// render with intersection observer
function useInView() {
    const [isInView, setIsInView] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting)
            },
            { threshold: 0.1 } // Trigger when 10% visible
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    return [ref, isInView] as const
}

export default function AsciiLogo(){
    const [containerRef, isInView] = useInView()
    return (
        <div 
        ref={containerRef}
        id="three-scene"
        className="w-full h-96 relative m-16"
        style={{ width: '800px', height: '600px' }} // Add fixed dimensions
        >
            {isInView && ( // Only render Canvas when in view
                <Canvas
                    camera={{
                        position: [0, 0, 6],
                        fov: 75,
                    }}
                    gl={{ 
                        preserveDrawingBuffer: true,
                        antialias: true 
                    }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <AsciiRenderer 
                    renderIndex={1}
                    bgColor="transparent"
                    fgColor="#EF4444"
                    characters=" .:-+*=%@#"
                    invert={false}
                    resolution={0.15}
                    />
                    {/* Enhanced lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight 
                        position={[10, 10, 5]} 
                        intensity={0.8}
                    />
                    <pointLight position={[-10, -10, -5]} intensity={0.3} />

                    <LogoModel />
                    <OrbitControls enableZoom={false}/>
                </Canvas>
            )}
        </div>
    )
}

