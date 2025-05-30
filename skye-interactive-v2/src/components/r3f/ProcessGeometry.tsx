

'use client'

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

// basic geometry
function Geometry() {
    const meshRef = useRef<THREE.Mesh>(null!)

    // rotate
    useFrame((state, delta) => {
        if(meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5
            meshRef.current.rotation.x += delta * 0.5
        }
    })

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
        </mesh>
    )
}


// main r3f component
function ThreeScene() {
    return (
        <div className="w-full h-96 relative">
            <Canvas
                // camera
                camera={{
                    position: [0, 0, 6],
                    fov: 75,
                }}
            >
                {/* lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                {/* geometry / 3d content */}
                <Geometry />

            </Canvas>
        </div>
    )
}

export default ThreeScene



