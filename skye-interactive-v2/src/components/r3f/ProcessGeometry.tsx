'use client'

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { lerp } from "three/src/math/MathUtils.js"



function useScrollProgress () {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const processSection = document.getElementById('process-section')
            if (!processSection) return

            const rect = processSection.getBoundingClientRect()
            const sectionHeight = processSection.offsetHeight
            const windowHeight = window.innerHeight

            // calculate smooth progress through the section
            const scrollProgress = Math.max(0, Math.min(1,
                (windowHeight - rect.top) / (sectionHeight + windowHeight)
            ))

            setProgress(scrollProgress)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return progress
}

// linear interpolation helper
function lerpVector3(start: [number, number, number], end: [number, number, number], progress: number): [number, number, number] {
    return [
        lerp(start[0], end[0], progress),
        lerp(start[1], end[1], progress),
        lerp(start[2], end[2], progress)
    ]
}



function LogoModel(){
    const meshRef = useRef<THREE.Mesh>(null!)
    const { scene } = useGLTF('/models/skye-logo.glb')
    const progress = useScrollProgress()

    // Define start and end states for animation
    const startState = {
        scale: 0.1,
        position: [3, 3, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number]
    }
    
    const endState = {
        scale: 1.2,
        position: [-2, -2, 0] as [number, number, number], 
        rotation: [Math.PI/2, Math.PI * 4, 0] as [number, number, number]
    }

    // Interpolate values based on scroll progress
    const currentScale = lerp(startState.scale, endState.scale, progress)
    const currentPosition = lerpVector3(startState.position, endState.position, progress)
    const currentRotation = lerpVector3(startState.rotation, endState.rotation, progress)

    useFrame((state, delta) => {
        if(meshRef.current){
            meshRef.current.rotation.y += delta * 0.03
        }
    })

        return (
            <group ref={meshRef}>
                <primitive object={scene} 
                scale={currentScale}
                position={currentPosition}
                rotation={currentRotation}
                />
            </group>
        )
}




// main r3f component
function ThreeScene() {

    return (
        <div 
        id="three-scene"
        className="w-full h-96 relative sticky top-20 ">
            <Canvas
                camera={{
                    position: [0, 0, 6],
                    fov: 75,
                }}
            >
                {/* Enhanced lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={0.8}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.3} />

                <LogoModel />
            </Canvas>
            
            
        </div>
    )
}

export default ThreeScene



