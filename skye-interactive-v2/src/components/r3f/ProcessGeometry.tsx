'use client'

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { lerp } from "three/src/math/MathUtils.js"

// scroll progress function
function useScrollProgress () {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const stepsContainer = document.querySelector('.steps-container');
            if (!stepsContainer) return;

            const rect = stepsContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const containerHeight = (stepsContainer as HTMLElement).offsetHeight;
            const stickyOffset = 80; // Corresponds to Tailwind's `top-20` (5rem)

            // Calculate the range of scroll we care about
            const scrollStart = stickyOffset;
            const scrollEnd = windowHeight - containerHeight;

            // Calculate progress, clamped between 0 and 1
            const rawProgress = (scrollStart - rect.top) / (scrollStart - scrollEnd);
            const scrollProgress = Math.max(0, Math.min(1, rawProgress));

            setProgress(scrollProgress);
        };

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


// Logo model function for the 3d scene
function LogoModel(){
    const meshRef = useRef<THREE.Mesh>(null!)
    const { scene } = useGLTF('/models/skye-logo.glb')
    const progress = useScrollProgress()

    // Define start and end states for animation
    const startState = {
        scale: 0.5,
        position: [0, 8, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number]
    }
    
    const endState = {
        scale: 0.5,
        position: [0, -5, 0] as [number, number, number], 
        rotation: [Math.PI/2, Math.PI * 2, 0] as [number, number, number]
    }

    // Interpolate values based on scroll progress
    const currentScale = lerp(startState.scale, endState.scale, progress)
    const currentPosition = lerpVector3(startState.position, endState.position, progress)
    const currentRotation = lerpVector3(startState.rotation, endState.rotation, progress)

    console.log(currentScale)
    console.log(currentPosition)

    // Rotate the object
    useFrame((state, delta) => {
        if(meshRef.current){
            meshRef.current.rotation.y += delta * 0.07
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
    const [containerHeight, setContainerHeight] = useState('100vh');

    useEffect(() => {
        const stepsContainer = document.querySelector('.steps-container');

        if (stepsContainer) {
            const resizeObserver = new ResizeObserver(entries => {
                if (entries[0]) {
                    const newHeight = entries[0].contentRect.height;
                    setContainerHeight(`${newHeight}px`);
                }
            });

            resizeObserver.observe(stepsContainer);

            const initialHeight = (stepsContainer as HTMLElement).offsetHeight;
            if (initialHeight > 0) {
                setContainerHeight(`${initialHeight}px`);
            }

            return () => {
                resizeObserver.unobserve(stepsContainer);
            };
        }
    }, []);
    

    return (
        <div 
        id="process-three-scene"
        className="w-full relative sticky top-20"
        style={{ width: '100%', height: containerHeight }}
        >
            
                <Canvas
                    camera={{
                        position: [0, 0, 12],
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



