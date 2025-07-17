'use client'


import ServiceCards from './ServiceCards';
import Stats from './Stats';
import Process from './Process';
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useEffect, useState } from 'react';

// Register plugins
gsap.registerPlugin(SplitText)
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(TextPlugin)
gsap.registerPlugin(ScrambleTextPlugin) 

function Services() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Add a small delay to match your GraphQL components
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 800) // Adjust this timing to match your Hero component loading
        
        return () => clearTimeout(timer)
    }, [])

    return (
        <section id='services-section' 
                 className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <ServiceCards />
            <Stats />
            <Process />
        </section>
    )
}   

export default Services;

